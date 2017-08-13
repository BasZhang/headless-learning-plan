var casper = require('casper').create({

    waitTimeout: 1000,

});

casper.start('https://www.baidu.com');
for (var i = 100; i--;) {

casper.thenOpen('https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fm=index&fr=&hs=0&xthttps=111111&sf=1&fmq=&pv=&ic=0&nc=1&z=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&word=msxf&oq=msxf&rsp=-1', function() {
	this.wait(200);
        this.echo(this.getTitle());
    });
}

casper.run();
