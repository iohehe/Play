import {Statement} from "./Statement";
import {FunctionBody} from "./FunctionBody";

// functionDecl ::= KeyWord Identifier (parameterList?) functionBody
export class FunctionDecl extends Statement {
    name: string;
    body: FunctionBody;

    public constructor(name:string, body: FunctionBody) {
        super();
        this.name = name;
        this.body = body;
    }

    public dump(prefix: string):void {
        console.log(prefix + "FunctionBody");

        this.body.dump(prefix+"\t");
    }
}