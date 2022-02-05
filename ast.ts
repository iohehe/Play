import {Position, Op} from './scanner'

export abstract class ASTNode {
    start_pos:Position;
    end_pos:Position;
    isErrorNode:boolean;

    constructor(start_pos:Position,end_pos:Position, isErrorNode:boolean) {
        this.start_pos = start_pos;
        this.end_pos = end_pos;
        this.isErrorNode = isErrorNode;
    }

    public abstract accept(visitor:ASTVisitor, additional:any):any;
}

export abstract class Statement extends ASTNode {} 

export abstract class Expression extends ASTNode {
    isLeftValue:boolean = false;
    constValue:any = undefined;
}

export abstract class Decl extends ASTNode {
    name:string;
    constructor(start_pos:Position, end_pos: Position, name:string, isErrorNode:boolean)
    {
        super(start_pos, end_pos, isErrorNode);
        this.name = name;
    }
}

export class Unary extends Expression {
    op: Op;
    exp:Expression;
    isPrefix:boolean;
    constructor(start_pos: Position, end_pos:Position, op:Op, exp:Expression, isPrefix:boolean, isErrorNode:boolean=false) {
        super(start_pos, end_pos, isErrorNode);
        this.op = op;
        this.exp = exp;
        this.isPrefix = isPrefix;
    }

    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitUnary(this, additional);
    }
}

export class Binary extends Expression {
    op: Op;
    exp1: Expression;
    exp2: Expression;
    constructor(op:Op, exp1:Expression, exp2:Expression, isErrorNode:boolean=false) {
        super(exp1.start_pos, exp2.end_pos, isErrorNode);
        this.op = op;
        this.exp1 = exp1;
        this.exp2 = exp2;
    }

    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitBinary(this, additional);
    }
}

export class Block extends Statement {
    stmts: Statement[];
    constructor(start_pos:Position, end_pos:Position, stmts:Statement[], isErrorNode:boolean=false) {
        super(start_pos, end_pos, isErrorNode);
        this.stmts = stmts;
    }

    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitBlock(this, additional);
    }
}

export class Prog extends Block {
    constructor(start_pos:Position, end_pos:Position, stmts:Statement[]) {
        super(start_pos, end_pos, stmts, false);
        this.stmts = stmts;
    }

    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitProg(this, additional);
    }
}

export class FunctionDecl extends Decl {
    //callSignature:CallSignature;
    body:Block;
    constructor(start_pos:Position, name:string, body:Block, isErrorNode:boolean=false) {
        super(start_pos, body.end_pos, name, isErrorNode);
        this.body = body;
    }

    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitFunctionDecl(this, additional);
    }
}

export class VariableDecl extends Decl {
    init:Expression|null
    constructor(start_pos:Position, end_pos:Position, name:string, init:Expression|null, isErrorNode:boolean=false) {
        super(start_pos, end_pos, name, isErrorNode);
    }
    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitVariableDecl(this, additional);
    }
}

export class CallSignature extends ASTNode {
    constructor(start_pos:Position, end_post:Position) {
        super(start_pos, end_post, true);
    }

    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitCallSignature(this, additional);
    }
}

export class ErrorStmt extends Statement {
    constructor(start_pos:Position, end_pos:Position) {
        super(start_pos, end_pos, true);
        this.isErrorNode = true;
    }

    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitErrorStmt(this, additional);
    }
}

export class ExpressionStatement extends Statement {
    exp:Expression;
    // 表达式语句只有end position
    constructor(end_pos: Position, exp: Expression, isErrorNode: boolean=false)
    {
        super(exp.start_pos, end_pos, isErrorNode);
        this.exp = exp;
    }
    
    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitExpressionStatement(this, additional);
    }
}

export class FunctionCall extends Expression {
    name: string;
    arguments: Expression[];
    constructor(start_pos: Position, end_pos: Position, name:string, paramValues:Expression[], isErrorNode:boolean=false)
    {
        super(start_pos,end_pos, isErrorNode );
        this.name = name;
        this.arguments = paramValues;
    }

    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitFunctionCall(this, additional);
    }
}

export class StringLiteral extends Expression {
    value:string;
    constructor(pos:Position, value:string, isErrorNode:boolean = false) {
        super(pos, pos, isErrorNode);
        this.value = value;
        this.constValue = value;
    }

    public accept(visitor:ASTVisitor, additional:any):any {
        return visitor.visitStringLiteral(this, additional);
    }
}

export abstract class ASTVisitor {
    //进入相应具体的类的
    visit(node:ASTNode, additional:any=undefined):any {
        return node.accept(this, additional);
    }

    visitProg(prog:Prog, additional:any=undefined):any {
        return this.visitBlock(prog, additional);
    }

