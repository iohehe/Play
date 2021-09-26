"use strict";
exports.__esModule = true;
exports.Parser = void 0;
var Token_1 = require("./Token");
var FunctionDecl_1 = require("./AST/FunctionDecl");
var FunctionBody_1 = require("./AST/FunctionBody");
var FunctionCall_1 = require("./AST/FunctionCall");
var Prog_1 = require("./AST/Prog");
var Parser = /** @class */ (function () {
    function Parser(tokenizer) {
        this.tokenizer = tokenizer;
    }
    /**
     *  Parsing Prog
     *  prog :: = (functionDecl|functionCall)*.
     */
    Parser.prototype.parseProg = function () {
        console.log("\t Parsing ...\n");
        var stmts = [];
        var stmt = null;
        var token = this.tokenizer.peek();
        while (token.kind != Token_1.TokenKind.EOF) {
            console.log(this.tokenizer.peek());
            if (token.kind == Token_1.TokenKind.KeyWord && token.text == "function") // match the functionDecl KeyWord
             {
                console.log("[!] Begin to parse function Decl...");
                stmt = this.parseFunctionDecl();
                //stmt.dump("-------> function decl ------> ");
                if (stmt != null) {
                    stmts.push(stmt);
                }
            }
            else if (token.kind == Token_1.TokenKind.Identifier) //这个else不要用if else 因为function后边跟的也是identifier
             {
                // parsing function call
                console.log("[!] Begin to parse function Call...");
                stmt = this.parseFunctionCall();
                //stmt.dump("-------> function call -------> ")
                if (stmt) {
                    stmts.push(stmt);
                }
            }
            token = this.tokenizer.peek();
        }
        return new Prog_1.Prog(stmts);
    };
    /**
     *  Parsing FunctionCall
     *  functionCall ::=  Identifier "(" parameterList? ")".
     *  paramenterList ::= StringLiteral (',' StringLiteral)*.
     */
    Parser.prototype.parseFunctionCall = function () {
        var params = [];
        var t = this.tokenizer.next();
        // 发现call
        if (t.kind == Token_1.TokenKind.Identifier) {
            var t1 = this.tokenizer.next();
            if (t1.text == "(") {
                // 解析parameter list
                var t2 = this.tokenizer.next();
                if (t2.kind == Token_1.TokenKind.StringLiteral) {
                    params.push(t2.text);
                    t2 = this.tokenizer.next();
                }
                if (t2.text == ")") {
                    this.tokenizer.next(); // 过掉 ;
                    return new FunctionCall_1.FunctionCall(t.text, params);
                }
            }
        }
    };
    /**
     *  Parsing FunctionDecl
     *  functionDecl ::= KeyWord Identifier "(" parameterList? ")" functionBody.
     */
    Parser.prototype.parseFunctionDecl = function () {
        this.tokenizer.next(); // eat key word: function
        var t = this.tokenizer.next(); // function name
        var function_decl;
        console.log("[+] fucntion name: " + t.text);
        var t1 = this.tokenizer.next();
        console.log(t1); //"("
        if (t1.text == "(") // match
         {
            // 当前无参数，跳过解析parameterList
            var t2 = this.tokenizer.next();
            if (t2.text == ")") {
                // 递归下降，开始解析FunctionBody
                var function_body = this.parseFunctionBody();
                if (function_body != null) {
                    return new FunctionDecl_1.FunctionDecl(t.text, function_body);
                }
            }
        }
    };
    /**
     *  Parsing FunctionBody
     *  functionBody ::= "{" functionCall* "}".
     */
    Parser.prototype.parseFunctionBody = function () {
        console.log("[!] Begin to parse function body...\n");
        var t1 = this.tokenizer.next();
        var stmts = [];
        if (t1.text == "{") {
            // 开始递归下降解析body内的stmts(目前只有call)
            console.log("[!] Begin to parse function call...\n");
            var function_call = this.parseFunctionCall();
            if (function_call != null) {
                stmts.push(function_call);
            }
        }
        this.tokenizer.next(); // 吃掉 }
        return new FunctionBody_1.FunctionBody(stmts);
    };
    return Parser;
}());
exports.Parser = Parser;
