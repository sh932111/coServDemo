ctrl.startup = function() {
	$("#mymodal").modal({show:false});
};

ctrl.addUserData = function(){
	location.href = "/A/customer/add";	
};

ctrl.selectUserData = function(){
	$("#modalLink").click();
};
