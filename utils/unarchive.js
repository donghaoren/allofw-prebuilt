let fs = require("fs");
let zlib = require("zlib");
let path = require("path");
let os = require("os");

function decompressArchive(inputFile, directory) {
    let data = fs.readFileSync(inputFile);
    data = zlib.gunzipSync(data);
    let offset = 0;

    try {
        fs.mkdirSync(directory);
    } catch(e) {
    }

    while(offset < data.length) {
        let filenameLength = data.readInt32LE(offset);
        offset += 4;
        let filename = data.slice(offset, offset + filenameLength).toString("utf-8");
        offset += filenameLength;
        let contentLength = data.readInt32LE(offset);
        offset += 4;
        let content = data.slice(offset, offset + contentLength);
        offset += contentLength;

        fs.writeFileSync(path.join(directory, filename), content);
    }
}

let platform = os.platform();
if(platform == "darwin") {
    decompressArchive("archive/darwin_x64.gz", "darwin_x64");
}
if(platform == "win32") {
    decompressArchive("archive/win32_x64.gz", "win32_x64");
}
if(platform == "linux") {
    decompressArchive("archive/linux_x64.gz", "linux_x64");
}
