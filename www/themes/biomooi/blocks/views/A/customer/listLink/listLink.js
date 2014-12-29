ctrl.startup = function() {
	
};

ctrl.goFirst = function() {
	ctrl.callHandler("regReloadList",0);
};

ctrl.back = function() {
	if (parseInt('<%=bi.query.index%>') != 0) {
		var index = parseInt('<%=bi.query.index%>') - 1;
		ctrl.callHandler("regReloadList",index);
	}
};

ctrl.next = function() {
	if (parseInt('<%=bi.query.index%>') != parseInt('<%=bi.query.entries%>') - 1) {
		var index = parseInt('<%=bi.query.index%>') + 1;
		ctrl.callHandler("regReloadList",index);
	}
};

ctrl.goLast = function() {
	var index = parseInt('<%=bi.query.entries%>') - 1;
	ctrl.callHandler("regReloadList",index);
};

ctrl.goIndex = function(obj) {
	ctrl.callHandler("regReloadList",parseInt(obj.id));
};