ctrl.startup = function() {
	
	document.getElementById('descTxInput').value = document.getElementById('descTxInput').value.replace(/<br>/g, "\n"); 

	var userPhoto = document.getElementById("userPhoto");
	ctrl.embed(userPhoto,"/D/btCatalog/uploadImg", "",function(data){
		var addIcon = document.getElementById("addIcon");
		addIcon.style.display = "none";
		var userPhotoImg = document.getElementById("userPhotoImg");
		var uri = '<%=value.iconURI%>';
		if (uri != "undefined") {
			var path = "http://tw.coimotion.com/images/<%=value.ngID%>?path="+uri;
			userPhotoImg.src = path;
			userPhotoImg.style.height = "auto";
		}
	});
};

ctrl.editData = function(){
	var go = "/D/btCatalog/edit/"+"<%=value.ngID%>";
	location.href = go;
};