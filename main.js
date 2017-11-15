var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var cp = require('child_process');
var path = require('path');
var fs = require('fs');
var app = express();

function tt(){
	var ip = random(1 , 254)  
    + "." + random(1 , 254)  
    + "." + random(1 , 254)  
    + "." + random(1 , 254) 
    var certFile = path.resolve(__dirname, 'ssl/123.cer');
    var caFile = path.resolve(__dirname, 'ssl/2.pem');
request.get('https://pics.dmm.co.jp/digital/video/oyc00145/oyc00145jp-1.jpg',{
				timeout: 0,
				cert: fs.readFileSync(certFile),
				ca: fs.readFileSync(caFile),
				headers: {
				    'User-Agent': 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
				    "X-Forwarded-For":ip ,
			        'Upgrade-Insecure-Requests':'1'

			  	}
		  	},(error, response, body)=>{
				if (!error && response.statusCode == 200) {
					// 输出网页内容
					console.log(1)
				}else{
					console.log(error)
					//reject(url+" failure reason");
				}
})
return false;
}
tt()
return false;

function random(min,max){
	var range = max - min;   
	var rand = Math.random();   
	return(min + Math.round(rand * range)); 
}
function visitor(url){
	let ip = random(1 , 254)+ "." + random(1 , 254)+ "." + random(1 , 254)+ "." + random(1 , 254)  
	return new Promise((resolve, reject) => {
		let patt1 = new RegExp("(http|https)://([^/]*)/?");
		let host = patt1.exec(url);
		console.log(host)
		request.get(url,{
			timeout: 0,
			headers: {
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
		console.log(fast.url)
		return visitor(fast.url);
	//访问页面
	}).then((body)=>{
		let $ = cheerio.load(body);
		let promises = [];
		$('a.movie-box').each(function(i, elem) {
			promises.push( visitor($(this).attr('href')) );
		})
		return Promise.all(promises)
	//访问详情页
	}).then((...args)=>{
		let data = [];
		args[0].map((body)=>{
			setTimeout(()=>{
				let $ = cheerio.load(body)
				let date = $('.col-md-3.info').find('p').eq(1).html()
				date = date.replace(/<[^>]+>.*<[^>]+>/g,"");
				date = date.trim('');
				let bigImage = $('.movie .bigImage').find('img').attr('src');
				let identifier = $('.col-md-3.info').find('p').eq(0).find('span').eq(1).html();
				let title = $('.movie .bigImage').find('img').attr('title');
				data.push({
					'img':bigImage,
					'title':title,
					'date':date,
					'identifier':identifier,
				})
				let dir = path.join('./pic/javbus/',identifier);
				let promise = new Promise((resolve, reject) => {
					fs.readdir(dir,(err,file)=>{
						if(err){
							resolve(0);
						}else{
							resolve(1);
						}
					})
				}).then((data)=>{
					return new Promise((resolve, reject) => {
						if(data==1){
							resolve(1);
						}else{
							fs.mkdir( dir ,function(err){
								if(err){
									reject('目录创建失败');
								}else{
									resolve(1);
								}
							})
						}
					})
				}).then(()=>{
					request.get(bigImage).pipe(fs.createWriteStream(path.join(dir,identifier+'.jpg')))
					console.log(identifier)
					$('.sample-box').each(function(i){
						if($(this).attr('href')!='undefined'){
							console.log($(this).attr('href'))
							setTimeout(()=>{
								//var certFile = path.resolve(__dirname, 'ssl/pics.dmm.co.jp.cer');
								var ip = random(1 , 254)+ "." + random(1 , 254)+ "." + random(1 , 254)+ "." + random(1 , 254)  
								request.get($(this).attr('href'),{
										timeout: 0,
										headers: {
										    'User-Agent': 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
										    "X-Forwarded-For":ip ,
									        'Upgrade-Insecure-Requests':'1'
									  	}
								  	}).on('response', function(response) {
									    console.log(response.statusCode) // 200
									    console.log(dir) // 'image/png'
								  	}).pipe( fs.createWriteStream(path.join(dir,'sample-'+i+'.jpg')) )
							},5000)
							


							//request.get($(this).attr('href'),{timeout: 300000,rejectUnauthorized: false}).pipe( fs.createWriteStream(path.join(dir,'sample-'+i+'.jpg')) )
						}
					})
				}).catch((err)=>{
					console.log(err)
				})
			},5000)
			
			/*fs.readdir(dir,(err,files)=>{
				if(err){
					fs.mkdir( dir ,function(err){
						if(!err){

						}
					})
				}

			})*/
			//request.get(bigImage).pipe(fs.createWriteStream(path.join(dir,identifier+'.jpg')))

			/*$('.sample-box').each(function(i){
				console.log($(this).attr('href'))
				console.log(path.join(dir,'sample-'+i+'.jpg'))
				request.get($(this).attr('href')).pipe( fs.createWriteStream(path.join(dir,'sample-'+i+'.jpg')) )
			})*/

			//request.get($('.movie .bigImage').find('img').attr('src')).pipe(fs.createWriteStream('./pic/javbus/'+$('.col-md-3.info').find('p').eq(0).find('span').eq(1).html()+'.jpg'))
		})
		//console.log(data)
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