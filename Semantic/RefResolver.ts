import { FunctionCall } from "../AST/FunctionCall";
import { FunctionDecl } from "../AST/FunctionDecl";
import { FunctionBody } from "../AST/FunctionBody";

import {Prog} from "../AST/Prog";
import {ASTVisitor} from "./ASTVisitor";

export class RefResolver extends ASTVisitor {
    prog: Prog|null = null;

    visitProg(prog:Prog):void {
        console.log("Begin to dereference...");

        this.prog = prog;
        for (let x of prog.stmts) 
        {
            let function_call = x as FunctionCall;
            if (typeof function_call.parameters === 'object')
            {
                this.resolveFunctionCall(prog, function_call);
            }
            else
            {
                this.visitFunctionDecl(x as FunctionDecl);
            }

        }

    }

    visitFunctionBody(function_body: FunctionBody): any {
        if (this.prog != null)
        {
            for (let x of function_body.stmts) 
            {
                return this.resolveFunctionCall(this.prog, x);
            }
        }
    }

    private resolveFunctionCall(prog:Prog, function_call:FunctionCall) {
        let function_decl = this.findFunctionDecl(prog, function_call.name);
        if (function_decl != null)
        {
            function_call.definition = function_decl;
        }
        else
        {
            if (function_call.name != "println") //非系统函数， 又解不了引用的
            {
                console.log("NameError: function "+function_call.name+" not found");
                process.exit(0);
            }
        }
    }


    // find function decl : 由resolve call时调用,在整个prog中找decl
    private findFunctionDecl(prog:Prog, name:string):FunctionDecl|null {
        for (let x of prog?.stmts) // 搜索prog中所有的stmt
        {
            let function_decl = x as FunctionDecl;  //找到属于functino decl的
            if (typeof function_decl.body == 'object' && function_decl.name == name) //有函数体，且名称与callname相同的fcuntiondecl
            {
                return function_decl;
            }
        }
        return null; //没有找到对应的函数体
    } 

}