import request from 'request-promise';
import cp from 'child_process';
class Visitor{
	constructor() {
        
    };
    random(min,max){
    	let range = max - min;   
		let rand = Math.random();   
		return(min + Math.round(rand * range)); 
    }
    createIP(){
    	return this.random(1 , 254)+ "." + this.random(1 , 254)+ "." + this.random(1 , 254)+ "." + this.random(1 , 254);
    }
    getHost(url){
    	let patt = new RegExp("(http|https)://([^/]*)/?");
    	let host = patt.exec(url)
    	return host!=false?host[2]:false;
    }
    getHeaders(url,options){
		let ip = this.createIP();
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
	        'Upgrade-Insecure-Requests':'1'
		}
		if(typeof options !='undefined' && typeof options.referer !='undefined'){
			headers.referer = options.referer
		}
		if(typeof this.options !='undefined' && typeof options.host !='undefined'){
			headers.host = this.getHost(url);
		}
    	return headers;
    }
    visit(url,options){
    	return request.get({
    			url:url,
    			timeout:0,
				headers: this.getHeaders(url,options)
			}).on('error',(error)=>{
				console.log(error)
			}).on('close',()=>{
				console.log('close')
			})
    }
    ping(url){
    	let host = this.getHost(url);
    	let promise = new Promise((resolve, reject) => {
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
		return promise;
    }
}

export default Visitor;