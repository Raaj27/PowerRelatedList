({
	doInit : function(component, undefined, helper) {
		helper.reload(component);
	},

	stopProp : function(component, event) {
		event.stopPropagation();
	},

	delete : function(component, event, helper) {
		console.log("deleting");
		//	global static void deletePerm(id UserOrGroupID, id recordId){

		let action = component.get("c.deletePerm");
		action.setParams({
			"UserOrGroupID" : event.target.id,
			"recordId" : component.get("v.recordId")
		});
		action.setCallback(this, function(a){
			let state = a.getState();
			if (state === "SUCCESS") {
				helper.reload(component);
			} else if (state === "ERROR") {
				console.log("error:");
				console.log(a.getError());
				let appEvent = $A.get("e.c:handleCallbackError");
				appEvent.setParams({
					"errors" : a.getError()
				});
				appEvent.fire();
			}
		});
		$A.enqueueAction(action);
	},

	recordSelected : function(component, event, helper){
		let selectedRecord = component.find("msp").get("v.value");
		console.log(selectedRecord);
		//loop the results and put the match's name in the box
		let results = component.get("v.results");
		console.log(results);
		let match = _.find(results, {"Id" : selectedRecord});
		console.log(match);
		component.set("v.searchString", match.Name);
	},

	setRead : function(component, event, helper) {
		console.log("read clicked");
		let id = event.target.id;
		helper.commonUpsert(component, id, "Read");
	},

	setReadWrite : function(component, event, helper) {
		console.log("readWrite clicked");
		let id = event.target.id;
		helper.commonUpsert(component, id, "Edit");
	},

	/*savePerms : function(component, event, helper){
		console.log("saving");
	//	global static void upsertPerm (id UserOrGroupID, id recordId, string level){
		let action = component.get("c.upsertPerm");
		let level;
		if (component.find("permPicklist").get("v.value")=="Read/Write"){
			level="Edit";
		}
		if (component.find("permPicklist").get("v.value")=="Read"){
			level="Read";
		}
		action.setParams({
			"UserOrGroupID" : component.find("msp").get("v.value"),
			"recordId" : component.get("v.recordId"),
			"level" : level
		});

		action.setCallback(this, function(a){
			let state = a.getState();
			if (state === "SUCCESS") {
				console.log(a.getReturnValue());
				let toastEvent = $A.get("e.force:showToast");
				toastEvent.setParams({
					"message": "Permission Added Successfully",
					"type": "success",
				});
				toastEvent.fire();
		toastEvent.fire();
			}  else if (state === "ERROR") {
				console.log(a);
				console.log(a.getError());
				let appEvent = $A.get("e.c:handleCallbackError");
				appEvent.setParams({
					"errors" : a.getError()
				});
				appEvent.fire();
			}
		});
		$A.enqueueAction(action);
	},*/

	search : function(component, event, helper){
		let searchString = component.find("search").get("v.value");
		let searchObject = component.find("searchPicklist").get("v.value");
		console.log(searchString);
		console.log(searchObject);
		let action = component.get("c.query");
		action.setParams({
			"soql" : "select name, id from " + searchObject + " where name like '%"+searchString+"%'"
		});
		action.setCallback(this, function(a){
			let state = a.getState();
			if (state === "SUCCESS") {
				console.log(a.getReturnValue());
				component.set("v.results", a.getReturnValue());
			}  else if (state === "ERROR") {
				console.log(a.getError());
				let appEvent = $A.get("e.c:handleCallbackError");
				appEvent.setParams({
					"errors" : a.getError()
				});
				appEvent.fire();
			}
		});
		$A.enqueueAction(action);
	}
})