({
	addComp : function(component, created) {
		if (component.isValid()) {
        	var body = component.get("v.body");
        	body.push(created);
        	component.set("v.body", body);
        }
	}
})