var getBeautyData;
var changeBeautyData;
var onClickCheck;

ctrl.startup = function() {
	var get_data = [];
	'<% 
		for (var i = 0; i < value.list.length; i++) {
			var item = value.list[i];
			var ngID = value.list[i].ngID;
			var title = value.list[i].title;
			var summary = item.summary; 
	%>'
			var get_item = '<%=summary%>';
			var get_json = JSON.parse(get_item);
			get_json["ngID"] = '<%=ngID%>';
			get_json["title"] = '<%=title%>';
			get_data.push(get_json);
	'<%
		} 
	%>'
	//load data
	getBeautyData = get_data;
	changeBeautyData = get_data;
	reloadBeautyTable(getBeautyData,0);

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

	var num = getMathRemainder(changeBeautyData.length,10);
	reloadLink(0,num);
};

//callback
ctrl.paginationCallBack = function(index) {
	reloadBeautyTable(changeBeautyData,index);
	var num = getMathRemainder(changeBeautyData.length,10);
	reloadLink(index,num);
};

function reloadLink(index,num) {
	var listLink = document.getElementById("listLink");
	$(listLink).empty();
	ctrl.embed(listLink,"/A/customer/listLink", {params: { _loc: '<%=bi.locale%>', index:index, entries: num}},function(data){
		data.addHandler("regReloadList", ctrl.paginationCallBack);
	});
}

ctrl.reloadbeautyTmList = function(nData) {
	if (nData.category != "總類") {
		var reload_data = [];
		for (var i = 0; i < getBeautyData.length; i++) {
			if((getBeautyData[i].category == nData.category) && (getBeautyData[i].detail == nData.detail)){
				reload_data.push(getBeautyData[i]);
			}
		}
		changeBeautyData = reload_data;
		reloadBeautyTable(changeBeautyData,0);
		var num = getMathRemainder(changeBeautyData.length,10);
		reloadLink(0,num)
	}
	else {
		changeBeautyData = getBeautyData;
		reloadBeautyTable(changeBeautyData,0);
		var num = getMathRemainder(changeBeautyData.length,10);
		reloadLink(0,num)
	}
};
//動態將List生成
function reloadBeautyTable(getAllData,index) {
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
		length_id.className = "tdStyle";
		var price_id = document.createElement("td");
		price_id.innerHTML = "$"+getAllData[num].price;
		price_id.className = "tdStyle";
		var fun_id = document.createElement("td");
		var update_bt = document.createElement("button");
		update_bt.id = num;
		update_bt.innerHTML = "調價格";
		update_bt.className = "btn btn-price";
		update_bt.addEventListener("click", function(e){
			onClickCheck = true;
			getBodyCtrl().reload('/D/beautyTm/beautyDialog', {id:getAllData[this.id].ngID,params: { _loc: '<%=bi.locale%>',_type: 1}});
		});
		var delete_bt = document.createElement("button");
		delete_bt.id = num;
		delete_bt.className = "btn btn-offer";
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
}