    visitBlock(block:Block, additional:any=undefined):any {
        let ret_val:any;
        for (let x of block.stmts)
        {
            ret_val = this.visit(x, additional);
        }
        return ret_val;
    }

    visitFunctionDecl(functionDecl:FunctionDecl, additional: any=undefined):any {
        console.log("functiondecl");
    }

    visitExpressionStatement(stmt:ExpressionStatement, additional:any=undefined):any {
        console.log("expression state");
        return this.visit(stmt.exp, additional);
    }

    visitBinary(exp:Binary, prefix:any):any{
        console.log(prefix+"Binary:"+Op[exp.op] + (exp.isErrorNode? " **E** " : ""));
        this.visit(exp.exp1, prefix+"    ");
        this.visit(exp.exp2, prefix+"    ");
    }

    visitUnary(exp:Unary, prefix:any):any{
        console.log(prefix + (exp.isPrefix ? "Prefix ": "PostFix ") +"Unary:"+Op[exp.op]+ (exp.isErrorNode? " **E** " : ""));
        this.visit(exp.exp, prefix+"    ");
    }

    visitStringLiteral(exp:StringLiteral, prefix:any):any{
        console.log(prefix+exp.value+ (exp.isErrorNode? " **E** " : ""));
    }

    visitFunctionCall(functionCall:FunctionCall, prefix:any):any{
        console.log(prefix+"FunctionCall "+ (functionCall.isErrorNode? " **E** " : "")+functionCall.name);
        for(let param of functionCall.arguments){
            this.visit(param, prefix+"    ");
        }
    }

    visitCallSignature(callSinature:CallSignature, additional:any=undefined):any{
    }

    visitVariableDecl(variableDecl:VariableDecl, prefix:any):any{
        console.log(prefix+"VariableDecl "+variableDecl.name + (variableDecl.isErrorNode? " **E** " : ""));
        if (variableDecl.init == null){
            console.log(prefix+"no initialization.");
        }
        else{
            this.visit(variableDecl.init, prefix+"    ");
        }
    }


    visitErrorStmt(errorStmt:ErrorStmt, prefix:any):any{
        console.log(prefix+"Error Statement **E**");
    }
}

export class AstDumper extends ASTVisitor{
    visitProg(prog:Prog, prefix:any):any{
        console.log(prefix+"Prog"+ (prog.isErrorNode? " **E** " : ""));
        for(let x of prog.stmts){
            this.visit(x, prefix+"    ");
        }
    }

    visitVariableDecl(variableDecl:VariableDecl, prefix:any):any{
        console.log(prefix+"VariableDecl "+variableDecl.name  + (variableDecl.isErrorNode? " **E** " : ""));

        if (variableDecl.init == null){
            console.log(prefix+"no initialization.");
        }
        else{
            this.visit(variableDecl.init, prefix+"    ");
        }
    }

    visitFunctionDecl(functionDecl:FunctionDecl, prefix:any):any{
        console.log(prefix+"FunctionDecl "+ functionDecl.name + (functionDecl.isErrorNode? " **E** " : ""));
        //this.visit(functionDecl.callSignature, prefix+"    ");
        this.visit(functionDecl.body, prefix+"    ");
    }

    visitBlock(block:Block, prefix:any):any{
        if(block.isErrorNode){
            console.log(prefix + "Block" + (block.isErrorNode? " **E** " : ""))
        }
        for(let x of block.stmts){
            this.visit(x, prefix+"    ");
        }
    }

    visitExpressionStatement(stmt: ExpressionStatement, prefix:any):any{
        console.log(prefix+"ExpressionStatement" + (stmt.isErrorNode? " **E** " : ""));
        return this.visit(stmt.exp, prefix+"    ");
    }

    visitBinary(exp:Binary, prefix:any):any{
        console.log(prefix+"Binary:"+Op[exp.op]+ (exp.isErrorNode? " **E** " : ""));
        this.visit(exp.exp1, prefix+"    ");
        this.visit(exp.exp2, prefix+"    ");
    }

    visitUnary(exp:Unary, prefix:any):any{
        console.log(prefix + (exp.isPrefix ? "Prefix ": "PostFix ") +"Unary:"+Op[exp.op]+ (exp.isErrorNode? " **E** " : ""));
        this.visit(exp.exp, prefix+"    ");
    }

    visitFunctionCall(functionCall:FunctionCall, prefix:any):any{
        console.log(prefix+"FunctionCall " + (functionCall.isErrorNode? " **E** " : "")+functionCall.name);
        for(let param of functionCall.arguments){
            this.visit(param, prefix+"    ");
        }
    }

    visitErrorStmt(errorStmt:ErrorStmt, prefix:any):any{
        console.log(prefix+"Error Statement **E**");
    }

}