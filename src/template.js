var casper = require('casper').create({

    waitTimeout: 1000,

});

casper.start('https://www.baidu.com');

casper.then(function() {
    casper.fill('form[name="f"]', {
        wd: "msxf"
    },
    true);
});
casper.then(function() {
    this.waitForSelector('#container',
    function() {
        console.log(getTitle());
    });
});
casper.then(function captureResults() {
    this.capture('baidu.png');
});
casper.run();