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
var SymTable_1 = require("./SymTable");
var RefResolver = /** @class */ (function (_super) {
    __extends(RefResolver, _super);
    function RefResolver(sym_table) {
        var _this = _super.call(this) || this;
        console.log("~~~~~~~~~~~~~~~~~~~~~~>>>");
        console.log(sym_table);
        _this.sym_table = sym_table;
        return _this;
    }
    // 引用消解
    // 重写visitVariable
    RefResolver.prototype.visitVariable = function (variable) {
        var sym = this.sym_table.getSymbol(variable.name); // 从符号表找当前变量标识 
        if (sym != null && sym.kind == SymTable_1.SymKind.Variable) {
            console.log("[Boom] variable: " + variable.name + " 解引用成功");
            variable.decl = sym.decl;
        }
        else {
            console.log("[Error]: cannot find declaration of variable" + variable.name);
        }
    };
    RefResolver.prototype.visitFunctionCall = function (function_call) {
        var sym = this.sym_table.getSymbol(function_call.name);
        if (sym != null && sym.kind == SymTable_1.SymKind.Function) {
            console.log("[Boom] function: " + function_call.name + " 解引用成功");
            function_call.decl = sym.decl;
        }
    };
    return RefResolver;
}(ASTVisitor_1.ASTVisitor));
exports.RefResolver = RefResolver;
