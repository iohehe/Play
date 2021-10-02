import {Lexical} from "./Lexical";
import {Statement} from "./AST/Statement";
import {TokenKind} from "./Token";
import {FunctionDecl} from "./AST/FunctionDecl";
import {FunctionBody} from "./AST/FunctionBody";
import {FunctionCall} from "./AST/FunctionCall";
import {Expression} from "./AST/Expression";
import {IntegerLiteral} from "./AST/IntegerLiteral";
import {Prog} from "./AST/Prog";
import {BinaryExp} from "./AST/BinaryExp";
import {ExpressionStatement} from "./AST/ExpressionStatement";

/**
 *  @version: 0.2
 * 
 *  Parser  
 * ~~~~~~~~~~~~~~~~~
 *  支持二元表达式解析
 *  prog := statementList? EOF.
 *  statementList := (functionDecl|expressionStatement)+.
 *  functionDecl := "function" Identifier "("")" functionBody.  //不支持传参数
 *  functionBody := "{" statementList? "}". //statementList 可选
 *  statement := functionDecl|expressionStatement.
 *  expressionStatement := expression ';'.
 *  expression := primary (binOP primary)*.    // 表达式又一个基本数据类型，或者多个基础数据类型加二元表达式组合而成
 *  primary := StringLiteral | DecimalLiteral | IntegerLiteral | functionCall | '(' expression ')';  //基础数据类型 
 *  binOP := '+'|'-'|'*'|'/'|'='|'+='|'-='|'*='|'/='|'>'|'='|'<'|'>='|'=='|'<='|'!='|'&&'|'||'|....
 *  functionCall := Identifier '(' parameterList? ')'.
 *  parameterList := expression (',' expression)* .
 */


export class Parser {
    private tokenizer:Lexical;

    public constructor(tokenizer:Lexical) {
        this.tokenizer = tokenizer;
    }

    /**
     *  Parsing Prog
     *  prog :: = (functionDecl|functionCall)*.
     */
    public parseProg():Prog{
        console.log("\t Parsing ...\n");
        let stmts: Statement[] = [];
        let stmt: Statement|null = null;

        let token = this.tokenizer.peek();

        while(token.kind != TokenKind.EOF && token.text != '}')
        {
            console.log("[start]...");
            console.log(this.tokenizer.peek());

            let stmt = this.parsingStatement();
            if (stmt != null)
            {
                stmts.push(stmt);
            }
            else
            {
                console.log("[!] No tokens\n");    
                //process.exit(0);
                return null;
            }

            token = this.tokenizer.peek();
        }
        return new Prog(stmts);
    }


    /**
     * Parsing Statement
     * stmt :=  FunctionCall|FuntctionDecl|ExpressionStmt.
     * @returns 
     */
    parsingStatement():Statement|null {
        let token = this.tokenizer.peek();
        let stmt:Statement;
        // parsing FunctionDecl
        if (token.kind == TokenKind.KeyWord && token.text == "function") // match the functionDecl KeyWord
        {
            console.log("[!] Begin to parse function Decl...");            
            stmt = this.parseFunctionDecl();
            //stmt.dump("-------> function decl ------> ");

            if (stmt!=null) {
                return stmt;
            }
        }
        // parsing Fucntion Call
        else if(token.kind == TokenKind.Identifier)   //这个else不要用if else 因为function后边跟的也是identifier
        {
                console.log("[!] Begin to parse function Call...");
                stmt = this.parseFunctionCall();

                //stmt.dump("-------> function call -------> ")
                if (stmt)
                {
                    return stmt;
                }
        }
        else if (token.kind == TokenKind.IntegerLiteral)
        {
            console.log("[!] Begin to parsing a binary operate...");
            return this.parseExpressionStmt();
        }
        else
        {
            console.log("[!!!!] Can not recoggnize a expression starting with: " + this.tokenizer.peek().text);
            return null;
        }
    }


    // expressionStmt := (expression)+;.
    public parseExpressionStmt():ExpressionStatement|null {
        console.log("[!] Parsing Expression stmts...");
        let exp = this.parseExpression();

        if (exp != null)
        {
            let t = this.tokenizer.peek();
            if (t.text == ";")
            {
                console.log(t); //如果找到了；，就封装表达式语句
                this.tokenizer.next();
                return new ExpressionStatement(exp);
            }
            else
            {
                console.log("[SYNTAX ERROR] 语句缺少分号");
                process.exit(1);
            }
        }
    }


    // expression := binaryExp
    public parseExpression():Expression|null {
        return this.parseBinaryExp(0);  //目前只有二元操作表达式
    }


    /**
     *  解析而源操作
     * ~~~~~~~~~~~~~~~
     *  采用了运算符优先级算法， 解析二元表达式
     * @param prec:  当前运算符的优先级
     * */ 
    public parseBinaryExp(prec: number):Expression|null {
        //console.log("[!] Begin to parse binary operate"); 
        let exp1 = this.parsePrimary(); //拿到左表达式

        if (exp1 != null) 
        {
            let t = this.tokenizer.peek(); 
            let t_prec = this.getPrec(t.text); //分隔左右表达式的一定是操作符，看看这个操作符的优先级吧
            // 这里是操作符优先级算法的精髓，
            // 第一个条件是确定t是一个二元操作符
            // 第二个是如果当前操作符优先级高于上一个(栈中)的话, 就要形成一个右子树喂给栈中操作符
            // 如2+3*5, *号的优先级大，因此要先生成一颗3*5的右子树，作为一个整体喂给+号。
            while(t.kind == TokenKind.Operator && t_prec > prec)
            {
                this.tokenizer.next();  // 这里把操作符推了
                // 拿右子树
                let exp2 = this.parseBinaryExp(t_prec); // 递归，一直到当前优先级小于或者等于（只有这样才能确定一颗左子树）
                console.log(exp2);
                if (exp2 != null)
                {
                    console.log("=============");
                    console.log("[+] create a binary exp....");
                    console.log("op: "+ t.text);
                    exp1.dump("exp1: ---> ");
                    exp2.dump("exp2: ---> ");
                    console.log("=============");
                    let exp:BinaryExp = new BinaryExp(t.text, exp1, exp2); // 这里开始组装binaryExp
                    exp1 = exp;    // 组装完毕后，赋给exp1返回
                    t = this.tokenizer.peek();   // 拿当前token更新优先级
                    t_prec = this.getPrec(t.text);
                }
                else
                {
                    console.log("[!!!]error");
                    process.exit(1);
                }
            }
            return exp1;
        }
        else
        {
            console.log("return null????");
            return null;
        }
    }


    /**
     *  Get a 基础表达式
     *  primary := IntegerLiteral|StringLiteral|DecimalLiteral
     *  @returns 
     */
    public parsePrimary():Expression|null {
        let t = this.tokenizer.peek();
        console.log("parsing primary: " + t.text);

        // identifier
        if (t.kind == TokenKind.Identifier) 
        {
            this.tokenizer.next(); //推出改token    
            return null; //!TODO
        }
        // integer 
        else if (t.kind == TokenKind.IntegerLiteral)
        {
            this.tokenizer.next();
            return new IntegerLiteral(parseInt(t.text)); 
        }
        // TODO: decimal & string & ()
        else
        {
            console.log("木有");
            return null;
        }
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


    /**
     *  操作符优先级
     */
    private op_prec = new Map ([
        ['+', 1],
        ['*', 2]
    ]);

    private getPrec(op:string):number {
        let ret = this.op_prec.get(op);

        if (typeof ret == 'undefined')
        {
            return -1;
        }
        else
        {
            return ret;
        }
    }
}