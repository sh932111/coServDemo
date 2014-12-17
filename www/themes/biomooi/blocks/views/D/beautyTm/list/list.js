var getUserData;
var onClickCheck;
var Key = "e4b55ab0-d33c-e355-d7e4-8ef415bf40b9";
var loginApi = "/core/user/login";
var beautyTmUpdateApi = "/beautywebSource/beautyTm/update/";

ctrl.startup = function() {
	var get_data = [];
	'<% for (var i = 0; i < value.list.length; i++) {
		var item = value.list[i];
		var ngID = value.list[i].ngID;
		var title = value.list[i].title;
		var summary = item.summary; %>'
		var get_item = '<%=summary%>';
		var get_json = JSON.parse(get_item);
		get_json["ngID"] = '<%=ngID%>';
		get_json["title"] = '<%=title%>';
		get_data.push(get_json);
		'<%}; %>';
		getUserData = get_data;
		reloadUserTable(0);

		var beautyDialog = document.getElementById("beautyDialog");
		ctrl.embed(beautyDialog,"/D/beautyTm/beautyDialog", {params: { _loc: '<%=bi.locale%>',_type: 0}},function(data){

		});

		var controllBar = document.getElementById("controllBar");
		ctrl.embed(controllBar,"/D/btCatalog/controllBar", {},function(data){
			var controllBarBt = document.getElementById("controllBarBt");
			controllBarBt.style.display = "none";
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
		var update_bt = document.createElement("button");
		update_bt.id = num;
		update_bt.innerHTML = "調價格";
		update_bt.className = "btn btn-primary";
		update_bt.addEventListener("click", function(e){
			onClickCheck = true;
			getBodyCtrl().reload('/D/beautyTm/beautyDialog', {id:getUserData[this.id].ngID,params: { _loc: '<%=bi.locale%>',_type: 1}});
		});
		var delete_bt = document.createElement("button");
		delete_bt.id = num;
		delete_bt.className = "btn";
		if (getUserData[num].use) {
			delete_bt.innerHTML = "不提供";
		}
		else {
			delete_bt.innerHTML = "提供";
		}
		delete_bt.addEventListener("click", function(e){
			onClickCheck = true;
			var dialog_title = getUserData[this.id].use ? "確定不提供？" : "確定提供？";
			if(confirm(dialog_title)){
				console.log(getUserData[this.id]);
				getUserData[this.id].use = getUserData[this.id].use ? false : true;
				useBeautyData(getUserData[this.id].ngID,this.id,getUserData[this.id].use);
			}
		});
		fun_id.appendChild(delete_bt);
		fun_id.appendChild(update_bt);
		tr.id = num;
		tr.addEventListener("click", function(e){
			if (!onClickCheck) {	
				// var go = "/D/btCatalog/info/"+getUserData[this.id].ngID;
				// location.href = go;
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

//取得管理員
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

function  getBodyCtrl()  {
	var  bodyBkID = $('#beautyDialog').children('div').first().attr('id'),
	bodyCtrl = __.getCtrl(bodyBkID);
	return  bodyCtrl;
}

function useBeautyData(ngID,index,result) {
	var url = beautyTmUpdateApi + ngID;
	var post = getBeautyTmData(index,result);
	var req = {url: url ,post: post};
	__.api( req, function(data) {
		if (data.errCode == 0) {
			alert("更改成功！");
			window.location.reload();
		}
		else {
			alert("更改失敗！");
		}
	});
}

function getBeautyTmData(index,result) {
	var get_data = {
		name : getUserData[index].name,
		length : getUserData[index].length,
		audience : getUserData[index].audience,
		price : getUserData[index].price,
		descTx : getUserData[index].descTx,
		date : getUserData[index].date,
		use : result
	};

	var res = {
		_key : Key,
		title : getUserData[index].title,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data),
		isPublic : "1"
	};
	return res;
}
