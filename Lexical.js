"use strict";
exports.__esModule = true;
exports.Lexical = void 0;
var Token_1 = require("./Token");
var Lexical = /** @class */ (function () {
    function Lexical(stream) {
        this.tokens = new Array();
        this.stream = stream;
        var t = this.peek();
        while (t.kind != Token_1.TokenKind.EOF) {
            console.log(t.text);
            t = this.next();
        }
    }
    Lexical.prototype.peek = function () {
        var t = this.tokens[0];
        if (typeof t == 'undefined') {
            t = this.getAToken();
            this.tokens.push(t);
        }
        return t;
    };
    Lexical.prototype.next = function () {
        var t = this.tokens.shift();
        if (typeof t == 'undefined') {
            return this.getAToken();
        }
        else {
            return t;
        }
    };
    Lexical.prototype.getAToken = function () {
        console.log("\n[+] GET a token\n");
        this.skipWhiteSpaces();
        // stream 空了
        if (this.stream.eof()) {
            return { kind: Token_1.TokenKind.EOF, text: "" };
        }
        else // 词法状态机
         {
            var ch = this.stream.peek();
            //1. Identifier(KeyWord)
            if (this.isLetter(ch) || ch == '_') // 字母下划线开头进
             {
                return this.parseIdentifier();
            }
            //2. StringLiteral
            else if (ch == '"') {
                //console.log("[+] is a StringLiteral token");
                return this.parseStringLiteral();
            }
            //3. Seperator
            else if (this.isSeperators(ch)) {
                //console.log("[+] is a Seperators");
                return this.parseSeperator();
            }
        }
    };
    Lexical.prototype.parseSeperator = function () {
        var token = { kind: Token_1.TokenKind.Seperator, text: "" };
        token.text = this.stream.next();
        //console.log(token);
        return token;
    };
    Lexical.prototype.parseStringLiteral = function () {
        var token = { kind: Token_1.TokenKind.StringLiteral, text: "" };
        this.stream.next(); // 推掉一个引号
        while (this.stream.peek() != '"' && !this.stream.eof()) {
            token.text += this.stream.next();
        }
        if (this.stream.peek() == '"') {
            //console.log("[+] parsed a String Literal token");
            this.stream.next(); //吃掉另一个引号
        }
        //console.log(token);
        return token;
    };
    Lexical.prototype.parseIdentifier = function () {
        var token = { kind: Token_1.TokenKind.Identifier, text: "" };
        token.text += this.stream.next();
        //
        while (this.isIdentifier(this.stream.peek()) && !this.stream.eof()) {
            token.text += this.stream.next();
        }
        //
        if (Lexical.KeyWords.has(token.text)) {
            token.kind = Token_1.TokenKind.Identifier;
        }
        //console.log(token);
        return token;
    };
    Lexical.prototype.skipWhiteSpaces = function () {
        while (this.isWhiteSpaces(this.stream.peek()) && !this.stream.eof()) {
            //console.log("[Test] Ignore spaces...");
            this.stream.next();
        }
    };
    Lexical.prototype.isWhiteSpaces = function (ch) {
        return (ch == ' ') || (ch == '\t') || (ch == '\n');
    };
    Lexical.prototype.isLetter = function (ch) {
        return (ch > 'A' && ch < 'Z') || (ch > 'a' && ch < 'z');
    };
    Lexical.prototype.isDigit = function (ch) {
        return (ch > '0' && ch < '9');
    };
    Lexical.prototype.isIdentifier = function (ch) {
        return this.isLetter(ch) || this.isDigit(ch) || ch == '_';
    };
    Lexical.prototype.isSeperators = function (ch) {
        return ch == '(' || ch == ')' || ch == '{' || ch == '}' || ch == ',' || ch == ';';
    };
    Lexical.KeyWords = new Set(["function"]);
    return Lexical;
}());
exports.Lexical = Lexical;