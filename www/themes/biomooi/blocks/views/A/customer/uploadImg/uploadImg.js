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
			$("#waitCancel").click();
			alert(JSON.stringify(err));
		}
	},
	init: function(ngID) {
		sender.settings['url'] += "beautyweb/beautywebSource/userSource/attach/"+ngID;

		ctrl.sel('#uploader').submit(sender.doUpload);
		ctrl.sel('input[name="file"]').change(function() {
			if (isCheckingImage(this)) {
				ctrl.sel('#uploader').submit();
				$("#waitLink").click();
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
