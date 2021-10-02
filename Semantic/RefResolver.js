"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.RefResolver = void 0;
var ASTVisitor_1 = require("./ASTVisitor");
var RefResolver = /** @class */ (function (_super) {
    __extends(RefResolver, _super);
    function RefResolver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.prog = null;
        return _this;
    }
    RefResolver.prototype.visitProg = function (prog) {
        console.log("Begin to dereference...");
        this.prog = prog;
        for (var _i = 0, _a = prog.stmts; _i < _a.length; _i++) {
            var x = _a[_i];
            var function_call = x;
            if (typeof function_call.parameters === 'object') {
                this.resolveFunctionCall(prog, function_call);
            }
            else {
                this.visitFunctionDecl(x);
            }
        }
    };
    RefResolver.prototype.visitFunctionBody = function (function_body) {
        if (this.prog != null) {
            for (var _i = 0, _a = function_body.stmts; _i < _a.length; _i++) {
                var x = _a[_i];
                return this.resolveFunctionCall(this.prog, x);
            }
        }
    };
    RefResolver.prototype.resolveFunctionCall = function (prog, function_call) {
        var function_decl = this.findFunctionDecl(prog, function_call.name);
        if (function_decl != null) {
            function_call.definition = function_decl;
        }
        else {
            if (function_call.name != "println") //非系统函数， 又解不了引用的
             {
                console.log("NameError: function " + function_call.name + " not found");
                process.exit(0);
            }
        }
    };
    // find function decl : 由resolve call时调用,在整个prog中找decl
    RefResolver.prototype.findFunctionDecl = function (prog, name) {
        for (var _i = 0, _a = prog === null || prog === void 0 ? void 0 : prog.stmts; _i < _a.length; _i++) {
            var x = _a[_i];
            var function_decl = x; //找到属于functino decl的
            if (typeof function_decl.body == 'object' && function_decl.name == name) //有函数体，且名称与callname相同的fcuntiondecl
             {
                return function_decl;
            }
        }
        return null; //没有找到对应的函数体
    };
    return RefResolver;
}(ASTVisitor_1.ASTVisitor));
exports.RefResolver = RefResolver;
