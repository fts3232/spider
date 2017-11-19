import JavBus from './Visitor/modules/JavBus';
let v = new JavBus();
v.run();
/*request.get('https://announce.javbus2.pw/website.php',(error, response, body)=>{
	if (!error && response.statusCode == 200) {
		// 输出网页内容
		console.log(body)
		//resolve(body);
	}else{
		console.log(error)
		//reject(url+" failure reason");
	}
})*/