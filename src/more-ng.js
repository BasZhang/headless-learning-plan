/**
 * 模拟登陆angularjs网站
 */

// 根据系统设置控制台编码
var system = require('system');
var os = system.os;
if (os.name === 'windows') {
    phantom.outputEncoding = 'gbk';
    console.log("phantom.outputEncoding='gbk'");
}
var fs = require('fs');
fs.write('pic_code.txt', '', 'w');
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
    exitOnError: true,
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
    onLoadError: function(casper, url) {
        console.error(url + 'can\'t be loaded');
    },
    onPageInitialized: function() {},
    onResourceRequested: function(casper, resource) {
        console.log(arguments[1]["url"] + ' Requested');
        // console.log(JSON.stringify(resource));
    },
    onResourceReceived: function(casper, resource) {
        // console.log(arguments[1]["url"] + ' Received');
    },
    logLevel: "debug",
    verbose: false
});

// 传入参数
// 捕捉remote环境的打印
casper.on('remote.message',
function(msg) {
    this.log(msg, 'info');
});

// 传入参数
var account = casper.cli.args[0].replace(/'([^']*)'/g, "$1");
var pass = casper.cli.args[1];

casper.echo('account=' + account);
casper.echo('pass=' + pass);

casper.start('http://113.106.216.244:8003/web/ggfw/app/index.html#/ggfw/grbsxq');

casper.then(function getLoginInfo() {
    this.click('.header_toolbar > ul:nth-child(1) > li:nth-child(3) > a:nth-child(1)');

});
casper.waitForSelector(".login_ico",
function success() {
    this.click(".login_ico");
});
casper.waitForSelector("input[name='LOGINID']",
function success() {
    this.click("input[name='LOGINID']");
    this.sendKeys("input[name='LOGINID']", account);
});
casper.waitForSelector("input[name='PASSWORD1']",
function success() {
    this.click("input[name='PASSWORD1']");
    this.sendKeys("input[name='PASSWORD1']", pass);

    this.wait(500);
    this.capture('pic_code.png');

    // 人工识别验证码，写到文本里，读取文本
    var content = fs.read('pic_code.txt');
    while (content.length < 4) {
        content = fs.read('pic_code.txt');
    }
    content = content.substring(0, 4);
    this.echo(content);
    this.waitForSelector("div.control-group:nth-child(3) > div:nth-child(1) > input:nth-child(2)",
    function success() {
        this.click("div.control-group:nth-child(3) > div:nth-child(1) > input:nth-child(2)");
        this.echo("IMAGCHECK");
        this.sendKeys("div.control-group:nth-child(3) > div:nth-child(1) > input:nth-child(2)", content);
    });
    this.waitForSelector(".button[value='登录']",
    function() {
        this.click(".button[value='登录']");
        this.wait(4000);
    });
    this.then(function() {
        this.capture('finish.jpg')
    });

});

casper.run(function() {
    this.exit();
});
