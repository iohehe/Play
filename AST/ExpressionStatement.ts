import{Expression} from "./Expression";
import {Statement} from "./Statement";


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
}