const Chance = require("chance");
const { Writable, Stream } = require("stream");
const chance = new Chance();

require("http")
    .createServer((req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        const generateMore = () => {
            while (chance.bool({ likelihood: 100 })) {
                // highWaterMark의 버퍼 크기 제한에 걸릴 가능성을 높이기 위해 string 길이를 16KByte - 1Byte로
                const success = res.write(chance.string({ length: 16 * 1024 - 1 }));

                // write()는 스트림 버퍼가 다 차면 false를 뱉음
                if (!success) {
                    console.log("Back Pressure!");

                    // drain 이벤트는 스트림을 다시 쓸 수 있게 되었을 때
                    // once로 한 번 더 호출
                    return res.once("drain", generateMore);
                }
            }

            res.end("\nThe end...\n", () => {
                console.log("All data was sent");
            });
        };

        generateMore();
    })
    .listen(80, () => {
        console.log("Listening on port 80!");
    });
