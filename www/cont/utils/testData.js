//增加療程資訊測試資料
function addAllCatalogData() {
	addCatalogData("SPA","全身","SPA全身1");
	addCatalogData("SPA","全身","SPA全身2");
	addCatalogData("SPA","全身","SPA全身3");
	addCatalogData("SPA","全身","SPA全身4");
	addCatalogData("SPA","全身","SPA全身5");
	addCatalogData("SPA","全身","SPA全身6");
	addCatalogData("SPA","全身","SPA全身7");
	addCatalogData("SPA","全身","SPA全身8");
	addCatalogData("SPA","全身","SPA全身9");
	addCatalogData("SPA","全身","SPA全身10");
	addCatalogData("SPA","全身","SPA全身11");
	addCatalogData("SPA","頭部","SPA頭部1");
	addCatalogData("SPA","頭部","SPA頭部2");
	addCatalogData("SPA","頭部","SPA頭部3");
	addCatalogData("SPA","頭部","SPA頭部4");
	addCatalogData("SPA","頭部","SPA頭部5");
	addCatalogData("SPA","頭部","SPA頭部6");
	addCatalogData("按摩","肩膀","按摩肩膀1");
	addCatalogData("按摩","肩膀","按摩肩膀2");
	addCatalogData("按摩","肩膀","按摩肩膀3");
	addCatalogData("按摩","腿部","按摩腿部1");
	addCatalogData("按摩","腿部","按摩腿部2");
	addCatalogData("美膚","全身","美膚全身1");
	addCatalogData("美膚","全身","美膚全身2");
	addCatalogData("美膚","全身","美膚全身3");
	addCatalogData("美膚","全身","美膚全身4");
	addCatalogData("美膚","全身","美膚全身5");
	addCatalogData("美膚","全身","美膚全身6");
	addCatalogData("美膚","全身","美膚全身7");
	addCatalogData("美膚","全身","美膚全身8");
	addCatalogData("美膚","全身","美膚全身9");
	addCatalogData("美膚","全身","美膚全身10");
	addCatalogData("美膚","全身","美膚全身11");
	addCatalogData("美膚","手","美膚手1");
	addCatalogData("美膚","手","美膚手2");
	addCatalogData("美膚","手","美膚手3");
	addCatalogData("美膚","手","美膚手4");
	addCatalogData("美膚","手","美膚手5");
	addCatalogData("美膚","手","美膚手6");
	addCatalogData("美膚","腳","美膚腳1");
	addCatalogData("美膚","腳","美膚腳2");
	addCatalogData("美膚","腳","美膚腳3");
	addCatalogData("美膚","腳","美膚腳4");
	addCatalogData("美膚","腳","美膚腳5");
	addCatalogData("美膚","腳","美膚腳6");
}

//增加測試的使用者
function addTestUser(name) {
	var get_data = {
		name : name,
		nid : getUserId(),
		dob : getNowTime(),
		gender : getGender(),
		email : getEmail(),
		phone : getPhone(),
		addr : getAddress(),
		matter : getRandomConsumptionDetail ()
	};
	var get_data2 = {
		name : name,
		nid : getUserId(),
		dob : getNowTime(),
		gender : getGender(),
		email : getEmail(),
		phone : getPhone(),
		addr : getAddress()
	};

	var post = {
		_key : Key,
		title : name,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data2),
		isPublic : "1"
	};

	callApi(userSourceCreateApi,post,function(res){
		console.log(res);
	});
}

//增加歷史資料
function addHistoryData (ngID) {
	var post = getHistoryDataToID(ngID);
	if (post) {
		callApi (userHistoryCreateApi,post,function(data){
			console.log(data);
		}) ;
	};
}

