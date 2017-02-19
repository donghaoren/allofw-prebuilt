let fs = require("fs");
let path = require("path");
let zlib = require("zlib");


function walkDirectory(directory, callback) {
    let list = fs.readdirSync(directory);
    list.forEach((file) => {
        filepath = path.join(directory, file);
        // Get the file's stats
        let stat = fs.statSync(filepath);
        // console.log(stat);
        // If the file is a directory
        if (stat && stat.isDirectory()) {
            // Dive into the directory
            walkDirectory(filepath, callback);
        } else {
            // Call the action
            callback(filepath);
        }
    });
}

function compressDirectory(outputFile, directory) {
    let output = fs.createWriteStream(outputFile);
    let gzip = zlib.createGzip();
    gzip.on("data", (data) => output.write(data));
    gzip.on("end", () => output.end());

    walkDirectory(directory, (file) => {
        let name = path.relative(directory, file);
        let nameBuffer = new Buffer(name, "utf-8");
        let data = fs.readFileSync(file);
        let resolvedBuffer = new Buffer(4 + nameBuffer.length + 4 + data.length);
        resolvedBuffer.writeInt32LE(nameBuffer.length, 0);
        nameBuffer.copy(resolvedBuffer, 4);
        resolvedBuffer.writeInt32LE(data.length, 4 + nameBuffer.length);
        data.copy(resolvedBuffer, 4 + nameBuffer.length + 4);
        gzip.write(resolvedBuffer);
    });
    gzip.end();
}

compressDirectory("archive/linux_x64.gz", "bin/linux_x64");
compressDirectory("archive/darwin_x64.gz", "bin/darwin_x64");
compressDirectory("archive/win32_x64.gz", "bin/win32_x64");