import {ASTNode} from "./ASTNode";
import {Expression} from "./Expression";
import { FunctionDecl } from "./FunctionDecl";
import { ASTVisitor } from "../Semantic/ASTVisitor";

// FunctionCall ::= Identitifer "(" parameterList? ")"
export class FunctionCall extends ASTNode {
    name: string;    
    parameters: Expression[];
    decl: FunctionDecl|null=null;

    constructor(name:string, parameters: Expression[]) {
        super();
        this.name = name;
        this.parameters = parameters;
    }

    public dump(prefix:string):void {
        console.log(prefix + "FunctionCall " + this.name + (this.decl != null ? ", resolved" : ", not resolved"));
        this.parameters.forEach(x => console.log(prefix + "\t" + "Parameter: " + x));
    }

    public accept(visitor: ASTVisitor):any {
        return visitor.visitFunctionCall(this);
    }

}