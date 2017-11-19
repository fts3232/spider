let request = require('request');
let cheerio = require('cheerio');
let cp = require('child_process');
let path = require('path');
let fs = require('fs');

function random(min,max){
	var range = max - min;   
	var rand = Math.random();   
	return(min + Math.round(rand * range)); 
}


function visitor(url,options){
	let ip = random(1 , 254)+ "." + random(1 , 254)+ "." + random(1 , 254)+ "." + random(1 , 254);
	return new Promise((resolve, reject) => {
		let patt1 = new RegExp("(http|https)://([^/]*)/?");
		let host;
		if(typeof url =='object'){
			host = patt1.exec(url.url);
		}else{
			host = patt1.exec(url);
		}
		let headers = {
			'User-Agent': 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
		    'X-Forwarded-For':ip ,
		    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
			'Accept-Encoding':'*',
	        'Accept-Language':'zh-CN,zh;q=0.8',
	        'Cache-Control':'no-cache',
	        'Connection':'keep-alive',
	        'Cache-Control':'no-cache',
	        'Pragma':'no-cache',
	        'Upgrade-Insecure-Requests':'1',
	        'Host':host[2]
		}
		if(typeof options !='undefined'){
			headers.referer = options.referer
		}
		request.get(url,{
			timeout: 0,
			headers: headers
			},(error, response, body)=>{
			if (!error && response.statusCode == 200) {
				// 输出网页内容
				resolve(body);
			}else{
				console.log(error)
				reject(url+" failure reason");
			}
		})
	})
}

let javbus = function(){
	this.publishPage = 'https://announce.javbus2.pw/website.php';
	this.createRandomIP = ()=>{
		return random(1 , 254)+ "." + random(1 , 254)+ "." + random(1 , 254)+ "." + random(1 , 254) 
	};
	this.visitPublishPage = ()=>{
		visitor(this.publishPage).then(()=>{
			console.log(1)
		})
	}
}



let a = '1212sssa';
module.exports = javbus;