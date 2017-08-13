// initialization
phantom.outputEncoding = 'gbk';
var casper = require('casper').create({
    pageSettings: {
        javascriptEnabled: true,
        XSSAuditingEnabled: true,
        webSecurityEnabled: false,
        loadImages: true,
        loadPlugins: false,
        localToRemoteUrlAccessEnabled: true,
        userAgent: "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36"
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
    onResourceRequested: function() {
        console.log(arguments[1]["url"] + ' Requested');
    },
    onResourceReceived: function() {
        console.log(arguments[1]["url"] + ' Received');
    },
    onResourceError: function() {},
    onStepCompleted: function() {
        console.log('step completed');
    },
    onStepTimeout: function() {
        console.log('timeout');
    },
    logLevel: "info",
    verbose: false
});

var url = casper.cli.args[0] || "http://www.jsnt.lss.gov.cn:1002/query/";
var cookie = casper.cli.args[1] || '';

casper.echo(cookie);
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

    // if (requestData.url.match(/storage\.js/)) {
    //     setTimeout(parse, 1000 * 5);
    // }
});

casper.start(url,
function() {});

var checkcode = casper.thenEvaluate(function() {
    return document.querySelector('input[name="checkcode"]').value;

    //this.mouse.move('#drag');
    //this.mouse.down('#drag');
    //this.mouse.move(70,80);
    //this.mouse.up('#drag');
});
var daga = {};
casper.then(function() {
    daga = {
        method: 'post',
        data: {
            type: 1,
            checkcode: checkcode,
    //        
    //       
        },
        header: {
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
});
casper.thenOpen('http://www.jsnt.lss.gov.cn:1002/query/loginvalidate.html', daga,
function() {
    this.echo(checkcode);
    this.echo(this.page.content);
});
casper.run(function() {
    this.exit();
});