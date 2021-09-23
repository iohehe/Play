"use strict";
exports.__esModule = true;
exports.Parser = void 0;
var Parser = /** @class */ (function () {
    function Parser(tokenizer) {
        this.tokenizer = tokenizer;
    }
    Parser.prototype.parseProg = function () {
        console.log("\t Parsing ...\n");
        var t = this.tokenizer.peek();
        console.log(t);
    };
    return Parser;
}());
exports.Parser = Parser;
