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
exports.FunctionCall = void 0;
var Statement_1 = require("./Statement");
// FunctionCall ::= Identitifer "(" parameterList? ")"
var FunctionCall = /** @class */ (function (_super) {
    __extends(FunctionCall, _super);
    function FunctionCall(name, parameters) {
        var _this = _super.call(this) || this;
        _this.definition = null;
        _this.name = name;
        _this.parameters = parameters;
        return _this;
    }
    FunctionCall.prototype.dump = function (prefix) {
        console.log(prefix + "FunctionCall " + this.name + (this.definition != null ? ", resolved" : ", not resolved"));
        this.parameters.forEach(function (x) { return console.log(prefix + "\t" + "Parameter: " + x); });
    };
    return FunctionCall;
}(Statement_1.Statement));
exports.FunctionCall = FunctionCall;
