import {Prog, ASTVisitor, FunctionDecl} from './ast';

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
class RefResolver extends SemanticASTVisitor {

    visitFunctionDecl(functionDecl:FunctionDecl):any {
        super.visitFunctionDecl(functionDecl);
    }
}