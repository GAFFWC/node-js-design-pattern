let text = "";

process.stdin
    // data stream 이벤트에 listener 등록 (flowing)
    // 이전 버전 (Stream1)
    .on("data", (chunk) => {
        console.log("New data available");
        console.log(`Chunk read: (${chunk.length}) "${chunk.toString().split("\n")[0]}"`);
        text += chunk.toString().split("\n")[0];
    })
    .on("end", () => {
        process.stdout.write(`Whole of stream : ${text}\n`);
    });
