const stream = require("stream");
const util = require("util");

class ReplaceStream extends stream.Transform {
    // 특정 문자열을 다른 문자열로 교체
    constructor(searchString, replaceString) {
        super();

        // 찾을 문자열
        this.searchString = searchString;
        // 교체 문자열
        this.replaceString = replaceString;
        // _transform()에서 사용할 변수 초기화
        // chunk로 잘려버린 문자열을 다시 합치면 searchString이 있을 수도 있으므로 split()의 마지막 문자열은 기억
        this.tailPiece = "";
    }

    _transform(chunk, encoding, callback) {
        // 찾을 문자열 기준으로 잘라서 배열(piece)에 저장
        // 기존에 tailPiece가 있었다면 앞에 붙여줌
        const pieces = (this.tailPiece + chunk).split(this.searchString);

        // chunk로 잘려버린 마지막 부분
        const lastPiece = pieces[pieces.length - 1];

        // searchString의 길이 - 1 만큼 뒷부분에서 가져감
        // searchString의 길이 이상인 부분에서는 앞서 수행한 split에서 걸러지지 않고는 searchString이 또 존재할 수 없다
        const tailPieceLen = this.searchString.length - 1;
        this.tailPiece = lastPiece.slice(-tailPieceLen);

        // 스트림에 push해줄 문자열도 다음 스트림에 전달된 tailPiece만큼은
        pieces[pieces.length - 1] = lastPiece.slice(0, -tailPieceLen);

        // 구분자에 교체 문자열을 집어넣어 다시 문자열로 붙여줌
        this.push(pieces.join(this.replaceString));
        callback();
    }

    _flush(callback) {
        // 스트림 종료시 실행
        // 마지막 tailPiece를 push
        this.push(this.tailPiece);
        callback();
    }
}

module.exports = ReplaceStream;
