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

	recordSelected : function(component){
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

	search : function(component){
		let searchString = component.find("search").get("v.value");
		if (searchString.length<=2){
			component.set("v.results", []);
			return; //too short to search
		}
		let searchObject = component.find("searchPicklist").get("v.value");
		console.log(searchString);
		console.log(searchObject);
		let action= component.get("c.doSOSL");
		action.setParams({"sosl" : "FIND '*"+searchString+"*' IN NAME FIELDS RETURNING " + searchObject + ' (Id, Name)'});

		action.setCallback(this, function(a){
			let state = a.getState();
			if (state === "SUCCESS") {
				console.log(a.getReturnValue());
				component.set("v.results", a.getReturnValue());
			}  else if (state === "ERROR") {
				let appEvent = $A.get("e.c:handleCallbackError");
				appEvent.setParams({
					"errors" : a.getError()
				});
				appEvent.fire();
			}
		});
		$A.enqueueAction(action);

		/*let action = component.get("c.query");
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
		*/
	}
})