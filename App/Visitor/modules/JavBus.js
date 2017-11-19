import Visitor from '../';
import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
import async from 'async';
class JavBus extends Visitor{
	constructor() {
		super(); 
        this.publishPage = 'https://announce.javbus2.pw/website.php';
        this.url = '';
    };
    //获取訪問地址
    getUrls(body){
    	let urls = [];
		let $ = cheerio.load(body)
		let length = $('h4').length;
		$('h4').each(function(i, elem) {
			let url = $(this).find('a').html();
		  	if(url!=null){
				urls.push($('h4').eq(i).find('a').html())
			}
		});
		let promises = [];
		urls.map((url)=>{
			promises.push( this.ping(url) );
		})
		return Promise.all(promises)
    }
    //获取最快的一个访问地址
    getFastUrl(urls){
    	let fast = 0 ;
		urls.map((v)=>{
			if(v.alive && (v.time<=fast || fast==0)){
				fast = v;
			}
		})
		this.url = fast.url;
		return fast.url;
    }
    //获取影片列表
    getMovieList(body){
    	let $ = cheerio.load(body);
		let promises = [];
		let _this = this;
		$('a.movie-box').each(function(i, elem) {
			let url = $(this).attr('href');
			promises.push( _this.visit(url,{referer:this.url}) );
		})
		return Promise.all(promises)
    }
    run(){
    	//访问发布页
    	this.visit(this.publishPage).then((body)=>{
    		console.log(body)
			return this.getUrls(body);//获取訪問地址
    	/*}).then((...args)=>{
    		let url = this.getFastUrl(args[0]);//获取最快的一个访问地址
			return this.visit(url);
    	}).then((body)=>{
    		return this.getMovieList(body);
			//return Promise.all(promises)
    	}).then((...args)=>{
    		let data = [];
    		async.mapLimit(args[0], 5, (body)=> {
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
				console.log(data)
			})*/
    	}).catch((err)=>{
    		console.log(err)
    	});
    }
	
}
export default JavBus;