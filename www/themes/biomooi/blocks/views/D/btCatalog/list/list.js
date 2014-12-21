var getUserData;
var onClickCheck;

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
		reloadUserTable(getUserData,0);
		
		var controllBar = document.getElementById("controllBar");
		ctrl.embed(controllBar,"/D/btCatalog/controllBar", {params: { _loc: '<%=bi.locale%>',_type: "btCatalog"}},function(data){
			data.addHandler("regReloadList", ctrl.reloadbtCatalogList);
		});

		var listLink = document.getElementById("listLink");
		ctrl.embed(listLink,"/A/customer/listLink", {},function(data){
			refreshLink(getUserData,0);
		});
	};

	ctrl.reloadbtCatalogList = function(nData) {
		if (nData.category != "總類") {
			var reload_data = [];
			for (var i = 0; i < getUserData.length; i++) {
				if((getUserData[i].category == nData.category) && (getUserData[i].detail == nData.detail)){
					reload_data.push(getUserData[i]);
				}
			}
			reloadUserTable(reload_data,0);
			refreshLink(reload_data,0);
		}
		else {
			reloadUserTable(getUserData,0);
			refreshLink(getUserData,0);
		}
	};

//動態將List生成
function reloadUserTable(getAllData,index) {
	var tbody = document.getElementById("tableBody");
	$(tbody).empty();
	var array_lenght = getAllData.length;

	for (var i = 0; i < array_lenght; i++) {
		var num = i + index * 10;
		if (i == 10) {
			break;
		}
		else if (num == getAllData.length) {
			break;
		}
		var tr = document.createElement("tr");
		var name_id = document.createElement("td");
		name_id.innerHTML = getAllData[num].name;
		var length_id = document.createElement("td");
		length_id.innerHTML = getAllData[num].length;
		var price_id = document.createElement("td");
		price_id.innerHTML = getAllData[num].price;
		var fun_id = document.createElement("td");
		var update_bt = document.createElement("button");
		update_bt.id = num;
		update_bt.innerHTML = "編輯";
		update_bt.className = "btn";
		update_bt.addEventListener("click", function(e){
			onClickCheck = true;
			var go = "/D/btCatalog/edit/"+getAllData[this.id].ngID;
			location.href = go;
		});
		var delete_bt = document.createElement("button");
		delete_bt.id = num;
		delete_bt.innerHTML = "刪除";
		delete_bt.className = "btn btn-danger";
		delete_bt.addEventListener("click", function(e){
			onClickCheck = true;
			if(confirm("確定刪除？")){
				deleteUserData(getAllData[this.id].ngID);
			}
		});
		fun_id.appendChild(update_bt);
		fun_id.appendChild(delete_bt);
		var use_id = document.createElement("td");
		var use_bt = document.createElement("button");
		use_bt.id = num;
		use_bt.addEventListener("click", function(e){
			onClickCheck = true;
			var dialog_title = getAllData[this.id].use ? "刪除引用？" : "確定引用？";
			if(confirm(dialog_title)){
				usebtCatalogData(getAllData,getAllData[this.id].ngID,this.id);
			}
		});
		if (getAllData[num].use) {
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
				var go = "/D/btCatalog/info/"+getAllData[this.id].ngID;
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
function refreshLink(getAllData,index) {
	var listLinkBox = document.getElementById("listLinkBox");
	$(listLinkBox).empty();
	var num = getMathRemainder(getAllData.length,10);
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
				refreshLink(getAllData,this.id);
				reloadUserTable(getAllData,this.id);
			});
		}
		li.appendChild(a);
		listLinkBox.appendChild(li);
	}
}

//刪除資料
function deleteUserData(ngID) {
	var url = btCatalogDeleteApi+ngID;
	callApi (url,{},function(res){
		if (res) {
			alert("刪除成功！");
			window.location.reload();
		}
		else {
			alert("刪除失敗！");
		}
	}) ;
}

//引用
function usebtCatalogData(getAllData,ngID,index) {
	getBtCatalogImg(ngID,function(path){
		if (!getAllData[index].use) {
			var post_beauty = getBeautyTmData(getAllData,index,path);
			var req1 = {url:beautyTmCreateApi ,post: post_beauty};
			__.api( req1, function(data) {
				if (data.errCode == 0) {
					var url = btCatalogUpdateApi + ngID;
					var post = getUpdateData(getAllData,index);
					var req = {url:url  ,post: post};
					__.api( req, function(data) {
						if (data.errCode == 0) {
							alert("引用成功");
							window.location.reload();
						}
					});
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
						console.log(get_list[i].title);
						console.log(getAllData[index].ngID);
						if (get_list[i].title == getAllData[index].ngID) {
							var req_url = beautyTmDeleteApi+get_list[i].ngID;
							var req2 = {url:req_url ,post: {}};
							__.api( req2, function(data) {
								if (data.errCode == 0) {
									var url = btCatalogUpdateApi + ngID;
									var post = getUpdateData(getAllData,index);
									var req = {url:url  ,post: post};
									__.api( req, function(data) {
										if (data.errCode == 0) {
											alert("取消引用成功");
											window.location.reload();
										}
									});
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
	});
}

function getBtCatalogImg(ngID,callback) {
	var url = btCatalogListAuxApi + ngID;
	var req = {url:url  ,post: {nType : 1}};
	__.api( req, function(data) {
		if (data.errCode == 0 && data.value.iconURI) {
			var path = "http://tw.coimotion.com/images/"+ngID+"?path="+data.value.iconURI;
			callback(path);
		}
		else {
			callback(false);
		}
	});
}

//抓取引用的json data
function getUpdateData(getAllData,index) {
	getAllData[index].use = getAllData[index].use ? false : true;
	var get_data = {
		name : getAllData[index].name,
		length : getAllData[index].length,
		audience : getAllData[index].audience,
		price : getAllData[index].price,
		descTx : getAllData[index].descTx,
		use : getAllData[index].use,
		category : getAllData[index].category,
		detail : getAllData[index].detail
	};
	var res = {
		_key : Key,
		title : getAllData[index].name,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data),
		isPublic : "1"
	};
	return res;
}

function getBeautyTmData(getAllData,index,path) {
	var get_data = {
		name : getAllData[index].name,
		length : getAllData[index].length,
		audience : getAllData[index].audience,
		price : getAllData[index].price,
		descTx : getAllData[index].descTx,
		date : getNowTime(),
		image_url : path,
		use : true,
		category : getAllData[index].category,
		detail : getAllData[index].detail
	};

	var res = {
		_key : Key,
		title : getAllData[index].ngID,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data),
		isPublic : "1"
	};
	return res;
}
