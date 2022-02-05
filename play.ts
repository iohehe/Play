import {CharStream, Scanner, TokenKind} from './scanner';
import {Parser} from './parser';
import {Prog, AstDumper, ASTVisitor, Block, FunctionDecl, FunctionCall} from './ast';
import {SemanticAnalyer} from './semantic';

class Intepretor extends ASTVisitor {
    // 调用栈
    callStack: StackFrame[] = [];
    // 当前栈帧
    currentFrame: StackFrame;

    constructor() {
        super();
        this.currentFrame = new StackFrame();
        this.callStack.push(this.currentFrame);
    }

    /**
     * 遍历一个块
     * @param block 
     * @returns 
     */
    visitBlock(block: Block):any {
        let ret_val:any;
        for (let x of block.stmts)
        {
            ret_val = this.visit(x);
        }
        return ret_val;
    }

    visitFunctionDecl(functionDecl: FunctionDecl):any {
    }

    /**
     * 运行函数调用
     * 原理： 根据函数定义，执行其函数体
     * @param functionCall
     */
    visitFunctionCall(functionCall:FunctionCall):any {
        if (functionCall.name == "println")
        {
        }

        if (functionCall.sym != null)
        {
        }
    }
}

class StackFrame {
    values:Map<Symbol, any> = new Map();
    ret_val = undefined;
}

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
    // 程序运行
    let ret_val = new Intepretor().visit(prog);

    console.log("//////////////");
    console.log(ret_val);
    console.log("/////////////");
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
