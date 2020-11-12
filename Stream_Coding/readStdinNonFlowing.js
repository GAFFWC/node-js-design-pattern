let text = "";

process.stdin
    // readable stream 이벤트에 대하여 listener 등록 (non-flowing)
    // 새로운 데이터가 읽기 가능하게 되면 즉시 호출
    .on("readable", () => {
        let chunk;
        while ((chunk = process.stdin.read()) !== null) {
            console.log(`Chunk read: (${chunk.length}) "${chunk.toString().split("\n")[0]}"`);
            text += chunk.toString().split("\n")[0];
        }
    })
    .on("end", () => {
        process.stdout.write(`Whole of stream : ${text}\n`);
    });
