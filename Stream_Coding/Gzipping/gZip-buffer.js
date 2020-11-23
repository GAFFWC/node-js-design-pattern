const fs = require("fs");
const zlib = require("zlib");

const file = process.argv[2];

// argument로 넘어온 이름의 파일을 불러 버퍼에 넣는다.
fs.readFile(file, (err, buffer) => {
    // 버퍼로 넘어온 데이터를 압축한다.
    zlib.gzip(buffer, (err, compressed) => {
        // .gz 파일로 저장
        fs.writeFile(file + ".gz", compressed, () => {
            console.log("File successfully compressed");
        });
    });
});

// 아주 큰 파일은 압축한다고 하면,
// RangeError: File size is greater than possible Buffer: 0x3FFFFFFF bytes
// 따라서 큰 파일을 다룸에 있어 buffer 방식은 옳지 않다.
