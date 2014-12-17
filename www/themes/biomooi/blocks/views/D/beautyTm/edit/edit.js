var Key = "e4b55ab0-d33c-e355-d7e4-8ef415bf40b9";
var btCatalogUpdateApi = "/beautywebSource/beautyTm/update/";

ctrl.startup = function() {
	var userPhoto = document.getElementById("userPhoto");
	var get_id = '<%=value.ngID%>';
	var params = {
		ngID : get_id
	};
	ctrl.embed(userPhoto,"/D/beautyTm/uploadImg", { params:params },function(data){
		var userPhotoImg = document.getElementById("userPhotoImg");
		var uri = '<%=value.iconURI%>';
		if (uri != "undefined") {
			var path = "http://tw.coimotion.com/images/<%=value.ngID%>?path="+uri;
			userPhotoImg.src = path;
			userPhotoImg.style.height = "auto";
		}
		else {
			var get_path = '<%= JSON.parse(value.body).image_url%>';
			console.log(get_path);
			var check = Boolean(get_path) ? '<%= JSON.parse(value.body).image_url%>' : false;
			if (check != "false") {
				userPhotoImg.src = check;
				userPhotoImg.style.height = "auto";
			}
		}
	});
};

ctrl.saveData = function(){
	var url = btCatalogUpdateApi+"<%=value.ngID%>";
	var req = {url:url  ,post: getUserData()};
	__.api( req, function(data) {
		if (data.errCode == 0) {
			alert("新增成功！");
			location.href = "/D/beautyTm/list";
		}
		else {
			alert("新增失敗！");
		}
	});
};

function getUserData() {
	var nameInput = document.getElementById('nameInput').value;
	var lengthInput = document.getElementById('lengthInput').value;
	var audienceInput = document.getElementById('audienceInput').value;
	var priceInput = document.getElementById('priceInput').value;
	var descTxInput = document.getElementById('descTxInput').value;
	var get_use = '<%= JSON.parse(value.body).use%>';
	var get_path = '<%= JSON.parse(value.body).image_url%>';
	var path = Boolean(get_path) ? '<%= JSON.parse(value.body).image_url%>' : false;
	get_use = Boolean(get_use);
	var get_data = {
		name : nameInput,
		length : lengthInput,
		audience : audienceInput,
		price : priceInput,
		descTx : descTxInput,
		image_url : path,
		use : get_use
	};
	var res = {
		_key : Key,
		title : nameInput,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data),
		isPublic : "1"
	};
	return res;
}