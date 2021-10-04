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
exports.variableDecl = void 0;
var Decl_1 = require("./Decl");
/**
 *  变量声明节点
 *  记录变量名，类型和初始值
 */
var variableDecl = /** @class */ (function (_super) {
    __extends(variableDecl, _super);
    function variableDecl(name, var_type, init) {
        var _this = _super.call(this, name) || this;
        _this.var_type = var_type;
        _this.init = init;
        return _this;
    }
    variableDecl.prototype.dump = function (prefix) {
        console.log(prefix + "VariableDecl " + this.name + ", type: " + this.var_type);
        if (this.init == null) {
            console.log(prefix + "no initialization.");
        }
        else {
            this.init.dump(prefix + "   ");
        }
    };
    return variableDecl;
}(Decl_1.Decl));
exports.variableDecl = variableDecl;
