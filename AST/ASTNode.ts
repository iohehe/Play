import { ASTVisitor } from "../Semantic/ASTVisitor";

export abstract class ASTNode {
    public abstract dump(prefix:string):void;

    //visitor模式中，用于接受visitor的访问
    public abstract accept(visitor:ASTVisitor):any;
}

