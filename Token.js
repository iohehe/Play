"use strict";
exports.__esModule = true;
exports.TokenKind = void 0;
var TokenKind;
(function (TokenKind) {
    TokenKind[TokenKind["KeyWord"] = 0] = "KeyWord";
    TokenKind[TokenKind["Identifier"] = 1] = "Identifier";
    TokenKind[TokenKind["StringLiteral"] = 2] = "StringLiteral";
    TokenKind[TokenKind["IntegerLiteral"] = 3] = "IntegerLiteral";
    TokenKind[TokenKind["Seperator"] = 4] = "Seperator";
    TokenKind[TokenKind["Operator"] = 5] = "Operator";
    TokenKind[TokenKind["EOF"] = 6] = "EOF";
})(TokenKind = exports.TokenKind || (exports.TokenKind = {}));
;
