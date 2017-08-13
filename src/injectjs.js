var webPage = require('webpage');
var page = webPage.create();

page.open('https://www.baidu.com', function(status) {
    if (page.injectJs('prt.js')) {
        for (var i = 10; i--;) {
            console.log('seq' + i);
            (function sleep(numberMillis) {
                var now = new Date();
                var exitTime = now.getTime() + numberMillis;
                while (true) {
                    now = new Date();
                    if (now.getTime() > exitTime)
                        return;
                }
            })(2000);
            var p = page.evaluate(function() {
                return prt();
            });
            console.log(p);
        }
    }
    phantom.exit();
});

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}


