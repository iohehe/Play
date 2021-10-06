"use strict";
exports.__esModule = true;
var CharStream_1 = require("./CharStream");
var Lexical_1 = require("./Lexical");
var Parser_1 = require("./Parser");
var SymTable_1 = require("./Semantic/SymTable");
var Enter_1 = require("./Semantic/Enter");
function compileAndRun(program) {
    console.log("resource:");
    console.log(program);
    // lexical Analysis
    console.log("\n Lexical Analyze:\n");
    //let tokenizer =new Lexical(new CharStream(program));
    /*
    let scanner = new Lexical(new CharStream(program));
    // scanning test
    let t = scanner.peek();
    while(t.kind!=TokenKind.EOF && t.text!="")
    {
        console.log(scanner.next().text);
        console.log(scanner.peek().kind);
        t = scanner.peek();
    }
    */
    // Syntax Analysis
    var tokenizer = new Lexical_1.Lexical(new CharStream_1.CharStream(program));
    var prog = new Parser_1.Parser(tokenizer).parseProg();
    prog.dump("~~~~.>:");
    // Semantic Analysis
    //建立符号表
    var sym_table = new SymTable_1.SymTable();
    // console.log(sym_table);
    new Enter_1.Enter(sym_table).visit(prog);
    new RefResolver_1.RefResolver(sym_table).visit(prog);
    prog.dump("-------...>>4>>>> ");
    //prog.dump("---------..>:");
}
// 读文件 
var process = require("process");
var RefResolver_1 = require("./Semantic/RefResolver");
if (process.argv.length < 3) {
    console.log('Usage: node' + process.argv[1] + "File name");
    process.exit(1);
}
var fs = require('fs');
var file_name = process.argv[2];
fs.readFile(file_name, 'utf-8', function (err, data) {
    if (err)
        throw err;
    compileAndRun(data);
});
