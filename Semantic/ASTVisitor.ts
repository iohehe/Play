import{Prog} from "../AST/Prog";
import{FunctionDecl} from "../AST/FunctionDecl";
import{FunctionBody} from "../AST/FunctionBody";
import{FunctionCall} from "../AST/FunctionCall";

export abstract class ASTVisitor {

    visitProg(prog: Prog): any {
        let ret_val:any;
        
        for (let x of prog.stmts) // 遍历prog中的stmts
        {
            if (typeof (x as FunctionDecl))  // 有body, visitbody
            {
                ret_val = this.visitFunctionDecl(x  as FunctionDecl);
            }
            else //现版本，无body就是call
            {
                ret_val = this.visitFunctionCall(x as FunctionCall);
            }
        }
        return ret_val;

    }

    visitFunctionDecl(function_decl:FunctionDecl):any {
        return this.visitFunctionBody(function_decl.body);
    }

    visitFunctionBody(function_body:FunctionBody):any {
        let ret_val:any;

        for (let x of function_body.stmts)  //遍历function body中的每一条stmts
        {
            ret_val = this.visitFunctionCall(x);  // 只有call
        }
        return ret_val;
    }


    visitFunctionCall(function_call: FunctionCall):any {
        return undefined;
    }

}


