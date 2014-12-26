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
	//load Data
	getUserData = get_data;
	reloadUserTable(getUserData,0);

	ctrl.embed(addWaitDialog("controllBar"),"/A/customer/waitDialog", {},function(data){});

	var controllBar = document.getElementById("controllBar");
	ctrl.embed(controllBar,"/D/btCatalog/controllBar", {params: { _loc: '<%=bi.locale%>',_type: "btCatalog"}},function(data){
		data.addHandler("regReloadList", ctrl.reloadbtCatalogList);
	});

	var listLink = document.getElementById("listLink");
	ctrl.embed(listLink,"/A/customer/listLink", {},function(data){
		refreshLink(getUserData,0);
	});
	
};

//callback
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
		var num = i + index * 20;
		if (i == 20) {
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
		price_id.innerHTML = "$"+getAllData[num].price;
		var fun_id = document.createElement("td");
		var update_bt = document.createElement("button");
		update_bt.id = num;
		update_bt.innerHTML = "編輯";
		update_bt.className = "btn btn-edit";
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
			use_bt.className = "btn btn-cancel";
		}
		else {
			use_bt.innerHTML = "引用";
			use_bt.className = "btn btn-cite";
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
	var num = getMathRemainder(getAllData.length,20);
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
	$("#waitLink").click();
	callApi (url,{},function(res){
		$("#waitCancel").click();
		if (res) {
			alert("刪除成功！");
			window.location.reload();
		}
		else {
			alert("刪除失敗！");
		}
	}) ;
}

function usebtCatalogData(getAllData,ngID,index) {
	$("#waitLink").click();
	getBtCatalogImg(ngID,function(path){
		if (path) {
			if (typeof path != 'string') {
				path = false;
			}
			if (!getAllData[index].use) {
				getBeautyTmData(getAllData,index,path,function(post_beauty){
					if (post_beauty) {
						callApi(beautyTmCreateApi,post_beauty,function(data){
							if (data) {
								var url = btCatalogUpdateApi + ngID;
								getUpdateData(getAllData,index,function(post){
									if (post) {
										callApi(url,post,function(data){
											$("#waitCancel").click();
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
										$("#waitCancel").click();
										alert("引用失敗！");
									}
								});
							}
							else {
								$("#waitCancel").click();
								alert("引用失敗！");
							}
						});
					}
					else {
						$("#waitCancel").click();
						alert("引用失敗！");
					}
				});
				
			}
			else {
				callApi(beautyTmListApi,{},function(data){
					if (data) {
						var get_list = data.value.list;
						for (var i = 0; i < get_list.length; i++) {
							if (get_list[i].title == getAllData[index].ngID) {
								var req_url = beautyTmDeleteApi+get_list[i].ngID;
								callApi(req_url,{},function(data){
									if (data) {
										var url = btCatalogUpdateApi + ngID;
										getUpdateData(getAllData,index,function(post){
											if (post) {
												callApi(url,post,function(data){
													$("#waitCancel").click();
													if (data.errCode == 0) {
														alert("取消引用成功");
														window.location.reload();
													}
													else {
														alert("取消引用失敗！");
													}
												});
											}
											else {
												$("#waitCancel").click();
												alert("取消引用失敗！");
											}
										});
									}
									else {
										$("#waitCancel").click();
										alert("取消引用失敗！");
									}
								});
							}							
						}
						if (get_list.length == 0) {
							$("#waitCancel").click();
							alert("資料讀取失敗！");
						}
					}
					else {
						$("#waitCancel").click();
						alert("取消引用失敗！");
					}
				});
}
}
else {
	$("#waitCancel").click();
	alert("資料讀取失敗！");
}

});
}

function getBtCatalogImg(ngID,callback) {
	var url = btCatalogListAuxApi + ngID;
	callApi(url,{nType : 1},function(data){
		if (data.errCode == 0 && data.value.iconURI) {
			var path = "http://tw.coimotion.com/images/"+ngID+"?path="+data.value.iconURI;
			callback(path);
		}
		else if (data.errCode == 0) {
			callback(true);
		}
		else {
			callback(false);
		}
	});
}

//抓取引用的json data
function getUpdateData(getAllData,index,callback) {
	getAllData[index].use = getAllData[index].use ? false : true;
	var url = btCatalogViewApi + getAllData[index].ngID;

	callApi(url,{},function(data){
		if (data) {
			var get_body = JSON.parse(data.value.body);
			get_body["use"] = getAllData[index].use;
			var get_summary = JSON.parse(data.value.summary);
			get_summary["use"] = getAllData[index].use;
			var res = {
				_key : Key,
				title : getAllData[index].name,
				body : JSON.stringify(get_body),
				summary : JSON.stringify(get_summary),
				isPublic : "1"
			};
			callback(res);
		}
		else {
			callback(false);
		}
	});
	// var get_data = {
	// 	name : getAllData[index].name,
	// 	length : getAllData[index].length,
	// 	audience : getAllData[index].audience,
	// 	price : getAllData[index].price,
	// 	descTx : getAllData[index].descTx,
	// 	use : getAllData[index].use,
	// 	category : getAllData[index].category,
	// 	detail : getAllData[index].detail
	// };
	// var get_data2 = {
	// 	name : getAllData[index].name,
	// 	length : getAllData[index].length,
	// 	audience : getAllData[index].audience,
	// 	price : getAllData[index].price,
	// 	use : getAllData[index].use,
	// 	category : getAllData[index].category,
	// 	detail : getAllData[index].detail
	// };
	// var res = {
	// 	_key : Key,
	// 	title : getAllData[index].name,
	// 	body : JSON.stringify(get_data),
	// 	summary : JSON.stringify(get_data2),
	// 	isPublic : "1"
	// };
	// return res;
}

//取得上傳資料
function getBeautyTmData(getAllData,index,path,callback) {
	var url = btCatalogViewApi + getAllData[index].ngID;

	callApi(url,{},function(data){
		if (data) {
			var get_time = getNowTime();
			var get_body = JSON.parse(data.value.body);
			get_body["use"] = true;
			get_body["image_url"] = path;
			get_body["date"] = get_time;
			var get_summary = JSON.parse(data.value.summary);
			get_summary["use"] = true;
			get_summary["image_url"] = path;
			get_summary["date"] = get_time;
			var res = {
				_key : Key,
				title : getAllData[index].ngID,
				body : JSON.stringify(get_body),
				summary : JSON.stringify(get_summary),
				isPublic : "1"
			};
			callback(res);
		}
		else {
			callback(false);
		}
	});
	// var get_data = {
	// 	name : getAllData[index].name,
	// 	length : getAllData[index].length,
	// 	audience : getAllData[index].audience,
	// 	price : getAllData[index].price,
	// 	descTx : getAllData[index].descTx,
	// 	date : getNowTime(),
	// 	image_url : path,
	// 	use : true,
	// 	category : getAllData[index].category,
	// 	detail : getAllData[index].detail
	// };
	// var get_data2 = {
	// 	name : getAllData[index].name,
	// 	length : getAllData[index].length,
	// 	audience : getAllData[index].audience,
	// 	price : getAllData[index].price,
	// 	date : getNowTime(),
	// 	image_url : path,
	// 	use : true,
	// 	category : getAllData[index].category,
	// 	detail : getAllData[index].detail
	// };

	// var res = {
	// 	_key : Key,
	// 	title : getAllData[index].ngID,
	// 	body : JSON.stringify(get_data),
	// 	summary : JSON.stringify(get_data2),
	// 	isPublic : "1"
	// };
	// return res;
}
