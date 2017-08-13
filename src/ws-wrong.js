var webserver = require('webserver');
var server = webserver.create();

var service = server.listen('127.0.0.1:9999', function(req, resp) {
    console.log('receive req');
    var casper = require('casper').create({
        pageSetting: {
            loadPlugin: false,
            loadImage: false,
        }
    });
    var urls = ['https://www.baidu.com/home/news/data/newspage?nid=3975135038184008695&n_type=0&p_from=1&dtype=-1',
                'https://baike.baidu.com/item/%E9%AB%98%E5%9C%86%E5%9C%86/261975?fr=aladdin',
                'https://www.zhihu.com/question/30001823?from=timeline&isappinstalled=0'];
    casper.start(urls[new Date().getTime() % 3]);
    casper.waitForText('高圆圆', function() {
        var content = casper.page.content;
        resp.write(content);
        resp.close();
        console.log('response resp');
    }, function() {
        resp.write('time out!');
        resp.close();
        console.log('wait timeout');
    }, 3000);

    casper.run(function() {});
});
