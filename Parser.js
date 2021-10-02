"use strict";
exports.__esModule = true;
exports.Parser = void 0;
var Token_1 = require("./Token");
var FunctionDecl_1 = require("./AST/FunctionDecl");
var FunctionBody_1 = require("./AST/FunctionBody");
var FunctionCall_1 = require("./AST/FunctionCall");
var IntegerLiteral_1 = require("./AST/IntegerLiteral");
var Prog_1 = require("./AST/Prog");
var BinaryExp_1 = require("./AST/BinaryExp");
var ExpressionStatement_1 = require("./AST/ExpressionStatement");
/**
 *  @version: 0.2
 *
 *  Parser
 * ~~~~~~~~~~~~~~~~~
 *  支持二元表达式解析
 *  prog := statementList? EOF.
 *  statementList := (functionDecl|expressionStatement)+.
 *  functionDecl := "function" Identifier "("")" functionBody.  //不支持传参数
 *  functionBody := "{" statementList? "}". //statementList 可选
 *  statement := functionDecl|expressionStatement.
 *  expressionStatement := expression ';'.
 *  expression := primary (binOP primary)*.    // 表达式又一个基本数据类型，或者多个基础数据类型加二元表达式组合而成
 *  primary := StringLiteral | DecimalLiteral | IntegerLiteral | functionCall | '(' expression ')';  //基础数据类型
 *  binOP := '+'|'-'|'*'|'/'|'='|'+='|'-='|'*='|'/='|'>'|'='|'<'|'>='|'=='|'<='|'!='|'&&'|'||'|....
 *  functionCall := Identifier '(' parameterList? ')'.
 *  parameterList := expression (',' expression)* .
 */
var Parser = /** @class */ (function () {
    function Parser(tokenizer) {
        /**
         *  操作符优先级
         */
        this.op_prec = new Map([
            ['+', 1],
            ['*', 2]
        ]);
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
        while (token.kind != Token_1.TokenKind.EOF && token.text != '}') {
            console.log("[start]...");
            console.log(this.tokenizer.peek());
            var stmt_1 = this.parsingStatement();
            if (stmt_1 != null) {
                stmts.push(stmt_1);
            }
            else {
                console.log("[!] No tokens\n");
                //process.exit(0);
                return null;
            }
            token = this.tokenizer.peek();
        }
        return new Prog_1.Prog(stmts);
    };
    /**
     * Parsing Statement
     * stmt :=  FunctionCall|FuntctionDecl|ExpressionStmt.
     * @returns
     */
    Parser.prototype.parsingStatement = function () {
        var token = this.tokenizer.peek();
        var stmt;
        // parsing FunctionDecl
        if (token.kind == Token_1.TokenKind.KeyWord && token.text == "function") // match the functionDecl KeyWord
         {
            console.log("[!] Begin to parse function Decl...");
            stmt = this.parseFunctionDecl();
            //stmt.dump("-------> function decl ------> ");
            if (stmt != null) {
                return stmt;
            }
        }
        // parsing Fucntion Call
        else if (token.kind == Token_1.TokenKind.Identifier) //这个else不要用if else 因为function后边跟的也是identifier
         {
            console.log("[!] Begin to parse function Call...");
            stmt = this.parseFunctionCall();
            //stmt.dump("-------> function call -------> ")
            if (stmt) {
                return stmt;
            }
        }
        else if (token.kind == Token_1.TokenKind.IntegerLiteral) {
            console.log("[!] Begin to parsing a binary operate...");
            return this.parseExpressionStmt();
        }
        else {
            console.log("[!!!!] Can not recoggnize a expression starting with: " + this.tokenizer.peek().text);
            return null;
        }
    };
    // expressionStmt := (expression)+;.
    Parser.prototype.parseExpressionStmt = function () {
        console.log("[!] Parsing Expression stmts...");
        var exp = this.parseExpression();
        if (exp != null) {
            var t = this.tokenizer.peek();
            if (t.text == ";") {
                console.log(t); //如果找到了；，就封装表达式语句
                this.tokenizer.next();
                return new ExpressionStatement_1.ExpressionStatement(exp);
            }
            else {
                console.log("[SYNTAX ERROR] 没有分号");
                process.exit(1);
            }
        }
    };
    // expression := binaryExp
    Parser.prototype.parseExpression = function () {
        return this.parseBinaryExp(0); //目前只有二元操作表达式
    };
    /**
     *  解析而源操作
     * ~~~~~~~~~~~~~~~
     *  采用了运算符优先级算法， 解析二元表达式
     * @param prec:  当前运算符的优先级
     * */
    Parser.prototype.parseBinaryExp = function (prec) {
        //console.log("[!] Begin to parse binary operate"); 
        var exp1 = this.parsePrimary(); //拿到左表达式
        if (exp1 != null) {
            var t = this.tokenizer.peek();
            var t_prec = this.getPrec(t.text); //分隔左右表达式的一定是操作符，看看这个操作符的优先级吧
            // 这里是操作符优先级算法的精髓，
            // 第一个条件是确定t是一个二元操作符
            // 第二个是如果当前操作符优先级高于上一个(栈中)的话, 就要形成一个右子树喂给栈中操作符
            // 如2+3*5, *号的优先级大，因此要先生成一颗3*5的右子树，作为一个整体喂给+号。
            while (t.kind == Token_1.TokenKind.Operator && t_prec > prec) {
                this.tokenizer.next(); // 这里把操作符推了
                // 拿右子树
                var exp2 = this.parseBinaryExp(t_prec); // 递归，一直到当前优先级小于或者等于（只有这样才能确定一颗左子树）
                console.log(exp2);
                if (exp2 != null) {
                    console.log("=============");
                    console.log("[+] create a binary exp....");
                    console.log("op: " + t.text);
                    exp1.dump("exp1: ---> ");
                    exp2.dump("exp2: ---> ");
                    console.log("=============");
                    var exp = new BinaryExp_1.BinaryExp(t.text, exp1, exp2); // 这里开始组装binaryExp
                    exp1 = exp; // 组装完毕后，赋给exp1返回
                    t = this.tokenizer.peek(); // 拿当前token更新优先级
                    t_prec = this.getPrec(t.text);
                }
                else {
                    console.log("[!!!]error");
                    process.exit(1);
                }
            }
            return exp1;
        }
        else {
            console.log("return null????");
            return null;
        }
    };
    /**
     *  Get a 基础表达式
     *  primary := IntegerLiteral|StringLiteral|DecimalLiteral
     *  @returns
     */
    Parser.prototype.parsePrimary = function () {
        var t = this.tokenizer.peek();
        console.log("parsing primary: " + t.text);
        // identifier
        if (t.kind == Token_1.TokenKind.Identifier) {
            this.tokenizer.next(); //推出改token    
            return null; //!TODO
        }
        // integer 
        else if (t.kind == Token_1.TokenKind.IntegerLiteral) {
            this.tokenizer.next();
            return new IntegerLiteral_1.IntegerLiteral(parseInt(t.text));
        }
        // TODO: decimal & string & ()
        else {
            console.log("木有");
            return null;
        }
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
    Parser.prototype.getPrec = function (op) {
        var ret = this.op_prec.get(op);
        if (typeof ret == 'undefined') {
            return -1;
        }
        else {
            return ret;
        }
    };
    return Parser;
}());
exports.Parser = Parser;
