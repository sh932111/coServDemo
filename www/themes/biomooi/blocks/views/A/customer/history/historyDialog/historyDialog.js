ctrl.startup = function() {
	$("#mymodal").modal({show:false});
	var type = '<%=bi.query._type%>';
	if (type == "1") {
		$("#modalLink").click();
	}
};

ctrl.addComplaintsDetail = function(){
	
};
