var getUserData;
var onClickCheck;

ctrl.startup = function() {	
	onClickCheck = false;

	var entries = '<%= value.entries; %>';
	var index = '<%=bi.query.index%>'; 
	
	if (!parseInt(index)) {
		index = 0;
	}

	if (index == -1) {
		entries = 1;
	}
	var num = getMathRemainder(entries,20) ;

	ctrl.embed(addWaitDialog("controllBar"),"/A/customer/waitDialog", {},function(data){});

	var controllBar = document.getElementById("controllBar");

	ctrl.embed(controllBar,"/A/customer/list/controllBar", {},function(data){
		data.addHandler("regReloadList", ctrl.reloadList);
	});

	var listLink = document.getElementById("listLink");
	ctrl.embed(listLink,"/A/customer/listLink", {params: { _loc: '<%=bi.locale%>', index: index, entries: num}},function(data){
		data.addHandler("regReloadList", ctrl.paginationCallBack);
	});
	//addAllCatalogData();
	// addTestUser("林可新");
	//deleteAllData (btCatalogListApi,btCatalogDeleteApi,{}) ;
	//addTestData ("71082") ;
};

ctrl.paginationCallBack = function(index) {
	var page = index + 1;
	getBodyCtrl().reload('/A/customer/list', {
		params: { 
			index : index,
			key : '<%=bi.query.key%>',
			_loc: '<%=bi.locale%>',
			_pn : page,
			_ps : 20 
		}
	});
};

ctrl.reloadList = function(get_tag) {
	// if (get_tag != -1) {
	// 	var go = "/A/customer/list?index=-1&key="+get_tag.ngID+"&_loc="+'<%=bi.locale%>';
	// 	location.replace(go);
	// }
	// else {
	// 	var go = "/A/customer/list?index=0&key=-1&_loc="+'<%=bi.locale%>'+"&_pn=1&_ps=20";
	// 	location.replace(go);
	// }
	var go = "/A/customer/info/" + get_tag.ngID;
	location.href = go;
};

ctrl.editData = function(ngID) {
	onClickCheck = true;
	var go = "/A/customer/edit/" + ngID;
	location.href = go;
};

ctrl.deleteData = function(ngID) {
	onClickCheck = true;
	if(confirm("確定刪除？")){
		$("#waitLink").click();
		var url = deleteUserDataApi+ngID;
		callApi(url,{},function(res){
			$("#waitCancel").click();
			if (res) {
				alert("刪除成功！");
				window.location.reload();
			}
			else {
				alert("刪除失敗！");
			}
		});
	}
};

ctrl.infoData = function(ngID) {
	if (!onClickCheck) {	
		var go = "/A/customer/info/" + ngID;
		location.href = go;
	}
	onClickCheck = false;
};

function getBodyCtrl()  {
	var  bodyBkID = $('#_mainC').children('div').first().attr('id'),
	bodyCtrl = __.getCtrl(bodyBkID);
	return  bodyCtrl;
};

