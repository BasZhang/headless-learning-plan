// phantom.outputEncoding="GBK"; // 中文编码

var casper = require('casper').create(); // casper对象，自定义配置

casper.start('http://www.baidu.com/'); // 第一个浏览step

casper.then(function() {
    this.echo('First Page: ' + this.getTitle());
});

casper.thenOpen('http://www.msxf.com', function() { // 第二个浏览step
    this.echo('Second Page: ' + this.getTitle());
});

casper.run(); // 必须的
