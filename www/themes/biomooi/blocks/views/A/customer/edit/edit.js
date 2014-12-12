var Key = "e4b55ab0-d33c-e355-d7e4-8ef415bf40b9";
var userSourceUpdateApi = "/beautywebSource/userSource/update/";

ctrl.startup = function() {
	$(dateInput).datepicker();
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
		var req = {url:url  ,post: post};
		__.api( req, function(data) {
			if (data.errCode == 0) {
				alert("新增成功！");
				location.href = "/A/customer/list";
			}
			else {
				alert("新增失敗！");
			}
		});
	}
};

function getUserData() {
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
	var matterInput = document.getElementById('matterInput').value;
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
function checkUserId(userId) {
	if (userId.length != 10) {
		alert("身分證未達字數標準！");
		return false;
	}
	for (var i = 0; i < userId.length; i++) {
		var key = userId.charAt(i);
		if (i == 0) {
			if (!checkEnglish(key)) {
				alert("身分證第一碼需為英文！");
				return false;
			}
		}
		else {
			if (!checkNum(key)) {
				alert("身分證後九碼需為數字！");
				return false;
			}
		}
	}
	return true;
}

function checkCellphone(phone) {
	if (phone.length != 10) {
		alert("號碼未達字數標準！");
		return false;
	}
	for (var i = 0; i < phone.length; i++) {
		var key = phone.charAt(i);
		if (!checkNum(key)) {
			alert("號碼需為數字！");
			return false;
		}
	}
	return true;
}

function checkEnglish(key) {
	if (key == "q" || key == "Q" || key == "w" || key == "W" || key == "e" || key == "E" || key == "r" || key == "R" || key == "t" || key == "T"
		|| key == "y" || key == "Y" || key == "u" || key == "U" || key == "i" || key == "I" || key == "o" || key == "O" || key == "p" || key == "P"
		|| key == "a" || key == "A" || key == "s" || key == "S" || key == "d" || key == "D" || key == "f" || key == "F" || key == "g" || key == "G"
		|| key == "h" || key == "H" || key == "j" || key == "J" || key == "k" || key == "K" || key == "l" || key == "L" || key == "z" || key == "Z"
		|| key == "x" || key == "X" || key == "c" || key == "C" || key == "v" || key == "V" || key == "b" || key == "B" || key == "n" || key == "N"
		|| key == "m" || key == "M") {
		return true;
}
else {
	return false;
}
}
function checkNum(key) {
	if(key == "1" || key == "2" || key == "3" || key == "4" || key == "5" || key == "6" || key == "7" || key == "8" || key == "9" || key == "0") {
		return true;
	}
	else {
		return false;
	}
}
