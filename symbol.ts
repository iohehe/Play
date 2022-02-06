import {ASTNode, FunctionDecl, Prog} from './ast'



export abstract class Symbol {
    name: string;
    //theType:null;
    kind: SymKind;

    constructor(name: string, theType:null, kind:SymKind) {
        this.name = name;
        this.kind = kind;
        //this.theType = theType;
    }

    abstract accept(visitor:SymbolVisitor, additional:any):any;
}

// 只写functionsymbol,不写varsymbol
export class FunctionSymbol extends Symbol {
    decl:FunctionDecl|null = null; // 存放 AST,作为代码来运行

    constructor(name:string ){
        super(name, null, SymKind.Function);
        //this.theType = theType;
    }

    accept(visitor:SymbolVisitor, additional:any = undefined):any {
        visitor.visitFunctionSymbol(this, additional);
    }
}




////////////////////////////////////////
// visitor
export abstract class SymbolVisitor {
    abstract visitFunctionSymbol(sym:FunctionSymbol, additional:any):any;    
}

export class SymbolDumpler extends SymbolVisitor {
    visit(sym:Symbol, additional:any) {
        return sym.accept(this, additional);
    }

    visitFunctionSymbol(sym:FunctionSymbol, additional:any):any {
        console.log(additional + sym.name + "{" + SymKind[sym.kind] + ", local var count:"+ "}");
        console.log("visitFunction;....................");
    }
}


////////////////////////////////////////////////
export enum SymKind{Variable, Function, Class, Interface, Parameter, Prog};

export let FUN_println = new FunctionSymbol("println");
export let built_ins:Map<string, FunctionSymbol> = new Map([
    ["println", FUN_println],
]);

