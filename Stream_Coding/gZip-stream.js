const fs = require("fs");
const zlib = require("zlib");

const file = process.argv[2];

// 파일을 스트림으로 읽는 객체 생성
fs.createReadStream(file)
    // 파이프로 stream 간에 read와 write event들을 연결해준다.
    // 여러 개의 파이프를 연결하는 것도 가능
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(file + ".gz"))
    .on("finish", () => {
        console.log("File successfully compressed");
    });
