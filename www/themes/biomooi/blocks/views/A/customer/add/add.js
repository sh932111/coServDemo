
ctrl.startup = function() {
	ctrl.embed(addWaitDialog("pageHeader"),"/A/customer/waitDialog", {},function(data){});
	$("#dateInput").datetimepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		minView: 3
	});

	var userPhoto = document.getElementById("userPhoto");
	ctrl.embed(userPhoto,"/A/customer/uploadImg", {},function(data){
		var addIcon = document.getElementById("addIcon");
		addIcon.style.display = "none";
	});
};

ctrl.saveData = function(){
	var post = getUserData();
	if (post) {
		$("#waitLink").click();
		callApi(userSourceCreateApi,post,function(res){
			$("#waitCancel").click();
			if (res) {
				alert("新增成功！");
				location.href = "/A/customer/list?_pn=1&_ps=20&key=-1";
			}
			else {
				alert("新增失敗！");
			}
		});
	}
};

function getUserData() {
	var matterInput = document.getElementById('matterInput').value;
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
	var res = {
		_key : Key,
		title : nameInput,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data),
		isPublic : "1"
	};
	return res;
}



