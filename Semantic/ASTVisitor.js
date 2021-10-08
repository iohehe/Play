"use strict";
exports.__esModule = true;
exports.ASTVisitor = void 0;
var ASTVisitor = /** @class */ (function () {
    function ASTVisitor() {
    }
    //
    ASTVisitor.prototype.visit = function (node) {
        return node.accept(this);
    };
    ASTVisitor.prototype.visitProg = function (prog) {
        var ret_val;
        for (var _i = 0, _a = prog.stmts; _i < _a.length; _i++) {
            var x = _a[_i];
            x.dump("[!] visit.... ");
            ret_val = this.visit(x);
        }
        return ret_val;
    };
    ASTVisitor.prototype.visitBlock = function (block) {
        var ret_val;
        for (var _i = 0, _a = block.stmts; _i < _a.length; _i++) {
            var x = _a[_i];
            ret_val = this.visit(x);
        }
        return ret_val;
    };
    ASTVisitor.prototype.visitFunctionDecl = function (function_decl) {
        return this.visitBlock(function_decl.body);
    };
    ASTVisitor.prototype.visitVariableDecl = function (variable_decl) {
        if (variable_decl.init != null) //!TODO: 这一句的含义？
         {
            return this.visitVariableDecl(variable_decl);
        }
    };
    ASTVisitor.prototype.visitBinary = function (exp) {
        this.visit(exp.exp1);
        this.visit(exp.exp2);
    };
    ASTVisitor.prototype.visitExpressionStatement = function (stmt) {
        return this.visit(stmt.exp);
    };
    // 终结点返回值
    ASTVisitor.prototype.visitIntegerLiteral = function (exp) {
        return exp.value;
    };
    ASTVisitor.prototype.visitVariable = function (variable) {
        return undefined;
    };
    ASTVisitor.prototype.visitFunctionCall = function (function_call) {
        return undefined;
    };
    ASTVisitor.prototype.visitStringLiteral = function (exp) {
        return exp.value;
    };
    return ASTVisitor;
}());
exports.ASTVisitor = ASTVisitor;
