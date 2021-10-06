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
exports.ExpressionStatement = void 0;
var Statement_1 = require("./Statement");
var ExpressionStatement = /** @class */ (function (_super) {
    __extends(ExpressionStatement, _super);
    function ExpressionStatement(exp) {
        var _this = _super.call(this) || this;
        _this.exp = exp;
        return _this;
    }
    ExpressionStatement.prototype.dump = function (prefix) {
        console.log(prefix + "ExpressionStatement");
        this.exp.dump(prefix + "     ");
    };
    ExpressionStatement.prototype.accept = function (visitor) {
        return visitor.visitExpressionStatement(this);
    };
    return ExpressionStatement;
}(Statement_1.Statement));
exports.ExpressionStatement = ExpressionStatement;
