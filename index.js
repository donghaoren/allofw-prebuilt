var os = require('os');

var platform = os.platform();

if(platform == "darwin") {
    exports = require("./darwin_x64/allofw.node");
}
if(platform == "win32") {
    exports = require("./win32_x64/allofw.node");
}