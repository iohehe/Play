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
exports.StringLiteral = void 0;
var Expression_1 = require("./Expression");
var StringLiteral = /** @class */ (function (_super) {
    __extends(StringLiteral, _super);
    function StringLiteral(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    StringLiteral.prototype.dump = function (prefix) {
        console.log(prefix + this.value);
    };
    StringLiteral.prototype.accept = function (visitor) {
        visitor.visitStringLiteral(this);
    };
    return StringLiteral;
}(Expression_1.Expression));
exports.StringLiteral = StringLiteral;
