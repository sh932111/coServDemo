exports.run = function(inData, callback) {
	var category = ["總類","SPA","按摩","美膚"];
	var detail = [["無"],["全身","頭部"],["肩膀","腿部"],["手","腳","全身"]];

	var data = {
		category : category,
		detail : detail
	};
	
	callback( {errCode: 0,
		message: "ok",
		value: data} );
}; 