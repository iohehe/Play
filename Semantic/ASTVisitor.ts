import { ASTNode } from "../AST/ASTNode";
import { BinaryExp } from "../AST/BinaryExp";
import { Block } from "../AST/Block";
import { ExpressionStatement } from "../AST/ExpressionStatement";
import { FunctionCall } from "../AST/FunctionCall";
import { FunctionDecl } from "../AST/FunctionDecl";
import { VariableDecl } from "../AST/VariableDecl";
import { IntegerLiteral } from "../AST/IntegerLiteral";
import { StringLiteral } from "../AST/StringLiteral";
import { Prog } from "../AST/Prog";
import { Variable } from "../AST/Variable";



export abstract class ASTVisitor {
    //
    visit(node:ASTNode):any {
        return node.accept(this);
    }

    visitProg(prog:Prog):any {
        let ret_val:any;
        for (let x of prog.stmts)  // 这里会遍历prog中的每一条stmt
        {
            x.dump("[!] visit.... ");
            ret_val = this.visit(x);
        }
        return ret_val;
    }

    visitBlock(block: Block):any {
        let ret_val:any;
        for (let x of block.stmts)
        {
            ret_val = this.visit(x);
        }
        return ret_val;
    }

    visitFunctionDecl(function_decl: FunctionDecl):any {
        return this.visitBlock(function_decl.body);
    }

    visitVariableDecl(variable_decl: VariableDecl):any {
        if (variable_decl.init != null ) //!TODO: 这一句的含义？
        {
            return this.visitVariableDecl(variable_decl);
        }
    }

    visitBinary(exp: BinaryExp):any {
        this.visit(exp.exp1);
        this.visit(exp.exp2);
    }

    visitExpressionStatement(stmt: ExpressionStatement):any {
        return this.visit(stmt.exp);
    }



    // 终结点返回值
    visitIntegerLiteral(exp: IntegerLiteral):any {
        return exp.value;
    }

    visitStringLiteral(exp: StringLiteral):any {
        return exp.value;
    }

    visitVariable(variable:Variable):any {
        return undefined;
    }

    visitFunctionCall(function_call: FunctionCall):any {
        return undefined;
    }
}
