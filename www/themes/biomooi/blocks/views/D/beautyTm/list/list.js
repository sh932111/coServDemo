var getUserData;
var onClickCheck;

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
	//load data
	getUserData = get_data;
	reloadUserTable(getUserData,0);

	ctrl.embed(addWaitDialog("beautyDialog"),"/A/customer/waitDialog", {},function(data){});

	var beautyDialog = document.getElementById("beautyDialog");
	ctrl.embed(beautyDialog,"/D/beautyTm/beautyDialog", {params: { _loc: '<%=bi.locale%>',_type: 0}},function(data){

	});

	var controllBar = document.getElementById("controllBar");
	ctrl.embed(controllBar,"/D/btCatalog/controllBar", {params: { _loc: '<%=bi.locale%>',_type: "beautyTm"}},function(data){
		var controllBarBt = document.getElementById("controllBarBt");
		controllBarBt.style.display = "none";
		data.addHandler("regReloadList", ctrl.reloadbeautyTmList);
	});

	var listLink = document.getElementById("listLink");
	ctrl.embed(listLink,"/A/customer/listLink", {},function(data){
		refreshLink(0);
	});
};

ctrl.reloadbeautyTmList = function(nData) {
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
		update_bt.innerHTML = "調價格";
		update_bt.className = "btn btn-primary";
		update_bt.addEventListener("click", function(e){
			onClickCheck = true;
			getBodyCtrl().reload('/D/beautyTm/beautyDialog', {id:getAllData[this.id].ngID,params: { _loc: '<%=bi.locale%>',_type: 1}});
		});
		var delete_bt = document.createElement("button");
		delete_bt.id = num;
		delete_bt.className = "btn";
		if (getAllData[num].use) {
			delete_bt.innerHTML = "不提供";
		}
		else {
			delete_bt.innerHTML = "提供";
		}
		delete_bt.addEventListener("click", function(e){
			onClickCheck = true;
			var dialog_title = getAllData[this.id].use ? "確定不提供？" : "確定提供？";
			if(confirm(dialog_title)){
				getAllData[this.id].use = getAllData[this.id].use ? false : true;
				useBeautyData(getAllData,getAllData[this.id].ngID,this.id,getAllData[this.id].use);
			}
		});
		fun_id.appendChild(delete_bt);
		fun_id.appendChild(update_bt);
		tr.id = num;
		tr.addEventListener("click", function(e){
			if (!onClickCheck) {	
				var go = "/D/beautyTm/info/"+getAllData[this.id].ngID;
				location.href = go;
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

function  getBodyCtrl()  {
	var  bodyBkID = $('#beautyDialog').children('div').first().attr('id'),
	bodyCtrl = __.getCtrl(bodyBkID);
	return  bodyCtrl;
}

function useBeautyData(getAllData,ngID,index,result) {
	var url = beautyTmUpdateApi + ngID;
	$("#waitLink").click();
	getBeautyTmData(getAllData,index,result,ngID,function(post){
		if (post) {
			callApi(url,post,function(res){
				$("#waitCancel").click();
				if (res) {
					alert("更新成功！");
					window.location.reload();
				}
				else {
					alert("更新失敗！");
				}
			});
		}
		else {
			$("#waitCancel").click();
		}
	});
}

function getBeautyTmData(getAllData,index,result,ngID,callback) {
	var url = beautyTmViewApi + ngID;
	callApi(url,{},function(data){
		if (data) {
			var get_body = JSON.parse(data.value.body);
			get_body["use"] = result;
			var get_summary = JSON.parse(data.value.summary);
			get_summary["use"] = result;

			var res = {
				_key : Key,
				title : getAllData[index].title,
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
	// 	date : getAllData[index].date,
	// 	image_url : getAllData[index].image_url,
	// 	use : result,
	// 	category : getAllData[index].category,
	// 	detail : getAllData[index].detail
	// };
	// var get_data2 = {
	// 	name : getAllData[index].name,
	// 	length : getAllData[index].length,
	// 	audience : getAllData[index].audience,
	// 	price : getAllData[index].price,
	// 	date : getAllData[index].date,
	// 	image_url : getAllData[index].image_url,
	// 	use : result,
	// 	category : getAllData[index].category,
	// 	detail : getAllData[index].detail
	// };
	// var res = {
	// 	_key : Key,
	// 	title : getAllData[index].title,
	// 	body : JSON.stringify(get_data),
	// 	summary : JSON.stringify(get_data2),
	// 	isPublic : "1"
	// };
	// return res;
}
