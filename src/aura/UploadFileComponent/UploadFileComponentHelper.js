({  
	MAX_FILE_SIZE: 7500000,/* 1 000 000 * 3/4 to account for base64 */
	CHUNK_SIZE: 950000,

	init : function(component) {
		//console.log('in init function');
		var action = component.get("c.getInitialValue"); 
		action.setParams({
			pId: component.get("v.recordId"),
			fieldAPIName: component.get("v.fieldAPIName")  
		});
		action.setCallback(this, function(a) {
			var ret = JSON.parse(a.getReturnValue());
			if(ret!=null){
				//console.log(ret);
				component.set("v.fileObject", ret);
			}else{
				console.log('retrieved no initial value');
			}
			component.set("v.uploading", false);
			return;
		});

		$A.enqueueAction(action); 


	},


	save : function(component) {
		component.set("v.uploading", true);
		//console.log('inside of the save method: '+component.get("v.recordId"));
		var fileInput = component.find("file").getElement();
		var file = fileInput.files[0];
		if (file.size >  this.MAX_FILE_SIZE) {
			alert('File size cannot exceed '+  this.MAX_FILE_SIZE + ' bytes.\n' +
				'Selected file size: ' + file.size);
			return;
		}

		var fr = new FileReader();
		var self = this;        
        
        fr.onload = function() {
        	var fileContents = fr.result;
        	var base64Mark = 'base64,';
        	var dataStart = fileContents.indexOf(base64Mark) + base64Mark.length;
        	var fieldAPIName = component.get("v.fieldAPIName");
        	fileContents = fileContents.substring(dataStart);

        	self.upload(component, file, fileContents, fieldAPIName);
        };
        
        fr.readAsDataURL(file);
    },
    
    upload: function(component, file, fileContents, fieldAPIName) {
    	var fromPos = 0;
    	var toPos = Math.min(fileContents.length, fromPos + this.CHUNK_SIZE);

        // start with the initial chunk
        this.uploadChunk(component, file, fileContents, fromPos, toPos, '', fieldAPIName);   
    },
    
    uploadChunk : function(component, file, fileContents, fromPos, toPos, attachId, fieldAPIName) {
    	var action = component.get("c.saveTheChunk"); 
    	var chunk = fileContents.substring(fromPos, toPos);
    	action.setParams({
    		parentId: component.get("v.recordId"),
    		fieldAPIName: component.get("v.fieldAPIName"),
    		fileName: file.name,
    		base64Data: encodeURIComponent(chunk), 
    		contentType: file.type,
    		fileId: attachId
    	});

    	var self = this;
    	action.setCallback(this, function(a) {
    		attachId = a.getReturnValue();
    		fromPos = toPos;
    		toPos = Math.min(fileContents.length, fromPos + this.CHUNK_SIZE);    
    		if (fromPos < toPos) {
    			self.uploadChunk(component, file, fileContents, fromPos, toPos, attachId, fieldAPIName);  
    		}else{
    			self.uploadComplete(component,attachId);
    		}
    	});

    	$A.enqueueAction(action);             
    },
    
    
    uploadComplete: function(component, attachId) {
    	var self = this;
    	console.log('done now - now create chatter file from attachment with id: '+ attachId) ;
    	var action = component.get("c.convertToChatter"); 
    	action.setParams({
    		fieldAPIName: component.get("v.fieldAPIName"),
    		attachId: attachId
    	});
    	action.setCallback(this, function(a) {
    		console.log('converted!');
    		var ret = a.getReturnValue();
    		if(ret!=null){
    			console.log(ret);
                
                  self.init(component);
                  component.set("v.chosenFileName", null);
                  //component.set("v.uploading", false);
              }   
          });
    	$A.enqueueAction(action);         
    }
    
})