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
exports.Prog = void 0;
var ASTNode_1 = require("./ASTNode");
// Prog ::= Statement+
// Statement ::= FunctionDecl|FunctionCall
var Prog = /** @class */ (function (_super) {
    __extends(Prog, _super);
    function Prog(stmts) {
        var _this = _super.call(this) || this;
        _this.stmts = [];
        _this.stmts = stmts;
        return _this;
    }
    Prog.prototype.dump = function (prefix) {
        console.log(prefix + "Prog");
        this.stmts.forEach(function (x) { return x.dump(prefix + "\t"); });
    };
    return Prog;
}(ASTNode_1.ASTNode));
exports.Prog = Prog;
