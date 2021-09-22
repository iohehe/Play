"use strict";
exports.__esModule = true;
exports.CharStream = void 0;
var CharStream = /** @class */ (function () {
    function CharStream(data) {
        this.pos = 0;
        this.line = 1;
        this.col = 0;
        this.data = data;
    }
    CharStream.prototype.peek = function () {
        return this.data.charAt(this.pos);
    };
    CharStream.prototype.next = function () {
        var ch = this.data.charAt(this.pos++);
        if (ch == '\n') {
            this.line++;
            this.col = 0;
        }
        else {
            this.col++;
        }
        return ch;
    };
    CharStream.prototype.eof = function () {
        return this.peek() == '';
    };
    return CharStream;
}());
exports.CharStream = CharStream;
