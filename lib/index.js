const decode = require("./decode");
const encode = require("./encode");
const detect = require("./detect");

class Utils {
    constructor(target, ...args) {
        this.ori_target = target;
        this.curr_target = target;
        let _this = this;
        this.decode = {};
        for (let k in decode) {
            this.decode[k] = function () {
                let input = arguments.length ? arguments : [this.curr_target, ...args];
                this.curr_target = decode[k](...input);
                console.log("decode", k, this.curr_target);
                return this;
            }.bind(this);
        }
        this.detect = {};
        for (let k in detect) {
            this.detect[k] = function () {
                let input = arguments.length ? arguments : [this.curr_target, ...args];
                console.log("detect", k, detect[k](...input));
                return this;
            }.bind(this);
        }

        this.encode = {};
        for (let k in encode) {
            this.encode[k] = function () {
                let input = arguments.length ? arguments : [this.curr_target, ...args];
                console.log("encode", k, encode[k](...input));
                return this;
            }.bind(this);
        }
    }
}


module.exports = {
    decode,
    encode,
    detect,
    Utils
}