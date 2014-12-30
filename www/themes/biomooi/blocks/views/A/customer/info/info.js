ctrl.startup = function() {
	document.getElementById('matterInput').value = document.getElementById('matterInput').value.replace(/<br>/g, "\n"); 

	var userPhoto = document.getElementById("userPhoto");
	ctrl.embed(userPhoto,"/A/customer/uploadImg", "",function(data){
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
	var go = "/A/customer/edit/"+"<%=value.ngID%>";
	location.replace(go);
};

ctrl.goIndex = function(){
	location.replace("/A/customer/list?_pn=1&_ps=20&key=-1");
};