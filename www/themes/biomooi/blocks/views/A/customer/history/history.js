var getUserData;
var onClickCheck;
var Key = "e4b55ab0-d33c-e355-d7e4-8ef415bf40b9";
var loginApi = "/core/user/login";
var btCatalogDeleteApi = "/beautywebSource/btCatalog/delete/";
var btCatalogUpdateApi = "/beautywebSource/btCatalog/update/";

ctrl.startup = function() {
	var get_data = [];
	'<% for (var i = 0; i < value.list.length; i++) {
		var item = value.list[i];
		var ngID = value.list[i].ngID;
		var summary = item.summary; %>'
		var get_item = '<%=summary%>';
		var get_json = JSON.parse(get_item);
		get_json["ngID"] = '<%=ngID%>';
		get_data.push(get_json);
		'<%}; %>';
		getUserData = get_data;
		reloadUserTable(0);
		//68912
		var historyDialog = document.getElementById("historyDialog");
		ctrl.embed(historyDialog,"/A/customer/history/historyDialog", {id:"68912"},function(data){
		});

		var controllBar = document.getElementById("controllBar");
		ctrl.embed(controllBar,"/A/customer/history/controllBar", {},function(data){
			
		});

		var listLink = document.getElementById("listLink");
		ctrl.embed(listLink,"/A/customer/listLink", {},function(data){
			refreshLink(0);
		});
	};

//動態將List生成
function reloadUserTable(index) {
	var tbody = document.getElementById("tableBody");
	$(tbody).empty();
	var array_lenght = getUserData.length;

	for (var i = 0; i < array_lenght; i++) {
		var num = i + index * 10;
		if (i == 10) {
			break;
		}
		else if (num == getUserData.length) {
			break;
		}
		var tr = document.createElement("tr");
		var name_id = document.createElement("td");
		name_id.innerHTML = getUserData[num].name;
		var length_id = document.createElement("td");
		length_id.innerHTML = getUserData[num].length;
		var price_id = document.createElement("td");
		price_id.innerHTML = getUserData[num].price;
		var fun_id = document.createElement("td");
		var info_bt = document.createElement("button");
		info_bt.id = num;
		info_bt.innerHTML = "檢視";
		info_bt.className = "btn btn-primary";
		info_bt.addEventListener("click", function(e){
			getBodyCtrl().reload('/A/customer/history/historyDialog', {id:getUserData[this.id].ngID,params: { _loc: '<%=bi.locale%>'}});
		});
		fun_id.appendChild(info_bt);
		tr.id = num;
		tr.addEventListener("click", function(e){
			if (!onClickCheck) {	

			}
			onClickCheck = false;
		});
		tr.appendChild(name_id);
		tr.appendChild(length_id);
		tr.appendChild(price_id);
		tr.appendChild(fun_id);
		tbody.appendChild(tr);
	}
}

//動態產生下方button，index為需disabled的值
function refreshLink(index) {
	var listLinkBox = document.getElementById("listLinkBox");
	$(listLinkBox).empty();
	var num = getMathRemainder(getUserData.length,10);
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
			refreshLink(this.id);
			reloadUserTable(this.id);
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