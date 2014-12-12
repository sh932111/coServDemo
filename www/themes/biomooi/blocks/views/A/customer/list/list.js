var getUserData;
var onClickCheck;
var Key = "e4b55ab0-d33c-e355-d7e4-8ef415bf40b9";
var loginApi = "/core/user/login";
var deleteUserDataApi = "/beautywebSource/userSource/delete/";

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

	var controllBar = document.getElementById("controllBar");
	ctrl.embed(controllBar,"/A/customer/controllBar", {},function(data){

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
		var num = i + index * 20;
		if (i == 20) {
			break;
		}
		else if (num == getUserData.length) {
			break;
		}
		var tr = document.createElement("tr");
		var client_id = document.createElement("td");
		client_id.innerHTML = getUserData[num].ngID;
		var name_id = document.createElement("td");
		name_id.innerHTML = getUserData[num].name;
		var gender_id = document.createElement("td");
		gender_id.innerHTML = showGender(getUserData[num].gender);
		var dob_id = document.createElement("td");
		dob_id.innerHTML = getUserData[num].dob;
		var addr_id = document.createElement("td");
		addr_id.innerHTML = getUserData[num].addr;
		var phone_id = document.createElement("td");
		phone_id.innerHTML = getUserData[num].phone;
		var fun_id = document.createElement("td");
		var update_bt = document.createElement("button");
		update_bt.id = num;
		update_bt.innerHTML = "編輯";
		update_bt.className = "btn btn-primary";
		update_bt.addEventListener("click", function(e){
			onClickCheck = true;
			var go = "/A/customer/edit/"+getUserData[this.id].ngID;
			location.href = go;
		});
		var delete_bt = document.createElement("button");
		delete_bt.id = num;
		delete_bt.innerHTML = "刪除";
		delete_bt.className = "btn";
		delete_bt.addEventListener("click", function(e){
			onClickCheck = true;
			if(confirm("確定刪除？")){
				deleteUserData(getUserData[this.id].ngID);
			}
		});
		fun_id.appendChild(update_bt);
		fun_id.appendChild(delete_bt);
		tr.id = num;
		tr.addEventListener("click", function(e){
			if (!onClickCheck) {	
				var go = "/A/customer/info/"+getUserData[this.id].ngID;
				location.href = go;
			}
			onClickCheck = false;
		});
		tr.appendChild(client_id);
		tr.appendChild(name_id);
		tr.appendChild(gender_id);
		tr.appendChild(dob_id);
		tr.appendChild(addr_id);
		tr.appendChild(phone_id);
		tr.appendChild(fun_id);
		tbody.appendChild(tr);
	}
}

//動態產生下方button，index為需disabled的值
function refreshLink(index) {
	var listLinkBox = document.getElementById("listLinkBox");
	$(listLinkBox).empty();
	var num = getMathRemainder(getUserData.length,20);
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

//判斷男女
function showGender(i){
	if (i == "0") {
		return "女";
	}
	else {
		return "男";
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

function deleteUserData(ngID) {
	getRoot(function(token){
		var url = deleteUserDataApi+ngID;
		var  req = {url: url,post: {
			token : token
		}};
		__.api( req, function(data) {
			if (data.errCode==0) {
				alert("刪除成功！");
				window.location.reload();
			}
		});
	});
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
