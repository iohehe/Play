import { Lexical } from "./Lexical";
import {Statement} from "./AST/Statement";
import { TokenKind } from "./Token";

export class Parser {
    private tokenizer:Lexical;

    public constructor(tokenizer:Lexical) {
        this.tokenizer = tokenizer;
    }

    /**
     *  Parsing Prog
     *  prog :: = (functionDecl|functionCall)*.
     */
    public parseProg():void {
        console.log("\t Parsing ...\n");
        let stmts: Statement[] = [];
        let stmt: Statement|null = null;

        let token = this.tokenizer.peek();

        while (token.kind != TokenKind.EOF) 
        {

        }
    }


    /**
     *  Parsing FunctionCall
     *  functionCall ::=  Identifier "(" parameterList? ")".
     *  paramenterList ::= StringLiteral (',' StringLiteral)*.
     */
    public parseFunctionCall():void{}


    /**
     *  Parsing FunctionDecl
     *  functionDecl ::= KeyWord Identifier "(" parameterList? ")" functionBody.
     */
    public parseFunctionDecl():void{}


    /**
     *  Parsing FunctionBody
     *  functionBody ::= "{" functionCall* "}".
     */
    public parseFunctionBody():void{}

}