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
exports.FunctionDecl = void 0;
var Statement_1 = require("./Statement");
// functionDecl ::= KeyWord Identifier (parameterList?) functionBody
var FunctionDecl = /** @class */ (function (_super) {
    __extends(FunctionDecl, _super);
    function FunctionDecl(name, body) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.body = body;
        return _this;
    }
    FunctionDecl.prototype.dump = function (prefix) {
        console.log(prefix + "FunctionDecl");
        this.body.dump(prefix + "\t");
    };
    return FunctionDecl;
}(Statement_1.Statement));
exports.FunctionDecl = FunctionDecl;
