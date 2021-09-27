"use strict";
exports.__esModule = true;
exports.ASTVisitor = void 0;
var ASTVisitor = /** @class */ (function () {
    function ASTVisitor() {
    }
    ASTVisitor.prototype.visitProg = function (prog) {
        var ret_val;
        for (var _i = 0, _a = prog.stmts; _i < _a.length; _i++) {
            var x = _a[_i];
            if (typeof x) // 有body, visitbody
             {
                ret_val = this.visitFunctionDecl(x);
            }
            else //现版本，无body就是call
             {
                ret_val = this.visitFunctionCall(x);
            }
        }
        return ret_val;
    };
    ASTVisitor.prototype.visitFunctionDecl = function (function_decl) {
        return this.visitFunctionBody(function_decl.body);
    };
    ASTVisitor.prototype.visitFunctionBody = function (function_body) {
        var ret_val;
        for (var _i = 0, _a = function_body.stmts; _i < _a.length; _i++) {
            var x = _a[_i];
            ret_val = this.visitFunctionCall(x); // 只有call
        }
        return ret_val;
    };
    ASTVisitor.prototype.visitFunctionCall = function (function_call) {
        return undefined;
    };
    return ASTVisitor;
}());
exports.ASTVisitor = ASTVisitor;
