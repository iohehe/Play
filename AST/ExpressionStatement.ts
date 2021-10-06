import{Expression} from "./Expression";
import {Statement} from "./Statement";
import {ASTVisitor} from "../Semantic/ASTVisitor";


export class ExpressionStatement extends Statement {
    exp: Expression;

    constructor(exp:Expression) {
        super();
        this.exp = exp;
    }

    public dump(prefix:string):void {
        console.log(prefix + "ExpressionStatement");
        this.exp.dump(prefix+ "     ");
    }

    public accept(visitor:ASTVisitor):any {
        return visitor.visitExpressionStatement(this);
    }
}

