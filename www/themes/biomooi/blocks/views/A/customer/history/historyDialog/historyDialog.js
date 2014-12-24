var getHistoryData;
var getHistoryData2;

ctrl.startup = function() {
	$("#mymodal").modal({show:false});
	var type = '<%=bi.query._type%>';
	if (type == "1") {
		$("#modalLink").click();
		var get_body;
		var get_summary;
		'<%if (errCode === 0) {%>'
			get_body = '<%= value.body%>';
			get_summary = '<%= value.summary%>';
		'<%}%>'
		getHistoryData = JSON.parse(get_body);
		getHistoryData2 = JSON.parse(get_summary);
		console.log(getHistoryData2);
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
	var ngID = "";
	'<%if (errCode === 0) {%>'
	ngID = "<%=value.ngID%>";
	'<%}%>'
	var url = userHistoryUpdateApi + ngID;
	var post = getData();
	if (post) {
		$("#waitLink").click();
		callApi (url,post,function(res) {
			$("#waitCancel").click();
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
	var title = ""
	'<%if (errCode === 0) {%>'
	title = '<%= value.title%>';
	'<%}%>'
	var res = {
		_key : Key,
		title : title,
		body : JSON.stringify(getHistoryData),
		summary : JSON.stringify(getHistoryData2),
		isPublic : "1"
	};
	return res;
}
