/**
 * 一个更复杂点的例子，模拟登陆一个网站
 */

// 根据系统设置控制台编码
var system = require('system');
var os = system.os;
if (os.name === 'windows') {
    phantom.outputEncoding = 'gbk';
    console.log("phantom.outputEncoding='gbk'");
}

// 清除cookie
phantom.clearCookies();

// 构建和配置casper对象
var casper = require('casper').create({
    pageSettings: {
        javascriptEnabled: true,
        XSSAuditingEnabled: true,
        webSecurityEnabled: false,
        loadImages: true,
        loadPlugins: false,
        localToRemoteUrlAccessEnabled: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36'
    },
    waitTimeout: 3000,
    exitOnError: false,
    httpStatusHandlers: {
        404 : function() {
            console.log(404);
        }
    },
    onAlert: function(msg) {
        console.log(msg);
    },
    onError: function(self, m) {
        console.error('FATAL:' + m);
    },
    onDie: function() {
        console.log('dying');
    },
    onLoadError: function(casper, url) {
        console.error(url + 'can\'t be loaded');
    },
    onPageInitialized: function() {
    },
    onResourceRequested: function(casper, resource) {
        // console.log(arguments[1]["url"] + ' Requested');
        // console.log(JSON.stringify(resource));
    },
    onResourceReceived: function(casper, resource) {
        // console.log(arguments[1]["url"] + ' Received');
    },
    onResourceError: function() {},
    onStepCompleted: function() {
        console.log('step completed');
    },
    onStepTimeout: function() {
        console.log('timeout');
    },
    logLevel: "debug",
    verbose: false
});

// 传入参数
var account = casper.cli.args[0] || '';
var pass = casper.cli.args[1] || '';

// 捕捉remote环境的打印
casper.on('remote.message',
function(msg) {
    this.log(msg, 'info');
});

/*
casper.on('resource.requested',
function(requestData, request) {
    // if (requestData.url.match(/google|gstatic|doubleclick/)) {
    // request.abort();
    // return;
    // }
});
*/

casper.start('http://www.jsnt.lss.gov.cn:1002/query/');

var _paramPack1 = {
    method: 'post',
    data: {
        type: "1",
        account: account,
        password: pass
    },
    headers: {
        Host: 'www.jsnt.lss.gov.cn:1002',
        Connection: 'keep-alive',
        Accept: '*/*',
        Origin: 'http://www.jsnt.lss.gov.cn:1002',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Referer: 'http://www.jsnt.lss.gov.cn:1002/query/index.html',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8'
    }
};

casper.then(function getLoginInfo() {
    var checkcode = this.evaluate(function() {
        return document.querySelector('input[name="checkcode"]').value;
        // TODO 模拟鼠标事件
    });
    this.echo(checkcode);
    _paramPack1.data.checkcode = checkcode;
});

casper.thenOpen('http://www.jsnt.lss.gov.cn:1002/query/loginvalidate.html', _paramPack1);

var _paramPack2 = {
    method: 'get',
    headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Cache-Control': 'max-age=0',
        Connection: 'keep-alive',
        Host: 'www.jsnt.lss.gov.cn:1002',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36',
        Referer: 'http://www.jsnt.lss.gov.cn:1002/query/index.html',
    }
};

var _paramPack3 = {};

casper.then(function parseLoginParam() {

    var result = this.getPageContent().replace(/\['([^']*)'\]/g, "$1");
    
    /*
    var cookies = this.page.cookies;
    this.echo("cookie.length = " + cookies.length);
    for (var i in cookies) {
        this.echo(cookies[i].name + "=" + cookies[i].value);
    }
    */

    var res = result.split("\|");
    if (res[0] == "success") {
        _paramPack3.userid = res[1];
        _paramPack3.sessionid = res[2];
    } else {
        this.log('errrrrrrrrrrrrr', 'error');
    }

});

casper.then(function login() {
    var url = 'http://www.jsnt.lss.gov.cn:1002/query/index.html?userid=' + _paramPack3.userid + '&sessionid=' + _paramPack3.sessionid;

    this.open(url, _paramPack2);

    this.then(function captureLogon() {
        this.capture('logon.png');
        // frame必须切换，否则不能找到selector
        this.page.switchToFrame('leftFrame');

    	// 等待元素出现
        this.waitForSelector('#pNode1_sub1',
        function clickGrxxx() {
        	// click点击按钮，发送查询请求
            this.click('#pNode1_sub1 a');

            this.then(function captureCx1() {
                this.capture('logon_cx1.png');
            });
        });
    });
});

casper.run(function() {
    this.exit();
});