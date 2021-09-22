export class CharStream {
    data: string;
    pos: number = 0;
    line: number = 1;
    col: number = 0;

    constructor(data:string) {
        this.data = data;
    }

    peek():string {
        return this.data.charAt(this.pos);
    }

    next():string {
        let ch = this.data.charAt(this.pos++);

        if (ch == '\n')
        {
            this.line++;
            this.col = 0;
        }
        else
        {
            this.col++;
        }

        return ch;
    }

    eof():boolean {
        return this.peek() == '';
    }
}

