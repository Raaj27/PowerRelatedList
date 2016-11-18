@isTest
private class FileControllerTest {
	
	@isTest static void test_method_one(){
		//first, save a file
		list<account> accounts = [select id from account];
		//id accId = accounts[0].id;

		id attachmentId = FileController.saveTheFile(accounts[0].id, 'filename.png', 'IGotYourBase64DataRightHere', 'image-png', 'Website');
		//    public static Id saveTheChunk(Id parentId, String fileName, String base64Data, String contentType, String fileId, String fieldAPIName) { 
		//add some more to the chunk
		attachmentId = FileController.saveTheChunk(accounts[0].id, 'filename.png', 'OhYouWantSomeMoreData', 'image-png', attachmentId, 'Website');

		//convert
		//    public static String convertToChatter(String attachId, String fieldAPIName ){


		string convertResult = FileController.convertToChatter(attachmentId, 'Website');

		//public static String getInitialValue(String pId, String fieldAPIName){
		FileController.getInitialValue(accounts[0].id, 'Website');

	}
	
	

	//create an account that we can attach stuff to
	@testSetup static void testSetupCoreObjects() {
        
        account a = new account();
        a.name = 'Pizza King';
        insert a;        
       
    }	
}