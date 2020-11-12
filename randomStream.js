const stream = require("stream");
const Chance = require("chance");
const chance = new Chance();

module.exports = class RandomStream extends stream.Readable {
    constructor(options) {
        super(options);
    }

    _read(size) {
        // 랜덤 string 생성
        const chunk = chance.string();
        console.log(`Pushing chunk of size: ${chunk.length}`);

        // 내부 read 버퍼에 push
        this.push(chunk, "utf8");

        // 5% 확률로 EOF
        if (chance.bool({ likelihood: 5 })) {
            this.push(null);
        }
    }
};
