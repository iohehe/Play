import { Keyword, Scanner, Seperator, Token, TokenKind, Op } from "./scanner";
import { Prog, Statement, ErrorStmt, FunctionDecl, CallSignature, Block, ExpressionStatement, Expression, FunctionCall, StringLiteral, Unary, Binary} from './ast';

export class Parser {
    scanner:Scanner;
    constructor(scanner:Scanner) {
        this.scanner = scanner;
    }

    parseProg():Prog {
        let start_pos = this.scanner.peek().pos;
        let stmts = this.parseStatementList();
        return new Prog(start_pos, this.scanner.getLastPos(), stmts);
    }


    /**
     * functionDecl := "function" Identifier callSignature block.
     * callSignature := '(' parameterList? ')' typeAnnotation?.
     * parameterList := parameter ( ',' parameter)*.
     * parameter := Identifier typeAnnotation?.
     * block := '{' statementList? '}'.
     */
    parseFunctionDecl():FunctionDecl{
        let start_pos = this.scanner.getNextPos();     
        let isErrorNode = false;
        // 跳过关键字"function"
        this.scanner.next();
        let t = this.scanner.next(); //  函数名
        if (t.kind != TokenKind.Identifier)
        {
            isErrorNode = true;
        }
        // 解析callSignature(TODO, 支持参数)
        // let callSignature:CallSignature;
        this.scanner.next(); // (
        this.scanner.next(); // )

        // 解析 function body
        let functionBody:Block;
        let t1 = this.scanner.peek();
        if (t1.code == Seperator.OpenBrace)
        {
            functionBody = this.parseBlock();
        }
        return new FunctionDecl(start_pos, t.text, functionBody, isErrorNode);
    }


    /**
     * 
     * @returns 
     */
    parseBlock() {
        let start_pos = this.scanner.getNextPos();
        let t:Token = this.scanner.peek();
        // jump the '{'
        this.scanner.next();
        // parsing stmts
        let stmts = this.parseStatementList();
        t = this.scanner.peek();
        if (t.code == Seperator.CloseBrace) // 
        {
            this.scanner.next();
            return new Block(start_pos, this.scanner.getLastPos(), stmts);
        }
        else
        {
            console.log(t);
        }
    } 

    parseStatementList():Statement[] {
        let stmts: Statement[] = [];
        let t = this.scanner.peek();

        while (t.kind != TokenKind.EOF && t.code != Seperator.CloseBrace)
        {
            let stmt = this.parseStatement();
            stmts.push(stmt);
            t = this.scanner.peek();
        }
        return stmts;
    }

    parseStatement():Statement {
        let t = this.scanner.peek();
        let start_pos = t.pos;
        if (t.code == Keyword.Function)
        {
            return this.parseFunctionDecl();
        }
        else if (t.kind == TokenKind.Identifier ||  // 标识符
                 t.kind == TokenKind.DecimalLiteral ||  //各种Literal
                 t.kind == TokenKind.IntegerLiteral || 
                 t.kind == TokenKind.StringLiteral ||
                 t.code == Seperator.OpenParen) // ( 参数表达式
        {
            return this.parseExpressionStatement();
        }
        else
        {
            console.log("[ERROR] there are some errors happen");
        }

        return new ErrorStmt(start_pos, this.scanner.getLastPos());
    }

    /**
     *  解析表达式语句
     */
    parseExpressionStatement():ExpressionStatement {
        let exp = this.parseExpression(); // ===> 
        let t = this.scanner.peek();
        let stmt = new ExpressionStatement(this.scanner.getLastPos(), exp);
        if (t.code == Seperator.SemiColon)
        {
            this.scanner.next();
        }
        else
        {
        }
        return stmt;
    }

    /**
     * 解析表达式
     */
    parseExpression():Expression {
        return this.parseAssignment();
    }

    parseAssignment():Expression{
        let assignPrec = this.getPrec(Op.Assign);
        let exp1 = this.parseBinary(assignPrec);
        let t = this.scanner.peek();
        let tprec = this.getPrec(t.code as Op);
        let expStack:Expression[] = [];
        expStack.push(exp1);
        let opStack:Op[] = [];

        while (t.kind == TokenKind.Operator && tprec == assignPrec)
        {
            opStack.push(t.code as Op);
            this.scanner.next();
            exp1 = this.parseBinary(assignPrec);
            expStack.push(exp1);
            t = this.scanner.peek();
            tprec = this.getPrec(t.code as Op);
        }

        exp1 = expStack[expStack.length-1];
        if (opStack.length>0)
        {
            for (let i:number=expStack.length-2; i>=0; i--)
            {
                exp1 = new Binary(opStack[i], expStack[i], exp1);
            }
        }
        return exp1;
    }

    parseBinary(prec:number): Expression{
        let exp1 = this.parseUnary();
        let t = this.scanner.peek();
        let tprec = this.getPrec(t.code as Op);

        while (t.kind == TokenKind.Operator && tprec > prec)
        {
            this.scanner.next();
            let exp2 = this.parseBinary(tprec);
            let exp:Binary = new Binary(t.code as Op, exp1, exp2);
            exp1 = exp;
            t = this.scanner.peek();
            tprec = this.getPrec(t.code as Op);
        }
        return exp1;
    }

