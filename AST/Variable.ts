import {Expression} from "./Expression";
import { variableDecl } from "./VariableDecl";

/**
 *  变量引用
 */
export class Variable extends Expression {
    name: string;
    decl: variableDecl|null=null;

    constructor(name: string) {
        super();
        this.name = name;
    }

    public dump(prefix: string): void {
        console.log(prefix + "Variable: " + this.name + (this.decl != null ?  ", resolved" : ", not resolved"));
    }
}