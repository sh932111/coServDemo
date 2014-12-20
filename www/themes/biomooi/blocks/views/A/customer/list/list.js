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
	console.log(entries);
	var controllBar = document.getElementById("controllBar");

	ctrl.embed(controllBar,"/A/customer/list/controllBar", {},function(data){
		data.addHandler("regReloadHistoryList", ctrl.reloadHistoryList);
	});

	var listLink = document.getElementById("listLink");
	ctrl.embed(listLink,"/A/customer/listLink", {},function(data){
		refreshLink( index, entries);
	});
	//deleteAllData (userHistoryListApi,userHistoryDeleteApi,{}) ;
	// addTestData ("70865") ;
	// addTestData ("70865") ;
	// addTestData ("70865") ;
	// addTestData ("70863") ;
	// addTestData ("70863") ;
};

//動態產生下方button，index為需disabled的值
function refreshLink(index,entries) {
	var listLinkBox = document.getElementById("listLinkBox");
	$(listLinkBox).empty();
	var num = getMathRemainder(entries,20);
	for (var i = 0; i < num; i++) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.innerHTML = i + 1;
		a.id = i;
		if (i == index) {
			li.className = "disabled";
		}
		else {
			li.className = "active";
			a.addEventListener("click", function(e){
				getBodyCtrl().reload('/A/customer/list', {
					params: { 
						index : parseInt(this.id),
						key : '<%=bi.query.key%>',
						_loc: '<%=bi.locale%>',
						_pn : parseInt(this.innerHTML),
						_ps : 20 
					}
				});
			});
		}

		li.appendChild(a);
		listLinkBox.appendChild(li);
	}
}

ctrl.reloadHistoryList = function(get_tag) {
	if (get_tag != -1) {
		getBodyCtrl().reload('/A/customer/list', {
			params: { 
				index : -1,
				key : get_tag.ngID,
				_loc: '<%=bi.locale%>'
			}
		});
	}
	else {
		getBodyCtrl().reload('/A/customer/list', {
			params: { 
				index : 0,
				key : -1,
				_loc: '<%=bi.locale%>',
				_pn : 1,
				_ps : 20 
			}
		});
	}
	// var go = "/A/customer/info/" + get_tag.ngID;
	// location.href = go;
};

ctrl.editData = function(ngID) {
	onClickCheck = true;
	var go = "/A/customer/edit/" + ngID;
	location.href = go;
};

ctrl.deleteData = function(ngID) {
	onClickCheck = true;
	if(confirm("確定刪除？")){
		var url = deleteUserDataApi+ngID;
		callApi(url,{},function(res){
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

