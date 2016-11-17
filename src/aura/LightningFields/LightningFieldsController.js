({
    doInit : function(component, event, helper) {
    	component.set("v.showSpinner", true);
        //TODO: do a cleanup on displayFields parameter to make sure it's not invalid (commas, spaces, etc)                
        if(component.get("v.allEditable")){
            component.set("v.editableFields", component.get("v.displayFields"));
        }
        helper.describe(component, component.get("v.sObjectType"));  
    },

    popTitle : function(component, event, helper){
    	/*console.log(event.x);
    	console.log(event.y);

    	console.log(event.target;
    	console.log(event.srcElement;*/
    }
    
})