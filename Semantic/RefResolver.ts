import {ASTVisitor} from "./ASTVisitor";
import { SymKind, SymTable } from "./SymTable";
import {Variable} from "../AST/Variable";
import { VariableDecl } from "../AST/VariableDecl";
import { FunctionCall } from "../AST/FunctionCall";
import { FunctionDecl } from "../AST/FunctionDecl";

export class RefResolver extends ASTVisitor {
    sym_table:SymTable;
    
    constructor(sym_table:SymTable) {
        super();
        console.log("~~~~~~~~~~~~~~~~~~~~~~>>>");
        console.log(sym_table);
        this.sym_table = sym_table;
    }

    // 引用消解
    // 重写visitVariable
    visitVariable(variable: Variable):any {
        let sym = this.sym_table.getSymbol(variable.name); // 从符号表找当前变量标识 

        if (sym != null && sym.kind == SymKind.Variable)
        {
            console.log("[Boom] variable: "+variable.name+ " 解引用成功");
            variable.decl = sym.decl as VariableDecl;
        }
        else
        {
            console.log("[Error]: cannot find declaration of variable" + variable.name);
        }
    }


    visitFunctionCall(function_call: FunctionCall):any {
        let sym = this.sym_table.getSymbol(function_call.name);

        if (sym != null && sym.kind == SymKind.Function)
        {
            console.log("[Boom] function: "+function_call.name+ " 解引用成功");
            function_call.decl = sym.decl as FunctionDecl;
        }
    }
}
