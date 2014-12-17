var getUserData;
var onClickCheck;
var Key = "e4b55ab0-d33c-e355-d7e4-8ef415bf40b9";
var loginApi = "/core/user/login";
var btCatalogDeleteApi = "/beautywebSource/btCatalog/delete/";
var btCatalogUpdateApi = "/beautywebSource/btCatalog/update/";
var beautyTmCreateApi = "/beautywebSource/beautyTm/create";
var beautyTmListApi = "/beautywebSource/beautyTm/list";
var beautyTmDeleteApi = "/beautywebSource/beautyTm/delete/";


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
		ctrl.embed(controllBar,"/D/btCatalog/controllBar", {},function(data){

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
		update_bt.innerHTML = "編輯";
		update_bt.className = "btn btn-primary";
		update_bt.addEventListener("click", function(e){
			onClickCheck = true;
			var go = "/D/btCatalog/edit/"+getUserData[this.id].ngID;
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
		var use_id = document.createElement("td");
		var use_bt = document.createElement("button");
		use_bt.id = num;
		use_bt.addEventListener("click", function(e){
			onClickCheck = true;
			var dialog_title = getUserData[this.id].use ? "刪除引用？" : "確定引用？";
			if(confirm(dialog_title)){
				usebtCatalogData(getUserData[this.id].ngID,this.id);
			}
		});
		if (getUserData[num].use) {
			use_bt.innerHTML = "取消";
			use_bt.className = "btn";
		}
		else {
			use_bt.innerHTML = "引用";
			use_bt.className = "btn btn-primary";
		}
		use_id.appendChild(use_bt);
		tr.id = num;
		tr.addEventListener("click", function(e){
			if (!onClickCheck) {	
				var go = "/D/btCatalog/info/"+getUserData[this.id].ngID;
				location.href = go;
			}
			onClickCheck = false;
		});
		tr.appendChild(name_id);
		tr.appendChild(length_id);
		tr.appendChild(price_id);
		tr.appendChild(fun_id);
		tr.appendChild(use_id);
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

//刪除資料
function deleteUserData(ngID) {
	getRoot(function(token){
		var url = btCatalogDeleteApi+ngID;
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

//引用
function usebtCatalogData(ngID,index) {
	var url = btCatalogUpdateApi + ngID;
	var post = getUpdateData(index);
	var req = {url:url  ,post: post};
	__.api( req, function(data) {
		if (data.errCode == 0) {
			if (getUserData[index].use) {
				var post_beauty = getBeautyTmData(index);
				var req1 = {url:beautyTmCreateApi ,post: post_beauty};
				__.api( req1, function(data) {
					if (data.errCode == 0) {
						alert("引用成功");
						window.location.reload();
					}
					else {
						alert("引用失敗！");
					}
				});
			}
			else {
				var req1 = {url:beautyTmListApi ,post: {}};
				__.api( req1, function(data) {
					if (data.errCode == 0) {
						var get_list = data.value.list;
						for (var i = 0; i < get_list.length; i++) {
							if (get_list[i].title == getUserData[index].ngID) {
								var req_url = beautyTmDeleteApi+get_list[i].ngID;
								var req2 = {url:req_url ,post: {}};
								__.api( req2, function(data) {
									if (data.errCode == 0) {
										alert("取消引用成功");
										window.location.reload();
									}
									else {
										alert("取消引用失敗！");
									}
								});
							}							
						}
					}
					else {
						alert("取消引用失敗！");
					}
				});
			}
		}
		else {
			var dialog_title = getUserData[index].use ? "引用失敗" : "取消引用失敗";
			alert(dialog_title);
		}
	});
}

//抓取引用的json data
function getUpdateData(index) {
	getUserData[index].use = getUserData[index].use ? false : true;
	var get_data = {
		name : getUserData[index].name,
		length : getUserData[index].length,
		audience : getUserData[index].audience,
		price : getUserData[index].price,
		descTx : getUserData[index].descTx,
		use : getUserData[index].use
	};
	var res = {
		_key : Key,
		title : getUserData[index].name,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data),
		isPublic : "1"
	};
	return res;
}

function getBeautyTmData(index) {
	var get_data = {
		name : getUserData[index].name,
		length : getUserData[index].length,
		audience : getUserData[index].audience,
		price : getUserData[index].price,
		descTx : getUserData[index].descTx,
		date : getNowTime(),
		use : true
	};

	var res = {
		_key : Key,
		title : getUserData[index].ngID,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data),
		isPublic : "1"
	};
	return res;
}

function getNowTime() {
	var dt = new Date();
	var month = dt.getMonth()+1;
	var day = dt.getDate();
	var year = dt.getFullYear();
	var send_time = year +"/"+ month +"/"+ day;
	return send_time;
}