var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

function visitor(){
	return new Promise((resolve, reject) => {
		request.get('https://announce.javbus2.pw/website.php',function (error, response, body) {
			let url = [];
			if (!error && response.statusCode == 200) {
				// 输出网页内容
				var $ = cheerio.load(body)
				
				let length = $('h4').length;
				for(let i=0;i<=length;i++){
					console.log(1)
					url.push($('h4').eq(i).find('a').html())
				}
				resolve(url);
			}else{
				reject("failure reason");
			}
		})
	})
	
}




app.get('/', function (req, res) {
	visitor().then(function(){
		console.log(2)
		res.send('345');
	}).catch(function(){
		console.log(3)
	})

	/*request.get(url[0],function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// 输出网页内容
			res.send(body);
		}
	})*/
	//res.send('345');
  	
});

var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});