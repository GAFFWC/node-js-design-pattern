// Readable 스트림 from array
const fromArray = require("from2-array");
// Transform 스트림
const through = require("through2");
const fs = require("fs");

module.exports.ConcatFiles = (destination, files, callback) => {
    const destStream = fs.createWriteStream(destination);

    fromArray
        // 파일 배열에서 Readable 스트림을 만듦
        .obj(files)
        .pipe(
            // through(Transform) 스트림을 생성
            through.obj((file, enc, done) => {
                // 파일 배열의 파일들에 대해 Readable 스트림을 생성
                const src = fs.createReadStream(file);

                // 출력 파일인 destStream에 연결
                // 파일 하나의 읽기를 완료한 후에서 destStream을 닫지 않음 (end: false)
                src.pipe(destStream, {
                    end: false
                });

                // 파일 하나의 내용이 destStream에 전달되면 done을 호출하여 종료 알림
                // 다음 파일이 진행됨
                src.on("end", done);
            })
        )
        // 모든 처리가 끝나면 (모든 파일) destStream을 닫아주고, 콜백으로 넘어감
        .on("finish", () => {
            destStream.end();
            callback();
        });
};
