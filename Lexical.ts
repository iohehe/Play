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

        }
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
            token.kind = TokenKind.Identifier;
        }

        //console.log(token);
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


