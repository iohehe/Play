import{ASTNode} from "./ASTNode";
import {Statement} from "./Statement";
import { ASTVisitor } from "../Semantic/ASTVisitor";

// statement list
export class Block extends ASTNode {
    stmts: Statement[];

    constructor(stmts: Statement[]) {
        super();
        this.stmts = stmts;
    }

    public dump(prefix: string):void {
        console.log(prefix+"Block");
        this.stmts.forEach( x => x.dump(prefix + "  "));
    }

    public accept(visitor:ASTVisitor):any{
        return visitor.visitBlock(this);
    }
}

