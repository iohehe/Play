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
import { variableDecl } from "./AST/VariableDecl";
import { Variable } from "./AST//Variable";

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
     * stmt :=  FunctionCall|FuntctionDecl|ExpressionStmt|AssigmentStmt.
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
        // parsing VariableDecl
        else if (token.kind == TokenKind.KeyWord && token.text == "let")
        {
            console.log("[!] Begin to parse variable decl...");
            return this.parseVariableDecl();
        }
        else if (token.kind == TokenKind.Identifier||token.kind == TokenKind.IntegerLiteral || token.kind == TokenKind.StringLiteral)
        {
            console.log("[!] Begin to parsing expressions...");
            return this.parseExpressionStmt();
        }
        else
        {
            console.log("[!!!!] Can not recoggnize a expression starting with: " + this.tokenizer.peek().text);
            return null;
        }
    }


    // variableDec := "let" Identifier typeAnnotation? ("=" singleExpression)';'.
    // typeAnnotation := ":" typeName.
    public parseVariableDecl() {
        this.tokenizer.next(); // 跳过 'let'
        let t = this.tokenizer.next();
        if (t.kind == TokenKind.Identifier)  // t在这个块里不动，因为记录了标识符的名字
        {
            // decl拿三部分: name, type, 初始化exp
            let var_name:string = t.text;
            // 下推 type
            let var_type:string = 'any'; 
            let init:Expression|null = null;
            let t1 = this.tokenizer.peek(); // 拿 identifier的下一个
            //t1 三种可能，";"结束， “=” 开始初始化赋值， ":"  进行类型标注 

            // 判断类型标注信息
            if (t1.text == ":") //类型标注
            {
                this.tokenizer.next(); // 跳过":"
                t1 = this.tokenizer.peek(); //拿到类型
                if (t1.kind == TokenKind.Identifier)
                {
                    var_type = t1.text; //这里没有判断类型的正确性，可能需要解引用时判断可能是非基础类型
                    this.tokenizer.next(); //推过
                    t1 = this.tokenizer.peek();
                }
                else
                {
                    console.log("[SYNAX ERROR]: parsing type annotation in variableDecl");
                    return null;
                }
            }

            // 判断初始表达式
            if (t1.text == "=")
            {
                this.tokenizer.next();
                init = this.parseExpression();
            }
            
            t1 = this.tokenizer.peek(); // 这事块外的t1
            if (t1.text == ";") // stmt终结
            {
                this.tokenizer.next(); //推过;
                return new variableDecl(var_name,var_type, init);
            }
            else
            {
                console.log("[SYNTAX ERROR] Excepting ; at the end of variable declaration, while we meet " + t1.text);
                return null;
            }
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
     *  primary := IntegerLiteral|StringLiteral|DecimalLiteral|FunctionCall|Variable
     *  @returns 
     */
    public parsePrimary():Expression|null {
        let t = this.tokenizer.peek();
        console.log("parsing primary: " + t.text);

        // identifier
        // 以identifer开头，可能是function call 也肯能是variable, 所以要想后多看一个Token是不是"(", 相当于局部使用了LL(2)算法
        if (t.kind == TokenKind.Identifier) 
        {
            if (this.tokenizer.peek2().text == '(')
            {
                console.log("function call.........");
                return this.parseFunctionCall();
            }
            else
            {
                console.log("variable assignment........");
                this.tokenizer.next(); //推出改token    
                return new Variable(t.text);
            }
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
            console.log(t.text);
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
        ['=', 2],
        ['+', 3],
        ['*', 4]
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