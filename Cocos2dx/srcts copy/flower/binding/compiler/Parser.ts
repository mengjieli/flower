module flower {
    export class Parser {
        private action:any;
        private go:any;
        private commonInfo:any;

        public constructor() {
            this.action = flower.ParserTable.action;
            this.go = flower.ParserTable.go;
            this.commonInfo = null;
        }

        public setCommonInfo(info:any) {
            this.commonInfo = info;
            this.commonInfo.tokenCount = 0;
        }

        public parser(content:string):boolean {
            var commonInfo:any = this.commonInfo;
            var scanner:flower.Scanner = this.commonInfo.scanner;
            scanner.setTokenContent(content);
            var token:string;
            token = scanner.getNextToken();
            var newNode:any = {"type": "leaf", "token": token, "value": commonInfo.tokenValue};
            if (flower.TokenType.TokenTrans[token])
                token = commonInfo.tokenValue;
            commonInfo.tokenCount++;
            if (token == null) {
                return null;
            }
            var state:number = 1;
            var stack:Array<any> = [state];
            var nodeStack:Array<any> = [];
            commonInfo.nodeStack = nodeStack;
            var i:number;
            var action:any;
            var popNodes:any;
            var commonDebug:any = {"file": content};
            while (true) {
                if (this.action[state][token] == undefined) {
                    //if (flower.Engine.DEBUG) {
                    //    flower.DebugInfo.debug("语法分析错误," + content + this.getFilePosInfo(content, commonInfo.tokenPos), flower.DebugInfo.WARN);
                    //}
                    commonInfo.parserError = true;
                    return false;
                }
                action = this.action[state][token];
                if (action.a == 0) {
                    break;
                }
                else if (action.a == 1) {
                    popNodes = [];
                    i = action.c.exp;
                    while (i) {
                        stack.pop();
                        popNodes.push(nodeStack.pop());
                        i--;
                    }
                    popNodes.reverse();
                    commonInfo.newNode = {
                        "type": "node",
                        "create": action.c.id,
                        "nodes": popNodes,
                        "tokenPos": popNodes[0].tokenPos,
                        "debug": popNodes[0].debug
                    };
                    if (action.c.code) {
                        this.runProgrammer(action.c.id, commonInfo.newNode, popNodes);
                    }
                    state = stack[stack.length - 1];
                    state = this.go[state][action.c.head];
                    stack.push(state);
                    nodeStack.push(commonInfo.newNode);
                }
                else {
                    state = this.action[state][token].to;
                    stack.push(state);
                    nodeStack.push(newNode);
                    token = null;
                    newNode = null;
                }
                if (token == null && token != "$") {
                    token = scanner.getNextToken();
                    commonInfo.tokenCount++;
                    if (token == null)
                        return false;
                    else
                        newNode = {
                            "type": "leaf",
                            "token": token,
                            "value": commonInfo.tokenValue,
                            "tokenPos": commonInfo.tokenPos,
                            "debug": commonDebug
                        };
                    if (flower.TokenType.TokenTrans[token])
                        token = commonInfo.tokenValue;
                }
            }
            return true;
        }

        public getFilePosInfo(content:string, pos:number):string {
            var line:number = 1;
            var charPos:number = 1;
            for (var i:number = 0; i < content.length && pos > 0; i++) {
                charPos++;
                if (content.charCodeAt(i) == 13) {
                    if (content.charCodeAt(i + 1) == 10) {
                        i++;
                        pos--;
                    }
                    charPos = 1;
                    line++;
                }
                else if (content.charCodeAt(i + 1) == 10) {
                    if (content.charCodeAt(i) == 13) {
                        i++;
                        pos--;
                    }
                    charPos = 1;
                    line++;
                }
                pos--;
            }
            return "第" + line + "行，第" + charPos + "个字符(后面10个):" + content.slice(charPos, charPos + 10);
        }

        private runProgrammer(id:any, node:any, nodes:any) {
            var common:any = this.commonInfo;
            switch (id) {
                case 1 :
                    node.expval = nodes[0].expval;
                    break;
                case 3 :
                    node.expval = new flower.Stmts();
                    node.expval.addStmt(nodes[0].expval);
                    break;
                case 4 :
                    node.expval = new flower.ExprStmt(nodes[0].expval);
                    break;
                case 5 :
                    node.expval = new flower.DeviceStmt();
                    break;
                case 33 :
                    node.expval = new flower.Expr("Atr", nodes[0].expval);
                    break;
                case 34 :
                case 52 :
                    node.expval = new flower.Expr("int", nodes[0].value);
                    break;
                case 35 :
                case 53 :
                    node.expval = new flower.Expr("0xint", nodes[0].value);
                    break;
                case 36 :
                case 54 :
                    node.expval = new flower.Expr("number", nodes[0].value);
                    break;
                case 37 :
                case 55 :
                    node.expval = new flower.Expr("string", nodes[0].value);
                    break;
                case 42 :
                    node.expval = new flower.ExprAtr();
                    node.expval.addItem(new flower.ExprAtrItem("string", nodes[0].value));
                    break;
                case 38 :
                    node.expval = new flower.Expr("boolean", "true");
                    break;
                case 39 :
                    node.expval = new flower.Expr("boolean", "false");
                    break;
                case 40 :
                    node.expval = new flower.Expr("null");
                    break;
                case 43 :
                    node.expval = new flower.ExprAtr();
                    node.expval.addItem(new flower.ExprAtrItem("id", nodes[0].value.name));
                    break;
                case 44 :
                    node.expval = new flower.ExprAtr();
                    node.expval.addItem(new flower.ExprAtrItem("object", nodes[0].expval));
                    break;
                case 2 :
                    node.expval = nodes[1].expval;
                    node.expval.addStmtAt(nodes[0].expval, 0);
                    break;
                case 6 :
                    node.expval = new flower.Expr("-a", nodes[1].expval);
                    break;
                case 7 :
                    node.expval = new flower.Expr("+a", nodes[1].expval);
                    break;
                case 8 :
                    node.expval = new flower.Expr("!", nodes[1].expval);
                    break;
                case 27 :
                    node.expval = new flower.Expr("~", nodes[1].expval);
                    break;
                case 46 :
                    node.expval = nodes[0].expval;
                    node.expval.addItem(new flower.ExprAtrItem("call", nodes[1].expval));
                    break;
                case 51 :
                    node.expval = new flower.Expr("string", nodes[0].value.name);
                    break;
                case 69 :
                case 47 :
                    node.expval = new flower.ObjectAtr(nodes.length == 2 ? [] : nodes[1].expval);
                    break;
                case 13 :
                    node.expval = new flower.Expr("-", nodes[0].expval, nodes[2].expval);
                    break;
                case 12 :
                    node.expval = new flower.Expr("+", nodes[0].expval, nodes[2].expval);
                    break;
                case 9 :
                    node.expval = new flower.Expr("*", nodes[0].expval, nodes[2].expval);
                    break;
                case 10 :
                    node.expval = new flower.Expr("/", nodes[0].expval, nodes[2].expval);
                    break;
                case 11 :
                    node.expval = new flower.Expr("%", nodes[0].expval, nodes[2].expval);
                    break;
                case 14 :
                    node.expval = new flower.Expr("<<", nodes[0].expval, nodes[2].expval);
                    break;
                case 15 :
                    node.expval = new flower.Expr(">>", nodes[0].expval, nodes[2].expval);
                    break;
                case 16 :
                    node.expval = new flower.Expr("<<<", nodes[0].expval, nodes[2].expval);
                    break;
                case 17 :
                    node.expval = new flower.Expr(">>>", nodes[0].expval, nodes[2].expval);
                    break;
                case 18 :
                    node.expval = new flower.Expr(">", nodes[0].expval, nodes[2].expval);
                    break;
                case 19 :
                    node.expval = new flower.Expr("<", nodes[0].expval, nodes[2].expval);
                    break;
                case 26 :
                    node.expval = new flower.Expr("&", nodes[0].expval, nodes[2].expval);
                    break;
                case 28 :
                    node.expval = new flower.Expr("^", nodes[0].expval, nodes[2].expval);
                    break;
                case 29 :
                    node.expval = new flower.Expr("|", nodes[0].expval, nodes[2].expval);
                    break;
                case 30 :
                    node.expval = new flower.Expr("&&", nodes[0].expval, nodes[2].expval);
                    break;
                case 31 :
                    node.expval = new flower.Expr("||", nodes[0].expval, nodes[2].expval);
                    break;
                case 58 :
                    node.expval = new flower.CallParams();
                    node.expval.addParam(nodes[0].expval);
                    break;
                case 70 :
                case 56 :
                    node.expval = nodes.length == 2 ? new flower.CallParams() : nodes[1].expval;
                    break;
                case 45 :
                    node.expval = nodes[0].expval;
                    node.expval.addItem(new flower.ExprAtrItem(".", nodes[2].value.name));
                    break;
                case 41 :
                    node.expval = new flower.ExprAtr();
                    node.expval.addItem(new flower.ExprAtrItem("()", nodes[1].expval));
                    break;
                case 25 :
                    node.expval = new flower.Expr("!=", nodes[0].expval, nodes[3].expval);
                    break;
                case 20 :
                    node.expval = new flower.Expr(">=", nodes[0].expval, nodes[3].expval);
                    break;
                case 21 :
                    node.expval = new flower.Expr("<=", nodes[0].expval, nodes[3].expval);
                    break;
                case 22 :
                    node.expval = new flower.Expr("==", nodes[0].expval, nodes[3].expval);
                    break;
                case 71 :
                case 57 :
                    node.expval = nodes[2].expval;
                    node.expval.addParamAt(nodes[0].expval, 0);
                    break;
                case 49 :
                    node.expval = [[nodes[0].expval, nodes[2].expval]];
                    break;
                case 24 :
                    node.expval = new flower.Expr("!==", nodes[0].expval, nodes[4].expval);
                    break;
                case 23 :
                    node.expval = new flower.Expr("===", nodes[0].expval, nodes[4].expval);
                    break;
                case 32 :
                    node.expval = new flower.Expr("?:", nodes[0].expval, nodes[2].expval, nodes[4].expval);
                    break;
                case 72 :
                case 48 :
                    node.expval = [[nodes[0].expval, nodes[2].expval]];
                    node.expval = node.expval.concat(nodes.length == 4 ? [null] : nodes[4].expval);
                    break;
            }
        }

    }
}

