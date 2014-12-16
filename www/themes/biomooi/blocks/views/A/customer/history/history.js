var getUserData = [];
var onClickCheck;
var Key = "e4b55ab0-d33c-e355-d7e4-8ef415bf40b9";
var loginApi = "/core/user/login";
var userHistoryCreateApi = "/beautywebSource/userHistory/create";
var userHistoryListApi = "/beautywebSource/userHistory/list";
var userHistoryViewApi = "/beautywebSource/userHistory/view/";

ctrl.startup = function() {
	
	var historyDialog = document.getElementById("historyDialog");
	ctrl.embed(historyDialog,"/A/customer/history/historyDialog", {params: { _loc: '<%=bi.locale%>',_type: 0}},function(data){
	
	});

	var controllBar = document.getElementById("controllBar");
	ctrl.embed(controllBar,"/A/customer/history/controllBar", {},function(data){
		data.addHandler("regReloadHistoryList", ctrl.reloadHistoryList);
	});

	var listLink = document.getElementById("listLink");
	ctrl.embed(listLink,"/A/customer/listLink", {},function(data){
		refreshLink(0,[]);
	});
	getTestData();
};

//動態將List生成
function reloadUserTable(index,get_user_data) {
	console.log(get_user_data);
	var tbody = document.getElementById("tableBody");
	$(tbody).empty();
	var array_lenght = get_user_data.length;

	for (var i = 0; i < array_lenght; i++) {
		var num = i + index * 10;
		if (i == 10) {
			break;
		}
		else if (num == get_user_data.length) {
			break;
		}
		var summary = JSON.parse(get_user_data[i].summary);

		var tr = document.createElement("tr");
		var date_id = document.createElement("td");
		date_id.innerHTML = summary.date;
		var salesTotal_id = document.createElement("td");
		salesTotal_id.innerHTML = summary.salesTotal;
		var descTx_id = document.createElement("td");
		descTx_id.innerHTML = summary.descTx;
		var fun_id = document.createElement("td");
		var info_bt = document.createElement("button");
		info_bt.id = num;
		info_bt.innerHTML = "檢視";
		info_bt.className = "btn btn-primary";
		info_bt.addEventListener("click", function(e){
			getBodyCtrl().reload('/A/customer/history/historyDialog', {id:get_user_data[this.id].ngID,params: { _loc: '<%=bi.locale%>',_type: 1}});
		});
		fun_id.appendChild(info_bt);
		tr.id = num;
		tr.addEventListener("click", function(e){
			if (!onClickCheck) {	

			}
			onClickCheck = false;
		});
		tr.appendChild(date_id);
		tr.appendChild(salesTotal_id);
		tr.appendChild(descTx_id);
		tr.appendChild(fun_id);
		tbody.appendChild(tr);
	}
}

//動態產生下方button，index為需disabled的值
function refreshLink(index,get_user_data) {
	var listLinkBox = document.getElementById("listLinkBox");
	$(listLinkBox).empty();
	var num = getMathRemainder(get_user_data.length,10);
	for (var i = 0; i < num; i++) {
		var li = document.createElement("li");
		if (i == index) {
			li.className = "disabled";
		}
		else {
			li.className = "active";
		}
		var a = document.createElement("a");
		a.innerHTML = i + 1;
		a.id = i;
		a.addEventListener("click", function(e){
			refreshLink(this.id,get_user_data);
			reloadUserTable(this.id,get_user_data);
		});
		li.appendChild(a);
		listLinkBox.appendChild(li);
	}
}

//決定button數量
function getMathRemainder(num,resource) {
	if (resource == 0) {
		return 1;
	}
	var res = 1;
	var x = 0;
	for (var i = 0; i < num; i++) {
		if (x == resource) {
			x = 0;
			res++;
		}
		x ++;
	}
	return res;
}

function  getBodyCtrl()  {
	var  bodyBkID = $('#historyDialog').children('div').first().attr('id'),
	bodyCtrl = __.getCtrl(bodyBkID);
	return  bodyCtrl;
};

function getTestData () {
	var req = {url: userHistoryListApi ,post: {}};
	__.api( req, function(data) {
		if (data.errCode == 0) {
			getUserData = data.value.list;
		}
	});
}

function addTestData () {
	getRoot(function(token){
		var req = {url: userHistoryCreateApi ,post: getUserDataToID("70276",token)};
		__.api( req, function(data) {
			if (data.errCode == 0) {
				console.log(data);
			}
		});
	});
}

function getUserDataToID(custNo,token) {
	var get_data = {
		custNo : custNo,
		name : "test",
		date : "12/02/2014",
		salesTotal : "1000",
		descTx : "餅乾.糖果",
		consumptionDate : "2014-12-12",
		consumptionDetail : "買很多"
	};

	var res = {
		_key : Key,
		title : custNo,
		token : token,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data),
		isPublic : "1"
	};
	return res;
}

function getRoot(callback) {
	var root_reg = {
		_key : Key,
		accName : "root",
		passwd : "root"
	};
	var req = {url: loginApi ,post: root_reg};
	__.api( req, function(data) {
		callback(data.token);
	});
}

ctrl.reloadHistoryList = function(get_tag) {
	var get_detail_data = [];
	var ng_id = get_tag.ngID;
	for (var i = 0; i < getUserData.length; i++) {
		if(getUserData[i].title == ng_id){
			get_detail_data.push(getUserData[i]);
		}
	}
	reloadUserTable(0,get_detail_data);
	refreshLink(0,get_detail_data);
};