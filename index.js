var os = require('os');

var platform = os.platform();

if(platform == "darwin") {
    module.exports = require("./darwin_x64/allofw.node");
}
if(platform == "win32") {
    module.exports = require("./win32_x64/allofw.node");
    module.exports.OpenVR = require("./win32_x64/allofw_openvr.node");
}
if(platform == "linux") {
    module.exports = require("./linux_x64/allofw.node");
}
