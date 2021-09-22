export enum TokenKind {
    KeyWord,
    Identifier,
    StringLiteral,
    IntegerLiteral,
    Seperator,
    Operator,
    EOF
};

export interface Token{
    kind:TokenKind;  
    text:string;
}