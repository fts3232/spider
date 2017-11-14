var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var cp = require('child_process');
var path = require('path');
var fs = require('fs');
var app = express();

function visitor(url){
	return new Promise((resolve, reject) => {
		request.get(url,(error, response, body)=>{
			if (!error && response.statusCode == 200) {
				// 输出网页内容
				resolve(body);
			}else{
				reject("failure reason");
			}
		})
	})
}

function testUrls(urls){
	let promises = [];
	urls.map((url)=>{
		let promise = new Promise((resolve, reject) => {
			if(url.indexOf('http://')!=-1 ){
				host = url.substr(url.indexOf('http://')+7);
			}
			if(url.indexOf('https://')!=-1 ){
				host = url.substr(url.indexOf('https://')+8);
			}
			cp.exec('ping '+host,(err,stdout,stderr)=>{
				let time,alive;
				if(stdout.lastIndexOf('ms')!=-1){
					alive = true;
					time = stdout.substring(stdout.lastIndexOf('=')+2,stdout.lastIndexOf('ms'));
				}else{
					alive = false;
					let time = 'unkown';
				}
				resolve({host:host,time:time,alive:alive,url:url});
			})
		})
		promises.push( promise );
	})
	return Promise.all(promises)
}

function javBus(){
	let publishPage = 'https://announce.javbus2.pw/website.php';
	//访问发布页
	visitor(publishPage).then((body)=>{
		let urls = [];
		let $ = cheerio.load(body)
		let length = $('h4').length;
		$('h4').each(function(i, elem) {
			let url = $(this).find('a').html();
		  	if(url!=null){
				urls.push($('h4').eq(i).find('a').html())
			}
		});
		return testUrls(urls);
	//获取链接地址，判断速度最快的那个
	}).then((...args)=>{
		let fast = 0 ;
		args[0].map((v)=>{
			if(v.alive && (v.time<=fast || fast==0)){
				fast = v;
			}
		})
		return visitor(fast.url);
	//访问页面
	}).then((body)=>{
		let $ = cheerio.load(body);
		let promises = [];
		$('a.movie-box').each(function(i, elem) {
			promises.push( visitor($(this).attr('href')) );
			//request.get($(this).find('img').attr('src')).pipe(fs.createWriteStream('./pic/javbus/'+path.basename($(this).find('img').attr('src'))))
		})
		return Promise.all(promises)
	//访问详情页
	}).then((...args)=>{
		let data = [];
		args[0].map((body)=>{
			let $ = cheerio.load(body)
			let date = $('.col-md-3.info').find('p').eq(1).html()
			date = date.replace(/<[^>]+>/g,"");
			date.trim('');
			data.push({
				'img':$('.movie .bigImage').find('img').attr('src'),
				'title':$('.movie .bigImage').find('img').attr('title'),
				'date':date,
				'identifier':$('.col-md-3.info').find('p').eq(0).find('span').eq(1).html(),
			})
			request.get($('.movie .bigImage').find('img').attr('src')).pipe(fs.createWriteStream('./pic/javbus/'+$('.col-md-3.info').find('p').eq(0).find('span').eq(1).html()+'.jpg'))
		})
		console.log(data)
	}).catch((err)=>{
		console.log(err);
	})	
}
javBus();
return false;


app.get('/', (req, res)=>{

});

let server = app.listen(3000,  ()=>{

	let host = server.address().address;
	let port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});