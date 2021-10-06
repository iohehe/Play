import { ASTVisitor } from "../Semantic/ASTVisitor";
import {Block} from "./Block";
import {Statement} from "./Statement";

// Prog ::= Statement+
// Statement ::= FunctionDecl|FunctionCall
export class Prog extends Block {
    public dump(prefix:string):void {
        console.log(prefix+"Prog");
        this.stmts.forEach(x => x.dump(prefix + "\t"));
    }

    public accept(visitor: ASTVisitor):any{
        return visitor.visitProg(this);
    }
}