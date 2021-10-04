import {Decl} from "./DEcl";
import {FunctionBody} from "./FunctionBody";

// functionDecl ::= KeyWord Identifier (parameterList?) functionBody
export class FunctionDecl extends Decl {
    //name: string; 符号记录在父类中
    body: FunctionBody;

    public constructor(name:string, body: FunctionBody) {
        super(name);
        this.body = body;
    }

    public dump(prefix: string):void {
        console.log(prefix + "FunctionDecl" + this.name);

        this.body.dump(prefix+"\t");
    }
}