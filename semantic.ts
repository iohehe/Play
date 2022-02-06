import {Prog, ASTVisitor, FunctionDecl, FunctionCall} from './ast';
import { FunctionSymbol, built_ins } from './symbol';

export class SemanticAnalyer {
    // passes
    passes: SemanticASTVisitor[] = [
        new Enter(),
        new RefResolver()
    ];

    execute(prog:Prog):void {
        for (let pass of this.passes)
        {
            pass.visitProg(prog);
        }
    }
}


abstract class SemanticASTVisitor extends ASTVisitor {

}

/**
 * Passes
 */
class Enter extends SemanticASTVisitor {
   visitProg(prog:Prog) {
       return super.visitProg(prog);
   } 
}

/**
 * 
 */
 class RefResolver extends SemanticASTVisitor{ 
    visitFunctionDecl(functionDecl:FunctionDecl):any {
        super.visitFunctionDecl(functionDecl);
    }

    visitFunctionCall(functionCall:FunctionCall):any {
        if (built_ins.has(functionCall.name))
        {
            functionCall.sym = built_ins.get(functionCall.name) as FunctionSymbol;
        }
        else
        {
            //!!!!
            functionCall.sym = new FunctionSymbol('foo');
        }
    }
}