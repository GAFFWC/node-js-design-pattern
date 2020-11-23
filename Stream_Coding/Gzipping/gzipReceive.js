const http = require("http");
const fs = require("fs");
const zlib = require("zlib");
const crypto = require("crypto");

// 넘어온 파일 스트림을 압축하여 저장
const server = http.createServer((req, res) => {
    // 헤더로 넘어온 파일명
    const filename = req.headers.filename;
    console.log("File request received: " + filename);

    // req를 cipher와 연결
    req.pipe(crypto.createDecipher("aes-192", "a_shared_secret"))
        // req와 Gunzip 연결
        .pipe(zlib.createGunzip())
        // Gunzip과 WriteStream 연결
        .pipe(fs.createWriteStream(filename))
        .on("finish", () => {
            res.writeHead(201, { "content-Type": "text/plain" });
            res.end("That's it\n");
            console.log(`File saved: ${filename}`);
        });
});

server.listen(3000, () => console.log("Listening"));
