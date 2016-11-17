({
    doInit : function(component, event, helper) {
        component.set("v.showSpinner", true);
        //TODO: do a cleanup on displayFields parameter to make sure it's not invalid (commas, spaces, etc)        
        //build the query
        
        //get the describe
        helper.query(component, helper.buildQuery(component));
        helper.getPlural(component);
        //create placeholder record with only the lookup populated
        helper.setNewRecord(component);
    },
    
    filter: function (component, event, helper){
        helper.filter(component);
    },
    
    createRecord : function (component) {
        //set the add value object
        component.set("v.adding", true);        
    },
    
    handleFieldChange : function (component, event){
        //console.log("heard field change");
        var localObject = component.get("v.newRecord");
        var objectChange = event.getParam("object");
        var newObject = _.merge(localObject, objectChange);
        //console.log(newObject);
        component.set("v.newRecord", _.merge(localObject, objectChange));
        
        //no debug version
        //component.set("v.newRecord", _.merge(component.get("v.newRecord"), event.getParam("object")));
                
    },
    
    saveNewRecord : function (component, event, helper){
        var action = component.get("c.create");

        action.setParams({
            "objtype" : component.get("v.objectName"), 
            "fields" :JSON.stringify(component.get("v.newRecord"))
        })
        action.setCallback(self, function (a){         
            
            if (a.getState() === "SUCCESS") {
                var response = JSON.parse(a.getReturnValue());
                var results = component.get("v.results");
                results.push(response.object);            
                
                component.set("v.results", results); //set results
                helper.filter(component);
                component.set("v.adding", false); //close the modal
                helper.setNewRecord(component); //ready for next one

            } else if (a.getState() === "ERROR"){ //fires toasts with any issues
                var appEvent = $A.get("e.c:handleCallbackError");
                appEvent.setParams({
                    "errors" : a.getError(),
                    "errorComponentName" : "PRL"
                });
                appEvent.fire(); 
            }                        
        });
        $A.enqueueAction(action);
        
    },
    
    cancelCreate : function (component){
        component.set("v.adding", false); 
    },
    
    handleSelect : function (component, event){
        //Here, I want to navigate to the record
        //console.log("event");
        //console.log(event);        
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": event.getParam("recordId")            
        });
        navEvt.fire();
    }
})