
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
}

export class Block extends Statement {
    stmts: Statement[];
    constructor(start_pos:Position, end_pos:Position, stmts:Statement[], isErrorNode:boolean=false) {
        super(start_pos, end_pos, isErrorNode);
        this.stmts = stmts;
    }
}

export class Prog extends Block {
    constructor(start_pos:Position, end_pos:Position, stmts:Statement[]) {
        super(start_pos, end_pos, stmts, false);
        this.stmts = stmts;
    }
}

export class FunctionDecl extends Decl {
    //callSignature:CallSignature;
    body:Block;
    isErrorNode
    constructor(start_pos:Position, name:string, body:Block, isErrorNode:boolean=false) {
        super(start_pos, body.end_pos, name, isErrorNode);
    }
}

export class VariablDecl extends Decl {
    init:Expression|null
    constructor(start_pos:Position, end_pos:Position, name:string, init:Expression|null, isErrorNode:boolean=false) {
        super(start_pos, end_pos, name, isErrorNode);
    }
}

export class CallSignature extends ASTNode {
    constructor(start_pos:Position, end_post:Position) {
        super(start_pos, end_post, true);
    }
}

export class ErrorStmt extends Statement {
    constructor(start_pos:Position, end_pos:Position) {
        super(start_pos, end_pos, true);
        this.isErrorNode = true;
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
}

export class StringLiteral extends Expression {
    value:string;
    constructor(pos:Position, value:string, isErrorNode:boolean = false) {
        super(pos, pos, isErrorNode);
        this.value = value;
        this.constValue = value;
    }
}