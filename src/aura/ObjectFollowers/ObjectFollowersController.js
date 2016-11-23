({
	doInit : function(component, event, helper) {
		//	public static list<User> getFollowers(id recordId){

		var action = component.get("c.getFollowers");
		action.setParams({
			"recordId" : component.get("v.recordId")
		});
		action.setCallback(this, function(a){
			var state = a.getState();
			if (state === "SUCCESS") {
				console.log(a);
				component.set("v.followers", a.getReturnValue());
			}  else if (state === "ERROR") {                    
				var appEvent = $A.get("e.c:handleCallbackError");
				appEvent.setParams({
					"errors" : a.getError()
				});
				appEvent.fire();
			}
		});
		$A.enqueueAction(action);
	},

	openUser : function(component, event, helper){
		console.log(event.target.id);
		var navEvt = $A.get("e.force:navigateToSObject");
	    navEvt.setParams({
	      "recordId": event.target.id
	    });
    	navEvt.fire();
	}
})