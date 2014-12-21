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
	}

	var historyDialog = document.getElementById("historyDialog");
	ctrl.embed(historyDialog,"/A/customer/history/historyDialog", {params: { _loc: '<%=bi.locale%>',_type: 0}},function(data){
		data.addHandler("regReloadHasComplaints", ctrl.reloadHasComplaints);
	});

	var controllBar = document.getElementById("controllBar");
	ctrl.embed(controllBar,"/A/customer/history/controllBar", {params:params},function(data){
		data.addHandler("regReloadHistoryList", ctrl.reloadHistoryList);
	});

	var listLink = document.getElementById("listLink");
	ctrl.embed(listLink,"/A/customer/listLink", {},function(data){
		if (index == -1) {
			refreshLink(0,getLength);
		}
		else {
			refreshLink(index,getLength);
		}
	});
};

//動態產生下方button，index為需disabled的值
function refreshLink(index,entries) {
	var listLinkBox = document.getElementById("listLinkBox");
	$(listLinkBox).empty();
	var num = getMathRemainder(entries,10);
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
				var  bodyBkID = $('#_mainC').children('div').first().attr('id'),
				bodyCtrl = __.getCtrl(bodyBkID);
				bodyCtrl.reload('/A/customer/history', {
					params: { 
						index : parseInt(this.id),
						key : '<%=bi.query.key%>',
						_loc: '<%=bi.locale%>',
						name:'<%=bi.query.name%>'
					}
				});
			});
		}
		li.appendChild(a);
		listLinkBox.appendChild(li);
	}
}

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
	ctrl.embed(historyDialog,"/A/customer/history/historyDialog", {id:ngID,params: { _loc: '<%=bi.locale%>',_type: 1}},function(data){
		data.addHandler("regReloadHasComplaints", ctrl.reloadHasComplaints);
	});
}