//增加療程資訊
function addCatalogData(category,detail,name) {
	var money = getRandomMoney2();
	var get_data = {
		name : name,
		length : getRandomLength(),
		audience : getRandomAudience(),
		price : money,
		descTx : getRandomDescTx2(),
		use : false,
		category : category,
		detail : detail
	};
	var get_data2 = {
		name : name,
		length : getRandomLength(),
		audience : getRandomAudience(),
		price : money,
		use : false,
		category : category,
		detail : detail
	};
	var post = {
		_key : Key,
		title : name,
		body : JSON.stringify(get_data),
		summary : JSON.stringify(get_data2),
		isPublic : "1"
	};
	
	callApi(btCatalogCreateApi,post,function(res){
		console.log(res);
	});
}

//歷史紀錄測試資料
function getHistoryDataToID(custNo) {
	var name = getRandomDescTx () + "，" + getRandomDescTx () + "，" + getRandomDescTx ();
	var money = getRandomMoney ();
	var get_data = {
		custNo : custNo,
		name : name,
		date : getNowTime(),
		salesTotal : money,
		descTx : name,
		consumptionDate : getNowTime(),
		consumptionDetail :  name ,
		hasComplaints : []
	};
	var get_data2 = {
		custNo : custNo,
		name : name,
		date : getNowTime(),
		salesTotal : money,
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
//地址
function getAddress() {
	var res =  getCity()+getArea()+getRoad()+getNum()+getNum()+getNum()+"號"+getNum()+"樓";
	return res;
}
//市區
function getCity() {
	var maxNum = 9;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["高雄市","台南市","台中市","花蓮市","台北市","屏東市","台東市","中壢市","桃園市","新竹市"];
	return array[n];
} 
//區域
function getArea() {
	var maxNum = 12;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["三民區","左營區","大安區","士林區","中正區","中山區","前鎮區","東北區","太園區","大樹區","大社區","楠梓區","剛山區"];
	return array[n];
}
//路
function getRoad() {
	var maxNum = 9;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["鼎富路","太華路","勝公路","中鋒北路","中正路","中華路","民族路","自由路","成功路","自強路"];
	return array[n];
}
//身分證
function getUserId() {
	var res = "";
	for (var i = 0; i < 10; i++) {
		if (i == 0) {
			res = res + getEnglish();
		}
		else {
			res = res + getNum();
		}
	}
	return res;
}
//英文字
function getEnglish() {
	var maxNum = 25;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	return array[n];
}
//數字
function getNum() {
	var maxNum = 9;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	return n;
}
//性別
function getGender() {
	var maxNum = 1;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	return n;
}
//email
function getEmail() {
	var maxNum = 100;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var res = "test"+n+"@gmail.com";
	return res;
}
//手機
function getPhone() {
	var res = "09";
	for (var i = 0; i < 8; i++) {
		res = res + getNum();
	}
	return res;
}
//金錢
function getRandomMoney () {
	var maxNum = 9;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["$1000","$1200","$1500","$1800","$2000","$2200","$2500","$2800","$3000","$5000"];
	return array[n];
}
//商品
function getRandomDescTx () {
	var maxNum = 9;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["卸妝水","化妝水","香水","潔膚液 ","美妝用品","乳液","面膜","精華液","眼部保養","唇部保養"];
	return array[n];
}
//內容
function getRandomConsumptionDetail() {
	var maxNum = 4;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["優惠給多一點","幾乎都買化妝品","只買男性用品","給予消費建議","買很多不一樣的物品"];
	return array[n];
}

function getRandomLength() {
	var maxNum = 6;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["20分鐘","40分鐘","1小時","100分鐘","2小時","3小時","10分鐘"];
	return array[n];
}

function getRandomAudience() {
	var maxNum = 5;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["小孩","大人","中年人","男人","女人","中年婦女"];
	return array[n];
}

function getRandomDescTx2() {
	var maxNum = 5;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["使用特殊乳液美白","讓人提神自在","附贈頭部穴道按摩","邊聽音樂治療","附贈晶華液","同時感受心靈上的舒爽"];
	return array[n];
}
//金錢
function getRandomMoney2() {
	var maxNum = 15;  
	var minNum = 0;  
	var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
	var array = ["1000","1200","1500","1800","2000","2200","2500","2800","3000","3200","3500","3800","4200","4500","4800","$5000"];
	return array[n];
}
