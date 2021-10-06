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
exports.Enter = void 0;
var AStVisitor_1 = require("./AStVisitor");
var SymTable_1 = require("./SymTable");
var Enter = /** @class */ (function (_super) {
    __extends(Enter, _super);
    function Enter(sym_table) {
        var _this = _super.call(this) || this;
        _this.sym_table = sym_table;
        return _this;
    }
    /**
     * 将函数声明加入符号表
     *  @param functionDecl
     */
    Enter.prototype.visitFunctionDecl = function (function_decl) {
        console.log("sym_table to register function decl");
        if (this.sym_table.hasSymbol(function_decl.name)) {
            console.log("Dumplicate symbol: " + function_decl.name);
        }
        this.sym_table.enter(function_decl.name, function_decl, SymTable_1.SymKind.Function); //插入function decl
    };
    /**
     *  变量声明
     *   @param variableDecl
     */
    Enter.prototype.visitVariableDecl = function (variable_decl) {
        console.log("sym_table to register variable decl");
        if (this.sym_table.hasSymbol(variable_decl.name)) {
            console.log("Dumplicate symbol:   " + variable_decl.name); //重复声明
        }
        console.log("insert into sym_table:" + variable_decl.name);
        this.sym_table.enter(variable_decl.name, variable_decl, SymTable_1.SymKind.Variable);
        console.log(this.sym_table);
    };
    return Enter;
}(AStVisitor_1.ASTVisitor));
exports.Enter = Enter;
