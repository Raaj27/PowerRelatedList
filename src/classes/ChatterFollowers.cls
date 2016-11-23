global with sharing class ChatterFollowers {
	
	@AuraEnabled
	global static list<User> getFollowers(id recordId){
		list<EntitySubscription> follows = [select SubscriberId from EntitySubscription where parentId=:recordId];
		list<id> userIds = new list<Id>();
		for (EntitySubscription follow:follows){
			userIds.add(follow.SubscriberId);
		}
		list<user> output = [select id, Name, Title, SmallPhotoUrl from User where id in: userIds];
		return output;
	}
} 