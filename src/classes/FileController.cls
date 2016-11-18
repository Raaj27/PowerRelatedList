public class FileController {
    
    
    @AuraEnabled
    public static String getInitialValue(String pId, String fieldAPIName){
        System.debug('************* in getInitialValue method');
        Id parentId = Id.valueOf(pId);
        String objectType = String.valueOf(parentId.getSObjectType());
        String queryStr = 'Select Id,Name, '+ fieldAPIName + ' from ' + objectType + ' where Id =\''+parentId+ '\' Limit 1';
        SObject obj = Database.query(queryStr);
        String cdId = String.valueOf(obj.get(fieldAPIName));
        cdId = cdId.remove('/');
        System.debug('************* init cdId='+cdId);
        String returnVal = null;
        if(cdId!=null){
            ContentDocument cd = [Select Id, Title from ContentDocument where Id=: cdId Limit 1];
            ContentVersion cv = [Select Id, ContentDocumentId,IsLatest,ContentModifiedById,ContentModifiedDate from ContentVersion where ContentDocumentId=:cd.Id and IsLatest= true Limit 1];
            System.debug('************* returning '+ cdId+','+cd.Title +','+cv.Id);
            User u = [Select FirstName,LastName,Id from User where Id=:cv.ContentModifiedById];
            //returnVal =  cdId+','+cd.Title+','+cv.Id+','+u.FirstName + ' '+ u.LastName + ','+ cv.ContentModifiedDate ;
        
	        //return returnVal;    
	        map<string, string> output = new map<string, string>();
	        output.put('contentDocumentId', cdId);
	        output.put('title', cd.Title);
	        output.put('contentVersionId', cv.Id);
	        output.put('createdBy', u.FirstName + ' ' + u.LastName);
	        output.put('createdDate', string.valueOf(cv.ContentModifiedDate));
	        //var src='https://haldemo--c.na24.content.force.com/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB120BY90&versionId='+cvId+'&operationContext=CHATTER&contentId='+id;

	        output.put('imageSrc', 'https://' + URL.getSalesforceBaseUrl().getHost() + '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB120BY90&versionId='+cv.Id+'&operationContext=CHATTER&contentId='+cdId);
			//var downLink = '/sfc/servlet.shepherd/document/download/'+id+'?operationContext=S1';
			output.put('downloadLink', '/sfc/servlet.shepherd/document/download/'+cdId+'?operationContext=S1');
			//var prevLink = '/'+id+'?operationContext=S1';
			//component.set("v.previewURL",prevLink);*/
			//output.put('previewURL', '/'+cdId+'?operationContext=S1');
	        return JSON.serialize(output);
    	} 
    	return null;
    	

    }


    @AuraEnabled
    public static String convertToChatter(String attachId, String fieldAPIName ){
        System.debug('************* in convert method');
        Attachment a = [Select Id, parentId, Body, description, name from Attachment where Id =: attachId Limit 1] ;
        ContentVersion c =  new ContentVersion(
                versionData = a.body,
                title = a.name,
                description = a.description,
                pathOnClient = '/' + a.name
              );
        insert c;
        ContentVersion cv = [Select Id, ContentDocumentId, Title,ContentModifiedById,ContentModifiedDate from ContentVersion where Id=:c.Id Limit 1];
        System.debug('************* cv.ContentDocumentId = '+ cv.ContentDocumentId);
         System.debug('************* cv.Id= '+ cv.Id);
        ContentDocumentLink cdl =  new ContentDocumentLink(
                    linkedEntityId = a.parentId,
                    contentDocumentId = cv.ContentDocumentId,
                    shareType = 'I'
                );
        insert cdl;
        //create and insert post
        FeedItem post = new FeedItem();
        post.Body = ' has uploaded a new required document: '+ a.name;
        post.ParentId =a.parentId;
        post.Title = 'Required Document Uploaded to Job';
        insert post;
        //create and associate a content attachment to the post
        FeedAttachment feedAttachment = new FeedAttachment();
        feedAttachment.FeedEntityId = post.Id;
        feedAttachment.RecordId = cv.Id; 
        feedAttachment.Title = a.name;
        feedAttachment.Type = 'CONTENT'; 
        insert feedAttachment;
        String objectType = String.valueOf(a.parentId.getSObjectType());
        String queryStr = 'Select Id,Name, '+ fieldAPIName + ' from ' + objectType + ' where Id =\''+a.parentId+ '\' Limit 1';
        SObject obj = Database.query(queryStr);
        ///sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB120BY90&versionId='+cv.Id+'&operationContext=CHATTER&contentId='+cdId
        obj.put(fieldAPIName, '/' + cv.ContentDocumentId);
        update obj;
        delete a;
        System.debug('************* returning '+ cv.ContentDocumentId+','+cv.Title );
        User u = [Select FirstName,LastName,Id from User where Id=:cv.ContentModifiedById];
        return cv.ContentDocumentId+','+cv.Title+','+cv.Id +','+u.FirstName + ' '+ u.LastName + ','+ cv.ContentModifiedDate ;
    
    }
    
    
    @AuraEnabled
    public static Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType, String fieldAPIName) { 
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        Attachment a = new Attachment();
        a.parentId = parentId;
        a.Body = EncodingUtil.base64Decode(base64Data);
        a.Name = fileName;
        a.ContentType = contentType;
        insert a;
        return a.Id;
        
    }
    
    @AuraEnabled
    public static Id saveTheChunk(Id parentId, String fileName, String base64Data, String contentType, String fileId, String fieldAPIName) { 
        if (fileId == '') {
            fileId = saveTheFile(parentId, fileName, base64Data, contentType, fieldAPIName);
        } else {
            appendToFile(fileId, base64Data);
        }
        
        return Id.valueOf(fileId);
    }
    
    private static void appendToFile(Id fileId, String base64Data) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
        Attachment a = [
            SELECT Id, Body
            FROM Attachment
            WHERE Id = :fileId
        ];
        
     	String existingBody = EncodingUtil.base64Encode(a.Body);
        a.Body = EncodingUtil.base64Decode(existingBody + base64Data); 
        
        update a;
    }
}