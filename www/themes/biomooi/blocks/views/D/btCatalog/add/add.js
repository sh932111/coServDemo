var spinner1 = new getSpinner();

ctrl.startup = function() {
	ctrl.embed(addWaitDialog("pageHeader"),"/A/customer/waitDialog", {},function(data){});

	var selectPicker1 = document.getElementById('selectpicker');
	var pickerBt1 = document.getElementById('pickerBt');
	spinner1.loadSpinner(1,selectPicker1,pickerBt1,["小時","分鐘"]);
	var userPhoto = document.getElementById("userPhoto");
	ctrl.embed(userPhoto,"/D/btCatalog/uploadImg", {},function(data){
		var addIcon = document.getElementById("addIcon");
		addIcon.style.display = "none";
	});
};

ctrl.saveData = function(){
	var post = getUserData();
	if (post) {
		$("#waitLink").click();
		callApi (btCatalogCreateApi,post,function(data){
			$("#waitCancel").click();
			if (data) {
				alert("新增成功！");
				location.href = "/D/btCatalog/list";
			}
			else {
				alert("新增失敗！");
			}
		});
	}
};

function getUserData() {
	var descTxInput = document.getElementById('descTxInput').value;
	descTxInput = descTxInput.replace(/  /g, "&nbsp;&nbsp;");
 	descTxInput = descTxInput.replace(/\n/g,"<br>");
 	
	var nameInput = document.getElementById('nameInput').value;
	if(!checkAllNum(document.getElementById('lengthInput').value,"時程")) {
		return false;
	}
	var lengthInput = document.getElementById('lengthInput').value+spinner1.getText;
	var audienceInput = document.getElementById('audienceInput').value;
	if(!checkAllNum(document.getElementById('priceInput').value,"價錢")) {
		return false;
	}
	var priceInput = document.getElementById('priceInput').value;
	var get_data = {
		name : nameInput,
		length : lengthInput,
		audience : audienceInput,
		price : priceInput,
		descTx : descTxInput,
		use : false,
		category : '<%=bi.query.category%>',
		detail : '<%=bi.query.detail%>'
	};
	var get_data2 = {
		name : nameInput,
		length : lengthInput,
		audience : audienceInput,
		price : priceInput,
		use : false,
		category : '<%=bi.query.category%>',
		detail : '<%=bi.query.detail%>'
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

function getSpinner() {
	this.objIndex = 0;
	this.getText = "";
	this.loadSpinner = function(index,obj,obj2,text_array){
		$(obj).empty();
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
}