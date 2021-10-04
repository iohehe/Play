/**
 * 声明
 * 所有声明都会对应一个符号
 */
export abstract class Decl {
    name: string; //声明对应的符号
    constructor(name:string) {
        this.name = name;
    }
}