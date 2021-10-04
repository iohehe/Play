"use strict";
exports.__esModule = true;
exports.Lexical = void 0;
var Token_1 = require("./Token");
var Lexical = /** @class */ (function () {
    function Lexical(stream) {
        this.tokens = new Array();
        this.stream = stream;
    }
    Lexical.prototype.peek = function () {
        var t = this.tokens[0];
        if (typeof t == 'undefined') {
            t = this.getAToken();
            this.tokens.push(t);
        }
        return t;
    };
    Lexical.prototype.peek2 = function () {
        var t = this.tokens[1];
        if (typeof t == 'undefined') {
            this.tokens.push(this.getAToken());
            t = this.tokens[1];
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
        //console.log("\n[+] GET a token\n");
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
            //4. IntegerLiteral
            else if (ch >= '0' && ch <= '9') {
                return this.parseInteger();
            }
            //5. Binary Operator:  +
            else if (ch == "+") {
                //console.log("find a binary operator +");
                return this.parseBinOP_Plus();
            }
            //6. Binary Operator: *
            else if (ch == "*") {
                return this.parseBinOP_Multi();
            }
            //7. assignment: =
            //TODO: ==, ===, =>. 
            else if (ch == "=") {
                this.stream.next();
                return { kind: Token_1.TokenKind.Operator, text: '=' };
            }
            else {
                console.log("[!!!!] unknow pattern meeting: " + ch);
                this.stream.next(); // pass the unknow character in the stream
                //return this.getAToken(); // 下一轮推token
                process.exit(1);
            }
        }
    };
    // ===== scanning binary operators
    //
    //*
    Lexical.prototype.parseBinOP_Multi = function () {
        var token = { kind: Token_1.TokenKind.Operator, text: "" };
        this.stream.next();
        var ch1 = this.stream.peek();
        if (ch1 == "=") // *=
         {
            token.text = "*=";
            this.stream.next();
        }
        //妹有**
        else {
            token.text = "*";
        }
        return token;
    };
    //+
    Lexical.prototype.parseBinOP_Plus = function () {
        var token = { kind: Token_1.TokenKind.Operator, text: "" };
        // plus: + , +=, ++
        this.stream.next();
        var ch1 = this.stream.peek();
        if (ch1 == "+") //++
         {
            token.text = "++";
            this.stream.next(); // push it
        }
        else if (ch1 == "=") //+=
         {
            token.text = "+=";
            this.stream.next(); // push it 
        }
        else // + only
         {
            token.text = "+";
        }
        // in here make sure the stream's current char is not belong to the plus operator including(+, +=, ++)
        return token;
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
        // 是否为关键字
        if (Lexical.KeyWords.has(token.text)) {
            token.kind = Token_1.TokenKind.KeyWord;
        }
        //console.log(token);
        return token;
    };
    Lexical.prototype.parseInteger = function () {
        var token = { kind: Token_1.TokenKind.IntegerLiteral, text: "" };
        token.text += this.stream.next();
        while (this.stream.peek() >= "0" && this.stream.peek() <= "9") // TODO: 考虑靠头为0的情况
         {
            token.text += this.stream.next();
        }
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
        return (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z');
    };
    Lexical.prototype.isDigit = function (ch) {
        return (ch >= '0' && ch <= '9');
    };
    // 字母数字下划线
    Lexical.prototype.isIdentifier = function (ch) {
        return this.isLetter(ch) || this.isDigit(ch) || ch == '_';
    };
    Lexical.prototype.isSeperators = function (ch) {
        return ch == '(' || ch == ')' || ch == '{' || ch == '}' || ch == ',' || ch == ';' || ch == ":";
    };
    Lexical.KeyWords = new Set(["function", "let"]);
    return Lexical;
}());
exports.Lexical = Lexical;
