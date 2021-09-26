import { Statement } from "./Statement"
import { FunctionDecl } from "./FunctionDecl";

// FunctionCall ::= Identitifer "(" parameterList? ")"
export class FunctionCall extends Statement {
    name: string;    
    parameters: string[];
    definition: FunctionDecl|null=null;

    constructor(name:string, parameters:string[]) {
        super();
        this.name = name;
        this.parameters = parameters;
    }

    public dump(prefix:string):void {
        console.log(prefix + "FunctionCall " + this.name + (this.definition != null ? ", resolved" : ", not resolved"));
        this.parameters.forEach(x => console.log(prefix + "\t" + "Parameter: " + x));
    }

}