    parseUnary():Expression {
        let start_pos = this.scanner.getNextPos();
        let t = this.scanner.peek();
        if (t.kind == TokenKind.Operator) //
        {
            this.scanner.next();
            let exp = this.parseUnary();
            return new Unary(start_pos, this.scanner.getLastPos(), t.code as Op, exp, true);
        }
        else
        {
            console.log("[!] This token is not a operator");
            console.log(t);
            let exp = this.parsePrimary();
            let t1 = this.scanner.peek();
            if (t1.kind == TokenKind.Operator && (t1.code == Op.Inc||t1.code == Op.Dec))
            {
                this.scanner.next();
                return new Unary(start_pos, this.scanner.getLastPos(), t1.code as Op, exp, false);
            }
            else
            {
                return exp;
            }
        }
    }

    parsePrimary():Expression {
        let start_pos = this.scanner.getNextPos();
        let t = this.scanner.peek();
        // 如果t是一个identifier，一个以identifier开头的primary exp可能是变量，也可能是函数调用，再向后多看一个有没有(
        if(t.kind == TokenKind.Identifier)
        {
            if (this.scanner.peek2().code == Seperator.OpenParen) //如果是(, 解析call
            {
                return this.parseFunctionCall();
            }
            else //变量
            {
                this.scanner.next();
            }
        }
        // 其他， 我是从functioncall的参数来的
        else if (t.kind == TokenKind.StringLiteral)
        {
            this.scanner.next();
            return new StringLiteral(start_pos, t.text);
        }

        else if (t.code == Seperator.OpenParen) 
        {
            this.scanner.next();
            let exp = this.parseExpression();
            let t1 = this.scanner.peek();
            if (t1.code == Seperator.CloseParen)
            {
                this.scanner.next();
            }
            else
            {

            }
            return exp;
        }
    }

    parseFunctionCall():FunctionCall {
        let start_pos = this.scanner.getNextPos();
        let params:Expression[] = [];
        let name = this.scanner.next().text;
        this.scanner.next(); // 跳过'('
        //开始读参数
        let t1 = this.scanner.peek();
        while (t1.code != Seperator.CloseParen && t1.kind != TokenKind.EOF)
        {
            let exp = this.parseExpression();
            params.push(exp);
            t1 = this.scanner.peek();

            if (t1.code != Seperator.CloseParen)
            {
                if (t1.code == Op.Comma)
                {
                    t1 = this.scanner.next();
                }
                else
                {
                    return new FunctionCall(start_pos, this.scanner.getLastPos(), name, params, true);
                }
            }
        }

        if (t1.code == Seperator.CloseParen)
        {
            this.scanner.next();
        }

        return new FunctionCall(start_pos, this.scanner.getLastPos(), name, params);
    }

    /**
     * 解析函数签名
     * callSignature: '(' parameterList? ')' typeAnnotation?;
     */
    parseCallSignature():CallSignature {
        let start_pos = this.scanner.getNextPos();
        // 跳过'('
        let t = this.scanner.next();
        let paramList = null;
        // 解析参数列表
        if (this.scanner.peek().code == Seperator.CloseParen)
        {
            //
        }

        t = this.scanner.peek();

        if (t.code == Seperator.CloseParen)
        {
            // 跳过 ')'
            this.scanner.next();

            // 解析type Annotation
            let the_type:string = 'any';
            if (this.scanner.peek().code == Seperator.Colon)
            {
            }
            return new CallSignature(start_pos, this.scanner.getLastPos());
        }
    }

     /**
     * 二元运算符的优先级。
     */
      private opPrec:Map<Op,number> = new Map([
        [Op.Assign,                     2],
        [Op.PlusAssign,                 2],
        [Op.MinusAssign,                2],
        [Op.MultiplyAssign,             2],
        [Op.DivideAssign,               2],
        [Op.ModulusAssign,              2],
        [Op.BitAndAssign,               2],
        [Op.BitOrAssign,                2],
        [Op.BitXorAssign,               2],
        [Op.LeftShiftArithmeticAssign,  2],
        [Op.RightShiftArithmeticAssign, 2],
        [Op.RightShiftLogicalAssign,    2],
        [Op.Or,                         4],
        [Op.And,                        5],
        [Op.BitOr,                      6],
        [Op.BitXOr,                     7],
        [Op.BitAnd,                     8],
        [Op.EQ,                         9],
        [Op.IdentityEquals,             9],
        [Op.NE,                         9],
        [Op.IdentityNotEquals,          9],
        [Op.G,                          10],
        [Op.GE,                         10],
        [Op.L,                          10],
        [Op.LE,                         10],
        [Op.LeftShiftArithmetic,        11],
        [Op.RightShiftArithmetic,       11],
        [Op.RightShiftLogical,          11],
        [Op.Plus,                       12],
        [Op.Minus,                      12],
        [Op.Divide,                     13],
        [Op.Multiply,                   13],
        [Op.Modulus,                    13],
        ]);

    // 获取Op优先级
    private getPrec(op:Op):number {
        let ret = this.opPrec.get(op);
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
