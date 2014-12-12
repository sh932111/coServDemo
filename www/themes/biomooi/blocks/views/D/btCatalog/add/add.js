var Key = "e4b55ab0-d33c-e355-d7e4-8ef415bf40b9";
var btCatalogCreateApi = "/beautywebSource/btCatalog/create";

ctrl.startup = function() {
	var userPhoto = document.getElementById("userPhoto");
	ctrl.embed(userPhoto,"/D/btCatalog/uploadImg", {},function(data){
		var addIcon = document.getElementById("addIcon");
		addIcon.style.display = "none";
	});
};

ctrl.saveData = function(){
	var req = {url: btCatalogCreateApi ,post: getUserData()};
	__.api( req, function(data) {
		if (data.errCode == 0) {
			alert("新增成功！");
			location.href = "/D/btCatalog/list";
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
	var get_data = {
		name : nameInput,
		length : lengthInput,
		audience : audienceInput,
		price : priceInput,
		descTx : descTxInput,
		use : false
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