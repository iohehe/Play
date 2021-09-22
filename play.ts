import {CharStream} from "./CharStream";
import {Lexical} from "./Lexical";

function compileAndRun(program:string) {
    console.log("resource:");
    console.log(program);

    // lexical Analysis
    console.log("\n Lexical Analyze:\n");
    let tokenizer =new Lexical(new CharStream(program)).getAToken();
}



// 读文件 
import * as process from 'process'

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