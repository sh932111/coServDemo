var Key = "e4b55ab0-d33c-e355-d7e4-8ef415bf40b9";
var loginApi = "/core/user/login";
//user api
var deleteUserDataApi = "/beautywebSource/userSource/delete/";
var userSourceCreateApi = "/beautywebSource/userSource/create";
var userSourceUpdateApi = "/beautywebSource/userSource/update/";
var userSourceListApi = "/beautywebSource/userSource/list";
//history api
var userHistoryUpdateApi = "/beautywebSource/userHistory/update/";
var userHistoryCreateApi = "/beautywebSource/userHistory/create";
var userHistoryListApi = "/beautywebSource/userHistory/list";
var userHistoryViewApi = "/beautywebSource/userHistory/view/";
var userHistoryDeleteApi = "/beautywebSource/userHistory/delete/";
//btCatalog api
var btCatalogDeleteApi = "/beautywebSource/btCatalog/delete/";
var btCatalogUpdateApi = "/beautywebSource/btCatalog/update/";
var btCatalogViewApi = "/beautywebSource/btCatalog/view/";
var btCatalogListAuxApi = "/beautywebSource/btCatalog/listAux/";
var btCatalogCreateApi = "/beautywebSource/btCatalog/create";
var btCatalogListApi = "/beautywebSource/btCatalog/list";
//beautyTm
var beautyTmCreateApi = "/beautywebSource/beautyTm/create";
var beautyTmListApi = "/beautywebSource/beautyTm/list";
var beautyTmDeleteApi = "/beautywebSource/beautyTm/delete/";
var beautyTmViewApi = "/beautywebSource/beautyTm/view/";
var beautyTmUpdateApi = "/beautywebSource/beautyTm/update/";

//取得下方button的數目
function getMathRemainder(num,resource) {
	if (resource == 0) {
		return 1;
	}
	var res = 1;
	var x = 0;
	for (var i = 0; i < num; i++) {
		if (x == resource) {
			x = 0;
			res++;
		}
		x ++;
	}
	return res;
}

//使用Api
function callApi (Api,post,callback) {
	getRoot(-1,function(token,index){
		if (token) {
			post["token"] = token;
			var req = {url: Api ,post: post};
			__.api( req, function(data) {
				if (data.errCode == 0) {
					callback(data);
				}
				else {
					callback(false);
				}
			});
		}
		else {
			callback(false);
		}
	});
}

//刪除某資源所有資料
function  deleteAllData (listApi,deleteApi,post) {
	getRoot(-1,function(token,index){
		if (token) {
			post["token"] = token;
			var req = {url: listApi ,post: post};
			__.api( req, function(data) {
				if (data.errCode == 0) {
					for (var i = 0; i < data.value.list.length; i++) {
						var url = deleteApi+data.value.list[i].ngID;
						callApi (url,{},function (res) {
							console.log(res);
						}) 
					};
				}
			});
		}
	});
}

//取得管理員
function getRoot(index,callback) {
	var root_reg = {
		_key : Key,
		accName : "root",
		passwd : "root"
	};
	var req = {url: loginApi ,post: root_reg};
	__.api( req, function(data) {
		if (data.errCode == 0) {
			callback(data.token,index);
		}
		else {
			callback(false,index);
		}
	});
}

//驗證手機
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

//驗證身分證
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

//驗證英文
function checkEnglish(key) {
	if (key == "q" || key == "Q" || key == "w" || key == "W" || key == "e" || key == "E" || key == "r" || key == "R" || key == "t" || key == "T" || key == "y" || key == "Y" || key == "u" || key == "U" || key == "i" || key == "I" || key == "o" || key == "O" || key == "p" || key == "P" || key == "a" || key == "A" || key == "s" || key == "S" || key == "d" || key == "D" || key == "f" || key == "F" || key == "g" || key == "G" || key == "h" || key == "H" || key == "j" || key == "J" || key == "k" || key == "K" || key == "l" || key == "L" || key == "z" || key == "Z" || key == "x" || key == "X" || key == "c" || key == "C" || key == "v" || key == "V" || key == "b" || key == "B" || key == "n" || key == "N" || key == "m" || key == "M") {
		return true;
	}
	else {
		return false;
	}
}

//驗證數字
function checkNum(key) {
	if(key == "1" || key == "2" || key == "3" || key == "4" || key == "5" || key == "6" || key == "7" || key == "8" || key == "9" || key == "0") {
		return true;
	}
	else {
		return false;
	}
}
//抓取現在
function getNowTime() {
	var dt = new Date();
	var month = dt.getMonth()+1;
	var day = dt.getDate();
	var year = dt.getFullYear();
	var send_time = year +"-"+ month +"-"+ day;
	return send_time;
}

function getRandomMoney () {
	var maxNum = 9;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["$1000","$1200","$1500","$1800","$2000","$2200","$2500","$2800","$3000","$5000"];
	return array[n];
}

function getRandomDescTx () {
	var maxNum = 9;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["卸妝水","化妝水","香水","潔膚液 ","美妝用品","乳液","面膜","精華液","眼部保養","唇部保養"];
	return array[n];
}

function getRandomConsumptionDetail () {
	var maxNum = 4;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["優惠給多一點","幾乎都買化妝品","只買男性用品","給予消費建議","買很多不一樣的物品"];
	return array[n];
}

//歷史紀錄測試資料
function getHistoryDataToID(custNo) {
	var name = getRandomDescTx () + "，" + getRandomDescTx () + "，" + getRandomDescTx ();
	var get_data = {
		custNo : custNo,
		name : name,
		date : getNowTime(),
		salesTotal : getRandomMoney (),
		descTx : name,
		consumptionDate : getNowTime(),
		consumptionDetail :  name ,
		hasComplaints : []
	};
	var get_data2 = {
		custNo : custNo,
		name : name,
		date : getNowTime(),
		salesTotal : getRandomMoney (),
		descTx : name,
		consumptionDate : getNowTime(),
		consumptionDetail : name 
	};

	var res = {
		_key : Key,
		title : custNo,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data2),
		isPublic : "1"
	};
	return res;
}
//增加歷史資料
function addTestData (ngID) {
	var post = getHistoryDataToID(ngID);
	if (post) {
		callApi (userHistoryCreateApi,post,function(data){
			console.log(data);
		}) ;
	};
}

function addWaitDialog(obj) {
	var sp1 = document.createElement("div");
	sp1.id = "waitDialogView";
	var sp2 = document.getElementById(obj);
	var parentDiv = sp2.parentNode;
	parentDiv.insertBefore(sp1, sp2);
	return sp1;
}

function checkAllNum(keys,alertText) {
	for (var i = 0; i < keys.length; i++) {
		var key = keys.charAt(i);
		if (!checkNum(key)) {
			alert(alertText+"需為數字！");
			return false;
		}
	}
	return true;
}