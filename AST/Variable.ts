import { ASTVisitor } from "../Semantic/ASTVisitor";
import {Expression} from "./Expression";
import { VariableDecl } from "./VariableDecl";

/**
 *  变量引用
 */
export class Variable extends Expression {
    name: string;
    decl: VariableDecl|null=null;

    constructor(name: string) {
        super();
        this.name = name;
    }

    public dump(prefix: string): void {
        console.log(prefix + "Variable: " + this.name + (this.decl != null ?  ", resolved" : ", not resolved"));
    }

    public accept(visitor: ASTVisitor):any {
        return visitor.visitVariable(this);
    }
}