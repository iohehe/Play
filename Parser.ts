import { Lexical } from "./Lexical";
import {Statement} from "./AST/Statement";
import {TokenKind} from "./Token";
import {FunctionDecl} from "./AST/FunctionDecl";
import { FunctionBody } from "./AST/FunctionBody";
import { FunctionCall } from "./AST/FunctionCall";
import {Prog} from "./AST/Prog";

export class Parser {
    private tokenizer:Lexical;

    public constructor(tokenizer:Lexical) {
        this.tokenizer = tokenizer;
    }

    /**
     *  Parsing Prog
     *  prog :: = (functionDecl|functionCall)*.
     */
    public parseProg():Prog {
        console.log("\t Parsing ...\n");
        let stmts: Statement[] = [];
        let stmt: Statement|null = null;

        let token = this.tokenizer.peek();


        while(token.kind != TokenKind.EOF)
        {
            console.log(this.tokenizer.peek());
            if (token.kind == TokenKind.KeyWord && token.text == "function") // match the functionDecl KeyWord
            {
                console.log("[!] Begin to parse function Decl...");            
                stmt = this.parseFunctionDecl();
                //stmt.dump("-------> function decl ------> ");

                if (stmt!=null) {
                    stmts.push(stmt);
                }
            }
            else if(token.kind == TokenKind.Identifier)   //这个else不要用if else 因为function后边跟的也是identifier
            {
                    // parsing function call
                    console.log("[!] Begin to parse function Call...");
                    stmt = this.parseFunctionCall();

                    //stmt.dump("-------> function call -------> ")
                    if (stmt)
                    {
                        stmts.push(stmt);
                    }
            }
            token = this.tokenizer.peek();
        }
        return new Prog(stmts);
    }


    /**
     *  Parsing FunctionCall
     *  functionCall ::=  Identifier "(" parameterList? ")".
     *  paramenterList ::= StringLiteral (',' StringLiteral)*.
     */
    public parseFunctionCall():FunctionCall{
        let params:string[] = [];
        let t = this.tokenizer.next();    

        // 发现call
        if (t.kind == TokenKind.Identifier)
        {
            let t1 = this.tokenizer.next();
            if (t1.text == "(") 
            {
                // 解析parameter list
                let t2 = this.tokenizer.next();
                if (t2.kind == TokenKind.StringLiteral)
                {
                    params.push(t2.text);
                    t2 = this.tokenizer.next();
                }
                if (t2.text == ")")
                {
                    this.tokenizer.next(); // 过掉 ;
                    return new FunctionCall(t.text, params);
                }
            }
        }
    }


    /**
     *  Parsing FunctionDecl
     *  functionDecl ::= KeyWord Identifier "(" parameterList? ")" functionBody.
     */
    public parseFunctionDecl():FunctionDecl{
        this.tokenizer.next(); // eat key word: function
        let t = this.tokenizer.next(); // function name
        let function_decl:FunctionDecl;
        console.log("[+] fucntion name: "+t.text);

        let t1 = this.tokenizer.next();
        console.log(t1); //"("
        if (t1.text == "(") // match
        {
            // 当前无参数，跳过解析parameterList
            let t2 = this.tokenizer.next();

            if (t2.text == ")")
            {
                // 递归下降，开始解析FunctionBody
                let function_body = this.parseFunctionBody();
                if (function_body != null)
                {
                    return new FunctionDecl(t.text, function_body);
                }
            }
        }
    }


    /**
     *  Parsing FunctionBody
     *  functionBody ::= "{" functionCall* "}".
     */
    public parseFunctionBody():FunctionBody {
        console.log("[!] Begin to parse function body...\n");
        let t1 = this.tokenizer.next();
        let stmts:FunctionCall[] = [];

        if (t1.text == "{")
        {
            // 开始递归下降解析body内的stmts(目前只有call)
            console.log("[!] Begin to parse function call...\n");
            let function_call = this.parseFunctionCall();
            if (function_call != null)
            {
                stmts.push(function_call);
            }
        }

        this.tokenizer.next();// 吃掉 }
        return new FunctionBody(stmts);
    }

}