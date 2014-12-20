var getUserData;
var onClickCheck;

ctrl.startup = function() {
	onClickCheck = false;

	var entries = '<%= value.entries; %>';
	var index = '<%=bi.query.index%>'; 
	if (!parseInt(index)) {
		index = 0;
	}

	var controllBar = document.getElementById("controllBar");

	ctrl.embed(controllBar,"/A/customer/list/controllBar", {},function(data){
		data.addHandler("regReloadHistoryList", ctrl.reloadHistoryList);
	});

	var listLink = document.getElementById("listLink");
	ctrl.embed(listLink,"/A/customer/listLink", {},function(data){
		refreshLink( index, entries);
	});
	
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
		deleteApiData(deleteUserDataApi,ngID,function(res){
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

