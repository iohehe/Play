import { ASTVisitor } from "./AStVisitor";
import { SymKind, SymTable } from "./SymTable";
import {FunctionDecl } from "../AST/FunctionDecl";
import { VariableDecl } from "../AST/VariableDecl";

export class Enter extends ASTVisitor {
    sym_table: SymTable;

    constructor(sym_table: SymTable) {
        super();
        this.sym_table = sym_table;
    }

    /**
     * 将函数声明加入符号表
     *  @param functionDecl
     */
    visitFunctionDecl(function_decl: FunctionDecl):any {
        console.log("sym_table to register function decl");

        if (this.sym_table.hasSymbol(function_decl.name))
        {
            console.log("Dumplicate symbol: " + function_decl.name);
        }

        this.sym_table.enter(function_decl.name, function_decl, SymKind.Function); //插入function decl
    }

    /**
     *  变量声明
     *   @param variableDecl
     */
    visitVariableDecl(variable_decl: VariableDecl):any {
        console.log("sym_table to register variable decl");

        if (this.sym_table.hasSymbol(variable_decl.name)) 
        {
            console.log("Dumplicate symbol:   " + variable_decl.name); //重复声明
        }
        console.log("insert into sym_table:" + variable_decl.name);
        this.sym_table.enter(variable_decl.name, variable_decl, SymKind.Variable);
        console.log(this.sym_table);
    }

}


