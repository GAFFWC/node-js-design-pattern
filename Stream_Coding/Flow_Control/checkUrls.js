const fs = require("fs");
const split = require("split");
const request = require("request");
const ParallelStream = require("./parallelStream");

// 입력으로 주어진 파일로부터 Readable 스트림 생성
fs.createReadStream(process.argv[2])
    // 각각의 line을 서로 다른 chunkf로 출력하는 Transform 스트림인 split으로 입력 파일의 내용을 pipe로 연결
    .pipe(split())
    // ParallelStreamdmf 사용하여 요청 헤더를 보내고 응답을 기다려 url을 검사
    // 콜백이 호출될 때 작업 결과를 push해줌
    .pipe(
        new ParallelStream((url, enc, push, done) => {
            if (!url) {
                return done();
            }

            request.head(url, (err, response) => {
                push(url + " is " + (err ? "down" : "up") + "\n");
                done();
            });
        })
    )
    // 모든 결과는 result.txt에 pipe로 저장
    .pipe(fs.createWriteStream("result.txt"))
    .on("finish", () => {
        console.log("All urls were checked");
    });
