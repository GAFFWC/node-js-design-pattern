const stream = require("stream");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

// 스트림의 입력은 문자열이나 버퍼가 아닌 object라고 가정
// {
//     path: <path to a file>,
//     content: <string or buffer>
// }
class ToFileSTream extends stream.Writable {
    constructor() {
        super({
            // object 모드로 동작
            objectMode: true
        });
    }

    // chunk : 버퍼
    _write(chunk, encoding, callback) {
        mkdirp(path.dirname(chunk.path), (err) => {
            if (err) {
                return callback(err);
            }

            fs.writeFile(chunk.path, chunk.content, callback);
        });
    }
}

module.exports = ToFileSTream;
