var spinner1 = new getSpinner();

ctrl.startup = function() {
	ctrl.embed(addWaitDialog("pageHeader"),"/A/customer/waitDialog", {},function(data){});
	var selectPicker1 = document.getElementById('selectpicker');
	var pickerBt1 = document.getElementById('pickerBt');
	spinner1.loadSpinner(1,selectPicker1,pickerBt1,["小時","分鐘"]);

	var check = '<%= JSON.parse(value.body).length%>';
	if(check.indexOf('小時') > -1) {
		spinner1.refresh("小時");	
	}
	else {
		spinner1.refresh("分鐘");
	}
	var userPhoto = document.getElementById("userPhoto");
	var get_id = '<%=value.ngID%>';
	var params = {
		ngID : get_id
	};
	ctrl.embed(userPhoto,"/D/btCatalog/uploadImg", { params:params },function(data){
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
	var url = btCatalogUpdateApi+"<%=value.ngID%>";
	var post = getUserData();
	if (post) {
		$("#waitLink").click();
		callApi (url,post,function(data){
			$("#waitCancel").click();
			if (data) {
				alert("更新成功！");
				location.href = "/D/btCatalog/list";
			}
			else {
				alert("更新失敗！");
			}
		});
	}
};

function getUserData() {
	var nameInput = document.getElementById('nameInput').value;
	var lengthInput = document.getElementById('lengthInput').value+spinner1.getText;
	var audienceInput = document.getElementById('audienceInput').value;
	var priceInput = document.getElementById('priceInput').value+"元";
	var descTxInput = document.getElementById('descTxInput').value;
	var check = '<%= JSON.parse(value.body).use%>';
	check = check == "true";
	var get_data = {
		name : nameInput,
		length : lengthInput,
		audience : audienceInput,
		price : priceInput,
		descTx : descTxInput,
		use : check,
		category : '<%= JSON.parse(value.body).category%>',
		detail : '<%= JSON.parse(value.body).detail%>'
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

function getSpinner() {
	this.objIndex = 0;
	this.getText = "";
	this.getObj;
	this.loadSpinner = function(index,obj,obj2,text_array){
		$(obj).empty();
		this.getObj = obj2;
		for (var i = 0; i < text_array.length; i++) {
	    	var li = document.createElement("li");
			var a = document.createElement("a");
			a.innerHTML = text_array[i];
			a.id = i;
			a.addEventListener("click", function(e){
				obj2.innerHTML = text_array[this.id];
				spinner1.getText = text_array[this.id];
			});
			li.appendChild(a);
	    	if (i == 0) {
	    		obj2.innerHTML = text_array[i];
	    		this.getText = text_array[i];
			}
			obj.appendChild(li);
	    }
	}
	this.refresh = function(text) {
		this.getObj.innerHTML = text;
		this.getText = text;
	}
}

