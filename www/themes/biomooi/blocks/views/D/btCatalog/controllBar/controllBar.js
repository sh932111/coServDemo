var spinnerData;
var spinner = new getSpinner();

ctrl.startup = function() {
	var get_data = '<%=JSON.stringify(value)%>';
	spinnerData = JSON.parse(get_data);
	spinner.loadSpinner(document.getElementById('selectpicker1'),spinnerData.category,spinnerData.category);
	spinner.loadSpinner(document.getElementById('selectpicker2'),spinnerData.detail[0],spinnerData.detail[0]);
};

ctrl.addUserData = function(){
	location.href = "/D/btCatalog/add";	
};

ctrl.setCategory = function(obj){
	spinner.loadSpinner(document.getElementById('selectpicker2'),spinnerData.detail[obj.selectedIndex],spinnerData.detail[obj.selectedIndex]);
};

ctrl.setDetail = function(obj){
	alert("目前還不會改變list上的資料");
};

function getSpinner() {
	this.objText = "";
	this.objId = "";
	this.loadSpinner = function(obj,text_array,id_array){
		obj.options.length = 0;
	    for (var i = 0; i < text_array.length; i++) {
	    	var item = new Option(text_array[i]);
	    	if (i == 0) {
	    		this.objText = text_array[i];
	    		this.objId = id_array[i];
			}
			item.value = id_array[i];
			obj.options.add(item);
	    }
	}
}