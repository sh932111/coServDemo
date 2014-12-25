
ctrl.startup = function() {
	document.getElementById('matterInput').value = document.getElementById('matterInput').value.replace(/<br>/g, "\n"); 

	ctrl.embed(addWaitDialog("pageHeader"),"/A/customer/waitDialog", {},function(data){});
	
	var dateInput = document.getElementById('dateInput');
	$(dateInput).datetimepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		minView: 3
	});
	var userPhoto = document.getElementById("userPhoto");
	var get_id = '<%=value.ngID%>';
	var params = {
		ngID : get_id
	};
	
	ctrl.embed(userPhoto,"/A/customer/uploadImg", { params:params },function(data){
		var userPhotoImg = document.getElementById("userPhotoImg");
		var uri = '<%=value.iconURI%>';
		if (uri != "undefined") {
			var path = "http://tw.coimotion.com/images/<%=value.ngID%>?path="+uri;
			userPhotoImg.src = path;
			userPhotoImg.style.height = "auto";
		}
	});
};

ctrl.saveData = function(){
	var url = userSourceUpdateApi +"<%=value.ngID%>";
	var post = getUserData();

	if (post) {
		$("#waitLink").click();
		callApi(url,post,function(res){
			$("#waitCancel").click();
			if (res) {
				alert("更新成功！");
				location.href = "/A/customer/list?_pn=1&_ps=20&key=-1";
			}
			else {
				alert("更新失敗！");
			}
		});
	}
};

function getUserData() {
	var matterInput = document.getElementById('matterInput').value;
	if (matterInput.length > 256) {
		alert("注意事項最多只能輸入256個字元！");
		return false;
	}
	matterInput = matterInput.replace(/  /g, "&nbsp;&nbsp;");
 	matterInput = matterInput.replace(/\n/g,"<br>");
 	var nameInput = document.getElementById('nameInput').value;
	var userIdInput = document.getElementById('userIdInput').value;
	if(!checkUserId(userIdInput)) {
		return false;
	}
	var dateInput = document.getElementById('dateInput').value;
	var addrInput = document.getElementById('addrInput').value;
	var emailInput = document.getElementById('emailInput').value;
	if(!(emailInput.indexOf("@") > -1)) {
		alert("信箱格式未達標準！");
		return false;
	}
	if(!(emailInput.indexOf(".com") > -1)) {
		alert("信箱格式未達標準！");
		return false;
	}
	var phoneInput = document.getElementById('phoneInput').value;
	if(!checkCellphone(phoneInput)) {
		return false;
	}
	var genderView = document.getElementById('genderView').getElementsByTagName('input')[0];
	var gender = genderView.checked ? "1":"0";
	var get_data = {
		name : nameInput,
		nid : userIdInput,
		dob : dateInput,
		gender : gender,
		email : emailInput,
		phone : phoneInput,
		addr : addrInput,
		matter : matterInput
	};
	var get_data2 = {
		name : nameInput,
		nid : userIdInput,
		dob : dateInput,
		gender : gender,
		email : emailInput,
		phone : phoneInput,
		addr : addrInput
	};

	var res = {
		_key : Key,
		title : nameInput,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data2),
		isPublic : "1"
	};
	return res;
}