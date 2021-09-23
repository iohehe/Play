import {ASTNode} from "./ASTNode";
import {FunctionCall} from "./FunctionCall";

// FunctionBody ::= "{" (functinoCall+) "}"
export class FunctionBody extends ASTNode {
    stmts: FunctionCall[];

    constructor(stmts: FunctionCall[]) {
        super();
        this.stmts = stmts;
    }

    public dump(prefix:string):void {
            console.log(prefix + "FunctionBody");
            this.stmts.forEach(x => x.dump(prefix+"\t"));
    }
}