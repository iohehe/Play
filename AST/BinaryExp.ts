import { ASTVisitor } from "../Semantic/ASTVisitor";
import { Expression } from "./Expression";

export class BinaryExp extends Expression {
    op: string;
    exp1: Expression;  // left expression
    exp2: Expression;  // right expression

    constructor (op: string, exp1: Expression, exp2: Expression) {
            super();
            this.op = op;
            this.exp1 = exp1;
            this.exp2 = exp2;
    }

    public dump(prefix: string):void {
        console.log(prefix + "Binary: "+ this.op);
        this.exp1.dump(prefix + "     ");
        this.exp2.dump(prefix + "     ");
    }

    public accept(visitor:ASTVisitor):any {
        return visitor.visitBinary(this);
    }
}