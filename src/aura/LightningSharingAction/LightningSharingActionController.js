({
	doInit : function(component, event, helper) {
		var evt = $A.get("e.force:navigateToComponent");
		evt.setParams({
			componentDef : "c:LightningSharing",
			componentAttributes: {
					recordId : component.get("v.recordId")
			}
		});
		evt.fire();
	}
})