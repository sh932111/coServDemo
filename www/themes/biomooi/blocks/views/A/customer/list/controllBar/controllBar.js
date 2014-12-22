var getUserData = [];
var getIndex = -1;

ctrl.startup = function() {
	$("#mymodal").modal({show:false});

	$('#NameValue').on('valuechange', function (e, previous) {
		hideAllList();
		var reload_data = getValueData($(this).val(),1);
		reloadSelectList(reload_data,"NameMenu",this);
	});
	$('#PhoneValue').on('valuechange', function (e, previous) {
		hideAllList();
		var reload_data = getValueData($(this).val(),2);
		reloadSelectList(reload_data,"PhoneMenu",this);
	});
	$('#NidValue').on('valuechange', function (e, previous) {
		hideAllList();
		var reload_data = getValueData($(this).val(),3);
		reloadSelectList(reload_data,"NidMenu",this);
	});
	$('#DateValue').on('valuechange', function (e, previous) {
		hideAllList();
		var reload_data = getValueData($(this).val(),4);
		reloadSelectList(reload_data,"DateMenu",this);
	});
};

ctrl.clearList = function(){
	hideAllList();	
};

ctrl.addUserData = function(){
	location.href = "/A/customer/add";	
};

ctrl.selectUserData = function(){
	if (getUserData.length  == 0) {
		$("#waitLink").click();
		callApi(userSourceListApi,{},function(data){
			$("#waitCancel").click();
			if (data) {
				var get_data = [];
				for (var i = 0; i < data.value.list.length; i++) {
					var item = data.value.list[i];
					var ngID = data.value.list[i].ngID;
					var summary = item.summary; 
					var get_json = JSON.parse(summary);
					get_json["ngID"] = ngID;
					get_data.push(get_json);
				}
				getUserData = get_data;
				$("#modalLink").click();
			}
			else {
				alert("讀取失敗！");
			}
		});
	}
	else {
		$("#modalLink").click();
	}
};

ctrl.checkSelectData = function(){
	if (getIndex != -1) {
		var get_user_detail_data = getUserData[getIndex];
		ctrl.callHandler("regReloadHistoryList",get_user_detail_data);
	}
	else {
		ctrl.callHandler("regReloadHistoryList",-1);
	}
};

$.event.special.valuechange = {

	teardown: function (namespaces) {
		$(this).unbind('.valuechange');
	},

	handler: function (e) {
		$.event.special.valuechange.triggerChanged($(this));
	},

	add: function (obj) {
		$(this).on('keyup.valuechange cut.valuechange paste.valuechange input.valuechange', obj.selector, $.event.special.valuechange.handler)
	},

	triggerChanged: function (element) {
		var current = element[0].contentEditable === 'true' ? element.html() : element.val()
		, previous = typeof element.data('previous') === 'undefined' ? element[0].defaultValue : element.data('previous')
		if (current !== previous) {
			element.trigger('valuechange', [element.data('previous')])
			element.data('previous', current)
		}
	}
}

function getValueData(key,type) {
	var res_data = [];
	for (var i = 0; i < getUserData.length; i++) {
		var get_user_data = getUserData[i];
		if (type == 1) {
			if (pkValue(key,get_user_data.name,i)) {
				res_data.push(pkValue(key,get_user_data.name,i));
			}
		}
		else if (type == 2) {
			if (pkValue(key,get_user_data.phone,i)) {
				res_data.push(pkValue(key,get_user_data.phone,i));
			}
		}
		else if (type == 3) {
			if (pkValue(key,get_user_data.nid,i)) {
				res_data.push(pkValue(key,get_user_data.nid,i));
			}
		}
		else if (type == 4) {
			if (pkValue(key,get_user_data.dob,i)) {
				res_data.push(pkValue(key,get_user_data.dob,i));
			}
		}
	}
	return res_data;
}

function pkValue(key,get_text,index) {
	if (get_text.indexOf(key) != -1) {
		var data = {
			index : index,
			num : get_text.indexOf(key),
			text : get_text,
			key : key
		};
		return data;
	}
	else {
		return false;
	}
}

function reloadSelectList(reload_data,divName,obj) {
	var menu = document.getElementById(divName);
	$(menu).empty();
	for (var i = 0; i < reload_data.length; i++) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.innerHTML = reload_data[i].text;
		a.id = i;
		a.addEventListener("click", function(e){
			hideAllList();
			var index = reload_data[this.id].index;
			getIndex = index;
			var get_user_detail_data = getUserData[index];
			document.getElementById("NameValue").value = get_user_detail_data.name;
			document.getElementById("PhoneValue").value = get_user_detail_data.phone;
			document.getElementById("NidValue").value = get_user_detail_data.nid;
			document.getElementById("DateValue").value = get_user_detail_data.dob;
		});
		li.appendChild(a);
		menu.appendChild(li);
	}
	var root_div = obj.parentNode;
	root_div.className = "col-sm-8 open";
}

function hideAllList() {
	var formGroup = document.getElementById("formGroup");
	var div_array = formGroup.getElementsByTagName('div');
	for (var i = 0; i < div_array.length; i++) {
		div_array[i].className = "col-sm-8";
	}
}

