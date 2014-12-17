ctrl.startup = function() {
	sender.init('<%=bi.query.ngID%>');
};

var sender = {
	settings: {
		url: '/',
		type: 'POST',
		processData: false,
		contentType: false,
		success: function() {
			window.location.reload(); 
		},
		error: function(err) {
			alert(JSON.stringify(err));
		}
	},
	init: function(ngID) {
		sender.settings['url'] += "beautyweb/beautywebSource/beautyTm/attach/"+ngID;

		ctrl.sel('#uploader').submit(sender.doUpload);
		ctrl.sel('input[name="file"]').change(function() {
			if (isCheckingImage(this)) {
				ctrl.sel('#uploader').submit();
			}
		});
		sender.newUploadBtn(ctrl.sel('#addIcon'), 1);
	},
	newUploadBtn: function(obj, type) {
		obj.click(function() {
			ctrl.sel('input[name="nType"]').val(type);
			ctrl.sel('input[name="file"]').click();
		});
	},
	doUpload: function(e) {
		e.preventDefault();
		e.stopPropagation();
		sender.settings['data'] = new FormData(e.target);
		$.ajax(sender.settings);
	}
};

function isCheckingImage(obj) {
	var v=$(obj).val();
	if(v !=''){
		var a = v.lastIndexOf("."); 

		var str = v.substring(a + 1);
		console.log(str);

		var imgArr = [ "jpg","jpeg","gif","bmp","JPG","JPEG","GIF","BMP","png","PNG"];
		if($.inArray(str, imgArr)=='-1'){
			clearFileInput(obj);
			alert('請選擇正確的圖片格式！');
			return false;
		} 
	}
	return true;
}

function clearFileInput(ctrl) {
	try {
		ctrl.value = null;
	} catch(ex) { }
	if (ctrl.value) {
		ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
	}
}