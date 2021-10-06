
import { ASTVisitor } from "../Semantic/ASTVisitor";
import {Expression} from "./Expression";

export class IntegerLiteral extends Expression {
    value: number;
    constructor(value:number) {
        super();
        this.value = value;
    }

    public dump(prefix: string):void {
        console.log(prefix + this.value);
    }

    public accept(visitor: ASTVisitor):any {
        return visitor.visitIntegerLiteral(this);
    }
}