import {CharStream} from "./CharStream";
import {Lexical} from "./Lexical";
import {Parser} from "./Parser";
import {SymTable} from "./Semantic/SymTable";
import {Enter} from "./Semantic/Enter";


function compileAndRun(program:string) {
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
    let tokenizer = new Lexical(new CharStream(program));
    let prog = new Parser(tokenizer).parseProg();
    prog.dump("~~~~.>:");

    // Semantic Analysis
    //建立符号表
    let sym_table = new SymTable();
    // console.log(sym_table);
    new Enter(sym_table).visit(prog);
    new RefResolver(sym_table).visit(prog);
    prog.dump("-------...>>4>>>> ");
    //prog.dump("---------..>:");
}


// 读文件 
import * as process from 'process'
import { RefResolver } from "./Semantic/RefResolver";

if (process.argv.length<3)
{
    console.log('Usage: node'+ process.argv[1] + "File name");
    process.exit(1);
}

let fs = require('fs');
let file_name = process.argv[2];
fs.readFile(file_name, 'utf-8',  
function(err:any, data:string) {
    if (err) throw err;
    compileAndRun(data);
});