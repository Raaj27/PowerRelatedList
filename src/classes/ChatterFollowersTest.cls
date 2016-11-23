@isTest
private class ChatterFollowersTest {
	
	@isTest static void test_method_one() {
		list<case> Cases = [select Id from Case];
		list<User> Users = ChatterFollowers.getFollowers(Cases[0].Id);
		system.assertEquals(Users.size(), 1);
		
	}
	
	@testSetup static void testSetupCoreObjects() {
        case c = new case();
        c.status = 'New';
        c.Subject = 'your software sucks';
        insert c;

        EntitySubscription ES = new EntitySubscription();
        ES.SubscriberID = UserInfo.getUserId();
        ES.ParentId = c.Id;
        insert ES;        
    }
	
}