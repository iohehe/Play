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
exports.IntegerLiteral = void 0;
var Expression_1 = require("./Expression");
var IntegerLiteral = /** @class */ (function (_super) {
    __extends(IntegerLiteral, _super);
    function IntegerLiteral(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    IntegerLiteral.prototype.dump = function (prefix) {
        console.log(prefix + this.value);
    };
    IntegerLiteral.prototype.accept = function (visitor) {
        return visitor.visitIntegerLiteral(this);
    };
    return IntegerLiteral;
}(Expression_1.Expression));
exports.IntegerLiteral = IntegerLiteral;
