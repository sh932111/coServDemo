var getBeautyData;

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
		$("#waitLink").click();
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
	'<%}%>'
};

function getBeautyTmData() {
	var check = true ,category = "",detail = "",get_path = "";
	
	'<%if (errCode === 0) {%>'
		check = '<%= JSON.parse(value.body).use%>';
		check = check == "true";
		category = '<%= JSON.parse(value.body).category%>';
		detail = '<%= JSON.parse(value.body).detail%>';
		get_path = '<%= JSON.parse(value.body).image_url%>';
	'<%}%>'

	var get_data = {
		name : getBeautyData.name,
		length : getBeautyData.length,
		audience : getBeautyData.audience,
		price : document.getElementById("PriceValue").value,
		descTx : getBeautyData.descTx,
		date : document.getElementById("DateValue").value,
		use : check,
		image_url : get_path,
		category : category,
		detail : detail
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
