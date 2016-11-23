({
	doInit : function(component, event, helper) {
		var output = "slds-avatar slds-m-right--xx-small";
		if (component.get("v.variant")==="circle"){
			output = output + " slds-avatar--circle";
		}
		
		//small is default.  Leave it there
		switch(component.get("v.size")) {
		    case "x-small":
		        output = output + " slds-avatar--x-small";
		        break;
		    case "small":
		        output = output + " slds-avatar--small";
		        break;
		    case "medium":
		        output = output + " slds-avatar--medium";
		        break;
		    case "large":
		        output = output + " slds-avatar--large";		    
		} 

		component.set("v.finalClass", output);
	}
})