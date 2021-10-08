import { Expression } from "./Expression";
import {ASTVisitor} from "../Semantic/ASTVisitor";

export class StringLiteral extends Expression {
    value:string;
    constructor(value: string) {
        super();
        this.value = value;
    }

    public dump(prefix: string): void {
        console.log(prefix + this.value);
    }

    public accept(visitor:ASTVisitor):any {
        visitor.visitStringLiteral(this);
    }
}