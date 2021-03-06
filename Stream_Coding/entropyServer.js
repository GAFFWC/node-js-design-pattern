const Chance = require("chance");
const chance = new Chance();

require("http")
    .createServer((req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        while (chance.bool({ likelihood: 95 })) {
            // writeable 스트림으로 res에 데이터 작성
            res.write(chance.string() + "\n");
        }
        res.end("\nThe end...\n");
        res.on("finish", () => {
            console.log("All data was sent");
        });
    })
    .listen(80, () => {
        console.log("Listening on port 80!");
    });
