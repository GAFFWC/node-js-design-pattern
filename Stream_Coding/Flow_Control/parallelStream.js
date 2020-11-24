const stream = require("stream");

// 작업이 병렬적으로 실행은 되지만 순서는 보장할 수 없음
class ParallelStream extends stream.Transform {
    constructor(userTransform) {
        // 객체 모드
        super({
            objectMode: true
        });

        // userTransform() 함수를 받아서 변수로 저장
        this.userTransform = userTransform;

        // 실행 중인 작업 수
        this.running = 0;
        this.terminateCallback = null;
    }

    _transform(chunk, enc, done) {
        console.log(this);

        // 실행 중인 작업 수 늘림
        this.running++;

        this.userTransform(chunk, enc, this.push.bind(this), this._onComplete.bind(this));

        // userTransform이 완료되길 기다리지 않고 바로 done()을 호출 -> 병렬 실행 유도
        done();
    }

    // 원래 flush는 스트림이 끝나기 직전에 호출됨
    _flush(done) {
        // 따라서 실행 중인 다른 작업이 있으면 done() 콜백을 호출하지 않도록 함
        // done()을 terminateCallback에 저장만 해줌
        if (this.running > 0) {
            this.terminateCallback = done;
        } else {
            done();
        }
    }

    // 비동기 작업이 완료될 때마다 호출
    _onComplete(err) {
        // 이번에 끝난 작업에 대해 빼줌
        this.running--;
        if (err) {
            return this.emit("error", err);
        }

        // 더이상 실행 중인 작업이 없으면 콜백 실행
        if (this.running === 0) {
            this.terminateCallback && this.terminateCallback();
        }
    }
}

module.exports.ParallelStream;
