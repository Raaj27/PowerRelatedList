public class LightningHistoryCtrl {

    @AuraEnabled
    public static string getHistory(string objectAPIName, string recordId){ 
          
        string parentFieldName = getParentName(objectAPIName);
        string query = 'select field, NewValue, OldValue, CreatedDate, CreatedById from ' + getObjectHistoryName(objectAPIName) + ' where ' + parentFieldName + ' =\'' + recordId + '\' order by CreatedDate DESC limit 5000'; 
		list<sobject> results = database.query(query); 
        list<sobject> finalResults = new list<sobject>();       
        
        //build a field describe map so we can use it in the fields later;
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objectAPIName);                
        Schema.DescribeSObjectResult sobjResult = targetType.getDescribe();        
        Map<String, Schema.SObjectField> fieldMap = sobjResult.fields.getMap();
        //system.debug(fieldMap);

        map<String, Schema.DescribeFieldResult> fieldDescribeMap = new map<String, Schema.DescribeFieldResult>();
        
        //system.debug(fieldDescribeMap);

        set<string> resultsFields = new set<string>();
        set<string> referenceFields = new set<string>();
        set<Id> referenceFieldIds = new set<Id>();

        set<id> userIds = new set<id>();
        //TODO: check for and handle ID fields (replace with related object name)
        //TODO: perm check on the field


        //special testing scenario
        if (Test.isRunningTest()){
            userIds.add(UserInfo.getUserId());
            resultsFields.add('Name');
        }
        
        for (sobject so:results){
            userIds.add( (Id)so.get('CreatedById') ); //IDs will will become a usermap
            resultsFields.add((string)so.get('Field')); //will become a list of fields to get describe for            
        }

        //iterate the resultsFields and get their describe
        for (string fieldName:resultsFields){
            //system.debug('resultField is ' + fieldName);
            try {
                Schema.DescribeFieldResult descField = fieldMap.get(fieldName).getDescribe();
                fieldDescribeMap.put(fieldName, descField);                
            } catch (NullPointerException e){
                try {
                    Schema.DescribeFieldResult descField = fieldMap.get(fieldName + 'Id').getDescribe();                    
                    fieldDescribeMap.put(fieldName, descField);
                } catch (exception f){
                    system.debug('couldn\'t find describe for field ' + fieldName);
                }
            } catch (exception e) {
                system.debug('couldn\'t find describe for field ' + fieldName);
            }            
        }

        /*system.debug('fieldDescribeMap : ');
        for (string s:fieldDescribeMap.keySet()){
            system.debug(s);  
            system.debug(fieldDescribeMap.get(s));
        }*/

        //access check, remove dual-null weirdness!
        for (sobject so:results){
            string field = (string)so.get('Field');
            Schema.DescribeFieldResult describe = fieldDescribeMap.get(field);
            if (
                    (describe == null || describe.isAccessible()) //security check!
                    &&
                    ( (string)so.get('OldValue') != null || (string)so.get('NewValue') != null ) //hide the weird stuff with no values
                
                ){                
                    finalResults.add(so); 
            } 
        }
        
        map<id, user> userMap = new map<id, user>([select Name from User where id in:userIds]);
        

        resultsAndUserMap temp = new resultsAndUserMap();
        temp.results = finalResults;
        temp.userMap = userMap;
        temp.parentFieldName = parentFieldName;
        temp.ObjectName = sobjResult.getLabel();
        system.debug(temp);
        
        return JSON.serialize(temp);
        
    }

    
    public class resultsAndUserMap {
        public string ObjectName {get;set;}
        public list<sobject> results {get;set;}
        public map<id, user> userMap {get;set;}
        public string parentFieldName {get;set;}
    }
    
    @TestVisible
    private static string getObjectHistoryName(string objectAPIName){
        if (objectAPIName.contains('__c')){
            return objectAPIName.replace('__c', '__History');
        } 
        if (objectAPIName == 'Opportunity'){
            return 'OpportunityFieldHistory';
        }
        return objectAPIName + 'History';

    }
    
    @TestVisible
    private static string getParentName(string objectAPIName){
        if (objectAPIName.contains('__c')){
            return 'ParentId' ;
        } 
        return objectAPIName + 'Id';
    }
}