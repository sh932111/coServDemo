ctrl.startup = function() {
	document.getElementById('descTxInput').value = document.getElementById('descTxInput').value.replace(/<br>/g, "\n"); 

	var userPhoto = document.getElementById("userPhoto");
	ctrl.embed(userPhoto,"/D/beautyTm/uploadImg", "",function(data){
		var addIcon = document.getElementById("addIcon");
		addIcon.style.display = "none";
		var userPhotoImg = document.getElementById("userPhotoImg");
		var uri = '<%=value.iconURI%>';
		if (uri != "undefined") {
			var path = "http://tw.coimotion.com/images/<%=value.ngID%>?path="+uri;
			userPhotoImg.src = path;
			userPhotoImg.style.height = "auto";
		}
		else {
			var get_path = '<%= JSON.parse(value.body).image_url%>';
			var check = Boolean(get_path) ? '<%= JSON.parse(value.body).image_url%>' : false;
			console.log(get_path);
			if (check != "false") {
				userPhotoImg.src = check;
				userPhotoImg.style.height = "auto";
			}
		}
	});
};

ctrl.editData = function(){
	var go = "/D/beautyTm/edit/"+"<%=value.ngID%>";
	location.replace(go);
};

ctrl.goIndex = function(){
	location.replace("/D/beautyTm/list");
};
