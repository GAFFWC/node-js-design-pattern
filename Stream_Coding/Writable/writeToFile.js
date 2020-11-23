const ToFileSTream = require("./toFileStream");
const tfs = new ToFileSTream();

tfs.write({
    path: "hello.txt",
    content: "Hello"
});
