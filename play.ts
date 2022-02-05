import {CharStream, Scanner, TokenKind} from './scanner';
import {Parser} from './parser';
import {Prog, AstDumper} from './ast';
import {SemanticAnalyer} from './semantic';

function compileAndRun(file_name: string, program: string) {
    // 源代码 
    console.log("源代码");
    console.log(program);
    // 词法分析
    console.log("\n词法分析结果");
    let char_stream:CharStream = new CharStream(program);
    let scanner = new Scanner(char_stream);
    // 语法分析(语法分析也就是构造语法树的过程， 如果根据grammar生成不了语法树就证明sytnax error）
    let parser = new Parser(scanner);
    let prog:Prog = parser.parseProg(); //开始出现AST节点中的类型了， 同时语法检查开始了。
    console.log("~~~~~~~~~~~~~~~~~~~~\n");
    console.log(prog);
    console.log("~~~~~~~~~~~~~~~~~~~~\n");
    // 语义分析
    let semantic_analyer = new SemanticAnalyer();
    semantic_analyer.execute(prog);
    console.log("\n符号表");
    let ast_dumper = new AstDumper();
    ast_dumper.visit(prog, "");
}

// 读取目标源码文件
let file_name:string = "demo";
let fs = require('fs');

fs.readFile(file_name, 'utf8',
    function(err:any, data:string) {
        if (err) throw err;
        compileAndRun(file_name, data);
    }
)
