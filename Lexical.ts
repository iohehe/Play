import { CharStream } from "./CharStream";
import{TokenKind, Token} from "./Token";

export class Lexical {
    tokens:Array<Token> = new Array<Token>();

    stream: CharStream;

    private static KeyWords:Set<string> = new Set(
        ["function"]
    );

    constructor(stream:CharStream){
        this.stream = stream;
    }

    public peek():Token {
       let t:Token|undefined = this.tokens[0]; 
       if (typeof t == 'undefined')
       {
           t = this.getAToken();
           this.tokens.push(t);
       }
        return t;
    }

    public next():Token {
        let t:Token|undefined = this.tokens.shift();
        if (typeof t == 'undefined')
        {
            return this.getAToken();
        }
        else
        {
            return t;
        }
    }

    public getAToken(): Token{
        //console.log("\n[+] GET a token\n");
        this.skipWhiteSpaces();
        // stream 空了
        if (this.stream.eof()) {
            return {kind:TokenKind.EOF, text:""};
        }

        else // 词法状态机
        {
           let ch = this.stream.peek();
           //1. Identifier(KeyWord)
           if (this.isLetter(ch)||ch == '_')  // 字母下划线开头进
           {
                return this.parseIdentifier();
           }
           //2. StringLiteral
           else if (ch == '"')
           {
                //console.log("[+] is a StringLiteral token");
                return this.parseStringLiteral();
           }
           //3. Seperator
           else if (this.isSeperators(ch))
           {
                //console.log("[+] is a Seperators");
                return this.parseSeperator();
           }

           //4. IntegerLiteral
           else if (ch >= '0' && ch <= '9')
           {
               return this.parseInteger();
           }

           //5. Binary Operator:  +
            else if (ch == "+")
            {
                //console.log("find a binary operator +");
                
                return this.parseBinOP_Plus();
            }           

            //6. Binary Operator: *
            else if (ch == "*")
            {
                return this.parseBinOP_Multi();
            }
            else
            {
                console.log("[!!!!] unknow pattern meeting: "+ ch);
                this.stream.next(); // pass the unknow character in the stream
                //return this.getAToken(); // 下一轮推token
                process.exit(1);
            }

        }
    }


    // ===== scanning binary operators
    //
    //*
    public parseBinOP_Multi():Token {
        let token = {kind: TokenKind.Operator, text: ""};
        this.stream.next();
        let ch1 = this.stream.peek();
        
        if (ch1 == "=") // *=
        {
            token.text = "*=";
            this.stream.next();
        }
        //妹有**
        else
        {
            token.text = "*";
        }
        return token;
    }
    //+
    public parseBinOP_Plus():Token {
        let token = {kind: TokenKind.Operator, text:""};
        // plus: + , +=, ++
        this.stream.next();
        let ch1 = this.stream.peek();
        if (ch1 == "+") //++
        {
            token.text = "++";
            this.stream.next(); // push it
        }
        else if(ch1 == "=") //+=
        {
            token.text = "+=";
            this.stream.next(); // push it 
        }
        else // + only
        {
            token.text = "+";
        }
        // in here make sure the stream's current char is not belong to the plus operator including(+, +=, ++)
        return token;
    }


    public parseSeperator():Token {
        let token = {kind: TokenKind.Seperator, text:""};
        token.text = this.stream.next();
        //console.log(token);
        return token;
    }

    public parseStringLiteral():Token {
        let token = {kind: TokenKind.StringLiteral, text:""};
        this.stream.next(); // 推掉一个引号
        while(this.stream.peek()!='"'&&!this.stream.eof())
        {
            token.text+=this.stream.next();
        }
        if (this.stream.peek() == '"')
        {
            //console.log("[+] parsed a String Literal token");
            this.stream.next(); //吃掉另一个引号
        }
        //console.log(token);
        return token;
    }

    public parseIdentifier():Token {
        let token = {kind: TokenKind.Identifier, text: ""};
        token.text += this.stream.next(); 
        //
        while(this.isIdentifier(this.stream.peek()) && !this.stream.eof())
        {
            token.text += this.stream.next();
        }
        //
        if (Lexical.KeyWords.has(token.text))
        {
            token.kind = TokenKind.KeyWord;
        }

        //console.log(token);
        return token;
    }

    public parseInteger():Token {
        let token = {kind: TokenKind.IntegerLiteral, text: ""};
        token.text += this.stream.next();
        while(this.stream.peek() >= "0" && this.stream.peek() <= "9")  // TODO: 考虑靠头为0的情况
        {
            token.text += this.stream.next();
        }
        return token;
    }


    public skipWhiteSpaces(): void{
        while (this.isWhiteSpaces(this.stream.peek())&&!this.stream.eof())
        {
            //console.log("[Test] Ignore spaces...");
            this.stream.next();
        }
    }

    public isWhiteSpaces(ch:string): boolean {
        return (ch == ' ')||(ch == '\t') || (ch == '\n');
    }

    public isLetter(ch:string):boolean {
        return (ch > 'A'&& ch <'Z') || (ch >'a' && ch<'z');
    }

    public isDigit(ch:string):boolean {
        return (ch>'0'&&ch<'9');
    }

    public isIdentifier(ch:string):boolean {
        return this.isLetter(ch)||this.isDigit(ch)||ch == '_';
    }

    public isSeperators(ch:string):boolean {
        return ch == '(' || ch == ')' || ch == '{' || ch == '}' || ch == ',' || ch == ';';
    }
}


