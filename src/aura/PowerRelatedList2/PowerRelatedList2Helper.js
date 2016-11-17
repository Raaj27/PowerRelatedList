({
    //shared by lots of functions.  You give it a comma-separated list of stuff, it returns a trimmed array
    CSL2Array: function (CSL){
        
        try{
            var outputArray = CSL.split(",");
            _.forEach(outputArray, function (value, key){
                outputArray[key] = _.trim(value);
            });
            return outputArray;
        } catch(err){
            //intended to handle the "CSL is null scenario"
            return [];
        }
    },
    
    getPlural: function(component){
        var action = component.get("c.whatsMyPlural");
        //public static String whatsMyPlural(string objtype){
        action.setParams({"objtype" : component.get("v.objectName")});
        action.setCallback(self, function (a){
            //console.log("plural returned!")
            //console.log(a)
            //console.log(a.getReturnValue);           
            component.set("v.pluralLabel", a.getReturnValue());            
        });
        action.setStorable();
        $A.enqueueAction(action);
    },
    
    setNewRecord: function (component){
        if (component.get("v.allowAdd")){
            var record = {};
            record[component.get("v.lookupField")] = component.get("v.recordId");            
            component.set("v.newRecord", record);            
        }        
    },
    
    buildQuery: function (component){
        var soql = "select Id, " + component.get("v.displayFields") + " from " + component.get("v.objectName") + " where " + component.get("v.lookupField") + " = '" + component.get("v.recordId") + "'";       
        //console.log(soql);
        return soql;
    },
    
    query: function (component, soql){
        var action = component.get("c.query");
        action.setParams({"soql" : soql});
        action.setCallback(self, function(a){
            //console.log("query results"); 
            var records = JSON.parse(a.getReturnValue())
            //console.log(records);
            component.set("v.results", records);
            component.set("v.filteredResults", records); //initial unfiltered list
            component.set("v.showSpinner", false);
        });
        $A.enqueueAction(action);        
    },

    filter : function (component){
        var filter = component.get("v.filter");        
        //console.log("in debounced function");
        //console.log(filter);
        if (!filter){
            //console.log("no filter");
            component.set("v.filteredResults", component.get("v.results"));    
        } else {
            //console.log("filter present: " + filter);
            var goodStuff = _.filter(component.get("v.results"), function(record){
                var contains = false;
                _.forEach(record, function (value){
                    contains = contains || _.includes(_.toString(value), filter);
                });
                return contains;
            });
            component.set("v.filteredResults", goodStuff);            
        }
        this.sort(component);
    },
    
    //sort always occurs after filter
    sort : function (component){
        var sortState = component.get("v.sortState");
        if (!sortState) return; //if it's not sorted, just skip it
        var results = _.sortBy(component.get("v.filteredResults"), [sortState.field]);
        if (sortState.direction === 'Descending'){
            _.reverse(results);
        }
        component.set("v.filteredResults", results);
    }
})