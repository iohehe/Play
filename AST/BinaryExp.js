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
exports.BinaryExp = void 0;
var Expression_1 = require("./Expression");
var BinaryExp = /** @class */ (function (_super) {
    __extends(BinaryExp, _super);
    function BinaryExp(op, exp1, exp2) {
        var _this = _super.call(this) || this;
        _this.op = op;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        return _this;
    }
    BinaryExp.prototype.dump = function (prefix) {
        console.log(prefix + "Binary: " + this.op);
        this.exp1.dump(prefix + "     ");
        this.exp2.dump(prefix + "     ");
    };
    BinaryExp.prototype.accept = function (visitor) {
        return visitor.visitBinary(this);
    };
    return BinaryExp;
}(Expression_1.Expression));
exports.BinaryExp = BinaryExp;
