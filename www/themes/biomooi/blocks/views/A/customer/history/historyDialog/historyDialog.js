var getHistoryData;

ctrl.startup = function() {
	$("#mymodal").modal({show:false});
	var type = '<%=bi.query._type%>';
	if (type == "1") {
		$("#modalLink").click();
		var get_body = '<%= value.body%>';
		getHistoryData = JSON.parse(get_body);
		var hasComplaintsDetail = document.getElementById("hasComplaintsDetail");
		var has_complaints = getHistoryData.hasComplaints;
		for (var i = 0; i < has_complaints.length; i++) {
			var label = document.createElement("label");
			label.innerHTML = has_complaints[i];
			label.className = "col-sm-12 control-label myLabel";
			hasComplaintsDetail.appendChild(label);
		}
	}
};

ctrl.addComplaintsDetail = function(){
	var hasComplaints = getHistoryData["hasComplaints"];
	hasComplaints.push(document.getElementById("hasComplaintsInput").value);
	getHistoryData["hasComplaints"] = hasComplaints;
	var ngID = "<%=value.ngID%>";
	var url = userHistoryUpdateApi + ngID;
	var post = getData();
	if (post) {
		updateApiData(url,post,function(res){
			if (res) {
				alert("新增成功！");
				ctrl.callHandler("regReloadHasComplaints",ngID);
			}
			else {
				alert("新增失敗！");
			}
		});
	}
};

function getData() {
	var res = {
		_key : Key,
		title : '<%= value.title%>',
		body : JSON.stringify(getHistoryData),
		summary : JSON.stringify(getHistoryData),
		isPublic : "1"
	};
	return res;
}
