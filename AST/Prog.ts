import {ASTNode} from "./ASTNode";
import {Statement} from "./Statement";

// Prog ::= Statement+
// Statement ::= FunctionDecl|FunctionCall
export class Prog extends ASTNode {
    stmts: Statement[] = [];
    constructor(stmts: Statement[]) {
        super();
        this.stmts = stmts;
    }

    public dump(prefix:string):void {
        console.log(prefix+"Prog");
        this.stmts.forEach(x => x.dump(prefix + "\t"));
    }

}