import {Decl} from "./Decl"
import {Expression} from "./Expression"

/**
 *  变量声明节点
 *  记录变量名，类型和初始值
 */
export class variableDecl extends Decl {
    var_type: string;
    init: Expression|null;
    constructor(name, var_type:string, init:Expression|null) {
        super(name);
        this.var_type = var_type;
        this.init = init;
    }

    public dump(prefix:string):void {
        console.log(prefix+"VariableDecl " + this.name + ", type: " + this.var_type);
        if (this.init == null)
        {
            console.log(prefix + "no initialization.");
        }
        else
        {
            this.init.dump(prefix + "   ");
        }
    }
}