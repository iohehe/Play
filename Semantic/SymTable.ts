import { Decl } from "../AST/Decl";
import { ASTVisitor } from "./ASTVisitor";
import { FunctionDecl } from "../AST/FunctionDecl";

/**
 * 符号表示一个table, 由Map对构成，
 * Map: <string, Symbol>
 * string为具体的符号
 * Symbol为目标Symbol对象，包含name, type以及声明节点
 */
export class SymTable {
    table:Map<String, Symbol> = new Map();

    /**
     *  插入表
     */
    enter(name:string, decl:Decl, symType:SymKind):void {
        this.table.set(name, new Symbol(name, decl, symType));
    }

    /**
     *  查找表(检查是否包含)
     */
    hasSymbol(name:string):boolean {
        return this.table.has(name);
    }


    /**
     *  查找表(返回具体内容)
     */
    getSymbol(name:string):Symbol|null {
        let item = this.table.get(name);

        if (typeof item == "object")
        {
            return item;
        }
        else
        {
            return null;
        }
    }
}


/**
 *  符号类型：
 *  变量， 函数， 类， 接口
 */
export enum SymKind {
    Variable, Function, Class, Interface
};


/**
 *  符号类
 *  包括符号名， 声明节点 和符号类型
 */
class Symbol {
    name: string;    
    decl: Decl;
    kind: SymKind;

    constructor(name:string, decl:Decl, kind:SymKind) {
        this.name = name;
        this.decl = decl;
        this.kind = kind;
    }
}


//////////////////////////////////////////////////////////////
// .      建立符号表
//

/** 
 *  把符号插入到符号表的过程，本质上还是一个AST遍历
*/