"use strict";
exports.__esModule = true;
var CharStream_1 = require("./CharStream");
var Lexical_1 = require("./Lexical");
var Parser_1 = require("./Parser");
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
    //new RefResolver().visitProg(prog);
    //prog.dump("---------..>:");
}
// 读文件 
var process = require("process");
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
