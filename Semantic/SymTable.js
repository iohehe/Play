"use strict";
exports.__esModule = true;
exports.SymKind = exports.SymTable = void 0;
/**
 * 符号表示一个table, 由Map对构成，
 * Map: <string, Symbol>
 * string为具体的符号
 * Symbol为目标Symbol对象，包含name, type以及声明节点
 */
var SymTable = /** @class */ (function () {
    function SymTable() {
        this.table = new Map();
    }
    /**
     *  插入表
     */
    SymTable.prototype.enter = function (name, decl, symType) {
        this.table.set(name, new Symbol(name, decl, symType));
    };
    /**
     *  查找表(检查是否包含)
     */
    SymTable.prototype.hasSymbol = function (name) {
        return this.table.has(name);
    };
    /**
     *  查找表(返回具体内容)
     */
    SymTable.prototype.getSymbol = function (name) {
        var item = this.table.get(name);
        if (typeof item == "object") {
            return item;
        }
        else {
            return null;
        }
    };
    return SymTable;
}());
exports.SymTable = SymTable;
/**
 *  符号类型：
 *  变量， 函数， 类， 接口
 */
var SymKind;
(function (SymKind) {
    SymKind[SymKind["Variable"] = 0] = "Variable";
    SymKind[SymKind["Function"] = 1] = "Function";
    SymKind[SymKind["Class"] = 2] = "Class";
    SymKind[SymKind["Interface"] = 3] = "Interface";
})(SymKind = exports.SymKind || (exports.SymKind = {}));
;
/**
 *  符号类
 *  包括符号名， 声明节点 和符号类型
 */
var Symbol = /** @class */ (function () {
    function Symbol(name, decl, kind) {
        this.name = name;
        this.decl = decl;
        this.kind = kind;
    }
    return Symbol;
}());
//////////////////////////////////////////////////////////////
// .      建立符号表
//
/**
 *  把符号插入到符号表的过程，本质上还是一个AST遍历
 *  Enter.ts
*/ 
