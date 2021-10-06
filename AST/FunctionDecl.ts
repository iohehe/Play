import { Decl } from "./Decl";
import { Block } from "./Block";
import { ASTVisitor } from "../Semantic/ASTVisitor";

// functionDecl ::= KeyWord Identifier (parameterList?) functionBody
export class FunctionDecl extends Decl {
    //name: string; 符号记录在父类中
    body: Block;

    public constructor(name:string, body: Block) {
        super(name);
        this.body = body;
    }

    public dump(prefix: string):void {
        console.log(prefix + "FunctionDecl: " + this.name);

        this.body.dump(prefix+"\t");
    }

    public accept(visitor:ASTVisitor):any {
        return visitor.visitFunctionDecl(this);
    }
}