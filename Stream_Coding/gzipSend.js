const fs = require("fs");
const zlib = require("zlib");
const http = require("http");
const path = require("path");
const crypto = require("crypto");
const file = process.argv[2];
const server = process.argv[3];

const options = {
    hostname: server,
    port: 3000,
    path: "/",
    method: "PUT",
    headers: {
        filename: path.basename(file), // 디렉토리 정보 제거하고 file이름만
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "gzip"
    }
};

const req = http.request(options, (res) => {
    console.log("Server response: " + res.statusCode);
});

// 읽기 스트림 open
fs.createReadStream(file)
    // 암호화도 pipe로 간단하게 적용 가능
    .pipe(crypto.createCipher("aes-192", "a_shared_secret"))
    // 읽기 스트림을 createGzip()과 연결
    .pipe(zlib.createGzip())
    // request와 연결
    .pipe(req)
    .on("finish", () => {
        console.log("File successfully sent");
    });
