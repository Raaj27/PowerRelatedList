({  
	save : function(component, event, helper) {
		
		helper.save(component);
	},

	choose: function(component, event, helper) {
		var el = component.find("file").getElement();
		el.click();
	},
	newFileChosen: function(component, event, helper) {

		var el = component.find("file").getElement()
        //remove C:\fakepath\ from beginnning
        var val = el.value;
        var v = val.substring(12,val.length)
        component.set("v.chosenFileName",v);
    },        

    preview: function(component, event, helper) {
    	$A.get('e.lightning:openFiles').fire({
    		recordIds: [component.get("v.fileObject.contentDocumentId")]
    	});
    },

    
    download: function(component, event, helper) {
    	window.open(component.get("v.fileObject.downloadLink"));
    },
    
    doInit: function(component, event, helper) {
    	helper.init(component);
    }
    
})