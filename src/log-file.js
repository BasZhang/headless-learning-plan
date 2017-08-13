var fs = require('fs');

var page = require('webpage').create();

console.oldLog = console.log;

console.log = function(str) {
    console.oldLog(str);
    fs.write('out.log', str, 'a');
};

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onAlert = function(msg) {
    console.log(msg);
};

page.open('http://www.baidu.com',
function() {
    phantom.exit(0);
});