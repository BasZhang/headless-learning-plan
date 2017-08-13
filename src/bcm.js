var system = require('system');
var os = system.os;
if (os.name === 'windows') {
    phantom.outputEncoding='gbk';
    console.log("phantom.outputEncoding='gbk'");
}
var casper = require('casper').create({
		
    waitTimeout: 1000,

});
casper.start('https://pbank.95559.com.cn/personbank/logon.jsp', {
	headers: {
		'Accept': 'text/html, application/xhtml+xml, image/jxr, */*',
		'Accept-Encoding': 'gzip, deflate',
		'Accept-Language': 'zh-Hans-CN, zh-Hans; q=0.8, en-US; q=0.6, en; q=0.4, ja; q=0.2',
		'Connection': 'Keep-Alive',
		'Host': 'pbank.95559.com.cn',
		'Accept-Language': 'zh-Hans-CN, zh-Hans; q=0.8, en-US; q=0.6, en; q=0.4, ja; q=0.2',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
		
		}
	});
casper.then(function printHTML() {
		this.echo(casper.page.content);
	});
casper.thenEvaluate(function removeMask() {
	    var elem = document.getElementById('certMask');
    	elem.parentNode.removeChild(elem);
	    var elem = document.getElementById('safeinputMask');
	    elem.parentNode.removeChild(elem);
    });
casper.then(function captureResults() {
	this.capture('bcm1.png');
});

casper.run();


//Cookie: JSESSIONID=0000Ab0cNaUkAlazaeJTPC9K5ya:-1; com.bocom.jump.bp.channel.http.support.SmartLocaleResolver.LOCALE=zh_CN; oldSafeInput=false
