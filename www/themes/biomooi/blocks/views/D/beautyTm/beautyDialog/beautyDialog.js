var getBeautyData;
var Key = "e4b55ab0-d33c-e355-d7e4-8ef415bf40b9";
var loginApi = "/core/user/login";
var beautyTmUpdateApi = "/beautywebSource/beautyTm/update/";

ctrl.startup = function() {
	$("#beautymodal").modal({show:false});
	var dateInput = document.getElementById('DateValue');
	$(dateInput).datetimepicker({
		format: 'yyyy-mm-dd',
		minView: 3
	});
	var type = '<%=bi.query._type%>';
	if (type == "1") {
		$("#beautymodalLink").click();
		'<%if (errCode === 0) {%>'
		var get_body = '<%= value.body%>';
		getBeautyData = JSON.parse(get_body);
		'<%}%>'
	}
};

ctrl.checkUpdateData = function() {
	'<%if (errCode === 0) {%>'
	var url = beautyTmUpdateApi+"<%=value.ngID%>";
	var post =  getBeautyTmData();
	if (post) {
		var req = {url:url  ,post:post};
		__.api( req, function(data) {
			if (data.errCode == 0) {
				alert("更新成功！");
				window.location.reload();
			}
			else {
				alert("更新失敗！");
			}
		});
	}
	'<%}%>'
};

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

function getBeautyTmData() {
	var get_data = {
		name : getBeautyData.name,
		length : getBeautyData.length,
		audience : getBeautyData.audience,
		price : document.getElementById("PriceValue").value,
		descTx : getBeautyData.descTx,
		date : document.getElementById("DateValue").value,
		use : true
	};
	var title = "";
	'<%if (errCode === 0) {%>'
		title = "<%=value.title%>";
	'<%}%>'
	var res = {
		_key : Key,
		title : title,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data),
		isPublic : "1"
	};
	return res;
}
