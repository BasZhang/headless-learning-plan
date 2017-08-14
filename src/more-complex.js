var system = require('system');
var os = system.os;
if (os.name === 'windows') {
    phantom.outputEncoding = 'gbk';
    console.log("phantom.outputEncoding='gbk'");
}
phantom.clearCookies();

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
        if ('http://www.jsnt.lss.gov.cn:1002/query/loginvalidate.html' == arguments[1]["url"]) {
            console.log(arguments[1]["url"] + ' Requested');
            console.log(JSON.stringify(resource));
        }
    },
    onResourceReceived: function(casper, resource) {
        //   console.log(arguments[1]["url"] + ' Received');
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

var account = casper.cli.args[0] || '';
var pass = casper.cli.args[1] || '';

casper.on('remote.message',
function(msg) {
    this.log(msg, 'info');
});

casper.on('resource.requested',
function(requestData, request) {
    if (requestData.url.match(/google|gstatic|doubleclick/)) {
        request.abort();
        return;
    }
});

casper.start('http://www.jsnt.lss.gov.cn:1002/query/');

var daga = {
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
casper.then(function() {
    var checkcode = this.evaluate(function() {
        return document.querySelector('input[name="checkcode"]').value;
        //this.mouse.move('#drag');
        //this.mouse.down('#drag');
        //this.mouse.move(70,80);
        //this.mouse.up('#drag');
    });
    this.echo(checkcode);
    daga.data.checkcode = checkcode;
});

casper.thenOpen('http://www.jsnt.lss.gov.cn:1002/query/loginvalidate.html', daga);
var daha = {
    method: 'get',
    headers: {
        Host: 'www.jsnt.lss.gov.cn:1002',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        Referer: 'http://www.jsnt.lss.gov.cn:1002/query/left.html?roleId=',
        'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }

};
casper.then(function() {

    this.echo(this.getPageContent());
    var cookies = this.page.cookies;
    this.echo("cookie.length = " + cookies.length);
    for (var i in cookies) {
        this.echo(cookies[i].name + "=" + cookies[i].value);
        phantom.addCookie(cookies[i]);
    }
});
casper.thenOpen('http://www.jsnt.lss.gov.cn:1002/query/person/personINFO_query.html', daha);
casper.then(function() {
    this.wait(1000);
    this.capture('logon.png');
});
casper.run(function() {
    this.exit();
});
