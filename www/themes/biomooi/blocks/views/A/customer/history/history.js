var getUserData = [];
var onClickCheck;

ctrl.startup = function() {
	
	var entries = '<%= value.entries; %>';
	var index = '<%=bi.query.index%>'; 
	var getKey = '<%=bi.query.key%>';
	var getLength = document.getElementById("getLength").innerHTML;
	
	var params = {};

	if (getKey != "-1") {
		var custNo =  getKey;
		var name = '<%=bi.query.name%>';
		params["name"] = name;
		params["custNo"] = custNo;
	}

	if (!parseInt(index)) {
		index = 0;
	}
	
	if (index == -1) {
		entries = 1;
		index = 0;
	}
	var num = getMathRemainder(getLength,10) ;

	ctrl.embed(addWaitDialog("historyDialog"),"/A/customer/waitDialog", {},function(data){});

	var historyDialog = document.getElementById("historyDialog");
	ctrl.embed(historyDialog,"/A/customer/history/historyDialog", {params: { _loc: '<%=bi.locale%>',_type: 0}},function(data){
		data.addHandler("regReloadHasComplaints", ctrl.reloadHasComplaints);
	});

	var controllBar = document.getElementById("controllBar");
	ctrl.embed(controllBar,"/A/customer/history/controllBar", {params:params},function(data){
		data.addHandler("regReloadHistoryList", ctrl.reloadHistoryList);
	});

	var listLink = document.getElementById("listLink");
	ctrl.embed(listLink,"/A/customer/listLink", {params: { _loc: '<%=bi.locale%>', index: index, entries: num}},function(data){
		data.addHandler("regReloadList", ctrl.paginationCallBack);
	});
};
ctrl.paginationCallBack = function(index) {
	var  bodyBkID = $('#_mainC').children('div').first().attr('id'),
	bodyCtrl = __.getCtrl(bodyBkID);
	bodyCtrl.reload('/A/customer/history', {
		params: { 
			index : index,
			key : '<%=bi.query.key%>',
			_loc: '<%=bi.locale%>',
			name:'<%=bi.query.name%>'
		}
	});
};

function  getBodyCtrl()  {
	var  bodyBkID = $('#historyDialog').children('div').first().attr('id'),
	bodyCtrl = __.getCtrl(bodyBkID);
	return  bodyCtrl;
};

ctrl.reloadHistoryList = function(get_tag) {
	var ng_id = get_tag.ngID;
	var go = "/A/customer/history?index=0&key="+ng_id+"&_loc="+'<%=bi.locale%>'+"&name="+get_tag.name;
	location.replace(go);
};

ctrl.reloadHasComplaints = function(ngID) {
	var historyDialog = document.getElementById("historyDialog");
	$(historyDialog).empty();
	ctrl.embed(historyDialog,"/A/customer/history/historyDialog", {id:ngID,params: { _loc: '<%=bi.locale%>',_type: 1}},function(data){
		data.addHandler("regReloadHasComplaints", ctrl.reloadHasComplaints);
	});
};

ctrl.reView = function (ngID) {
	var historyDialog = document.getElementById("historyDialog");
	$(historyDialog).empty();
	$("#waitLink").click();
	ctrl.embed(historyDialog,"/A/customer/history/historyDialog", {id:ngID,params: { _loc: '<%=bi.locale%>',_type: 1}},function(data){
		$("#waitCancel").click();
		data.addHandler("regReloadHasComplaints", ctrl.reloadHasComplaints);
	});
}