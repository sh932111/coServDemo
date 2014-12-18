var spinnerData;
var spinner1 = new getSpinner();
var spinner2 = new getSpinner();
var selectPicker1 = document.getElementById('selectpicker1');
var selectPicker2 = document.getElementById('selectpicker2');
var pickerBt1 = document.getElementById('pickerBt1');
var pickerBt2 = document.getElementById('pickerBt2');

ctrl.startup = function() {
	var get_data = '<%=JSON.stringify(value)%>';
	spinnerData = JSON.parse(get_data);
	spinner1.loadSpinner(1,selectPicker1,pickerBt1,spinnerData.category);
	spinner2.loadSpinner(2,selectPicker2,pickerBt2,spinnerData.detail[0]);
};

ctrl.addUserData = function(){
	location.href = "/D/btCatalog/add";	
};

function getSpinner() {
	this.loadSpinner = function(index,obj,obj2,text_array){
		$(obj).empty();
		for (var i = 0; i < text_array.length; i++) {
	    	var li = document.createElement("li");
			var a = document.createElement("a");
			a.innerHTML = text_array[i];
			a.id = i;
			a.addEventListener("click", function(e){
				obj2.innerHTML = text_array[this.id];
				if (index == 1) {
					spinner2.loadSpinner(2,selectPicker2,pickerBt2,spinnerData.detail[this.id]);
				}
			});

			li.appendChild(a);
	    	if (i == 0) {
	    		obj2.innerHTML = text_array[i];
			}
			obj.appendChild(li);
	    }
	}
}