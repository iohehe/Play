export enum TokenKind {
    KeyWord,
    Identifier,
    StringLiteral,
    Seperator,
    IntegerLiteral,
    Operator,
    EOF
};

export interface Token{
    kind:TokenKind;  
    text:string;
}