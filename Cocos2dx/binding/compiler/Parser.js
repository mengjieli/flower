class Parser {
    action;
    go;
    commonInfo;

    constructor() {
        this.action = ParserTable.action;
        this.go = ParserTable.go;
        this.commonInfo = null;
    }

    setCommonInfo(info) {
        this.commonInfo = info;
        this.commonInfo.tokenCount = 0;
    }

    parser(content) {
        var commonInfo = this.commonInfo;
        var scanner = this.commonInfo.scanner;
        scanner.setTokenContent(content);
        var token;
        commonInfo.lastTokenPos = 0;
        token = scanner.getNextToken();
        var newNode = {"type": "leaf", "token": token, "value": commonInfo.tokenValue};
        if (TokenType.TokenTrans[token])
            token = commonInfo.tokenValue;
        commonInfo.tokenCount++;
        if (token == null) {
            return null;
        }
        var state = 1;
        var stack = [state];
        var nodeStack = [];
        commonInfo.nodeStack = nodeStack;
        var i;
        var action;
        var popNodes;
        var commonDebug = {"file": content};
        while (true) {
            if (this.action[state][token] == undefined) {
                flower.sys.$error(3008, content, this.getFilePosInfo(content, commonInfo.lastTokenPos));
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
                commonInfo.lastTokenPos = commonInfo.tokenPos;
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
                if (TokenType.TokenTrans[token])
                    token = commonInfo.tokenValue;
            }
        }
        return true;
    }

    getFilePosInfo(content, pos) {
        var line = 1;
        var charPos = 1;
        for (var i = 0; i < content.length && pos > 0; i++) {
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

    runProgrammer(id, node, nodes) {
        var common = this.commonInfo;
        switch (id){
            case 1: node.expval = nodes[0].expval;break;
            case 3: node.expval = new Stmts();node.expval.addStmt(nodes[0].expval);break;
            case 4: node.expval = new ExprStmt(nodes[0].expval);break;
            case 5: node.expval = new DeviceStmt();break;
            case 46: node.expval = new Expr("Atr",nodes[0].expval);break;
            case 47:
            case 67: node.expval = new Expr("int",nodes[0].value);break;
            case 48:
            case 68: node.expval = new Expr("0xint",nodes[0].value);break;
            case 49:
            case 69: node.expval = new Expr("number",nodes[0].value);break;
            case 50:
            case 70: node.expval = new Expr("string",nodes[0].value);break;
            case 55: node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("string",nodes[0].value));break;
            case 51: node.expval = new Expr("boolean","true");break;
            case 52: node.expval = new Expr("boolean","false");break;
            case 53: node.expval = new Expr("null");break;
            case 56: node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("id",nodes[0].value.name));break;
            case 57: node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("object",nodes[0].expval));break;
            case 2: node.expval = nodes[1].expval;node.expval.addStmtAt(nodes[0].expval,0);break;
            case 6: node.expval = new Expr("-a",nodes[1].expval);break;
            case 7: node.expval = new Expr("+a",nodes[1].expval);break;
            case 8: node.expval = new Expr("!",nodes[1].expval);break;
            case 27: node.expval = new Expr("~",nodes[1].expval);break;
            case 60: node.expval = nodes[0].expval;node.expval.addItem(new ExprAtrItem("call",nodes[1].expval));break;
            case 61: node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("id",nodes[1].value.name,true));break;
            case 66: node.expval = new Expr("string",nodes[0].value.name);break;
            case 84:
            case 62: node.expval = new ObjectAtr(nodes.length==2?[]:nodes[1].expval);break;
            case 13: node.expval = new Expr("-",nodes[0].expval,nodes[2].expval);break;
            case 12: node.expval = new Expr("+",nodes[0].expval,nodes[2].expval);break;
            case 9: node.expval = new Expr("*",nodes[0].expval,nodes[2].expval);break;
            case 10: node.expval = new Expr("/",nodes[0].expval,nodes[2].expval);break;
            case 11: node.expval = new Expr("%",nodes[0].expval,nodes[2].expval);break;
            case 14: node.expval = new Expr("<<",nodes[0].expval,nodes[2].expval);break;
            case 15: node.expval = new Expr(">>",nodes[0].expval,nodes[2].expval);break;
            case 16: node.expval = new Expr("<<<",nodes[0].expval,nodes[2].expval);break;
            case 17: node.expval = new Expr(">>>",nodes[0].expval,nodes[2].expval);break;
            case 18: node.expval = new Expr(">",nodes[0].expval,nodes[2].expval);break;
            case 19: node.expval = new Expr("<",nodes[0].expval,nodes[2].expval);break;
            case 32: node.expval = new Expr("=",nodes[0].expval,nodes[2].expval);break;
            case 26: node.expval = new Expr("&",nodes[0].expval,nodes[2].expval);break;
            case 28: node.expval = new Expr("^",nodes[0].expval,nodes[2].expval);break;
            case 29: node.expval = new Expr("|",nodes[0].expval,nodes[2].expval);break;
            case 30: node.expval = new Expr("&&",nodes[0].expval,nodes[2].expval);break;
            case 31: node.expval = new Expr("||",nodes[0].expval,nodes[2].expval);break;
            case 54: node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("()",nodes[1].expval));break;
            case 73: node.expval = new CallParams();node.expval.addParam(nodes[0].expval);break;
            case 85:
            case 71: node.expval = nodes.length==2?new CallParams():nodes[1].expval;break;
            case 58: node.expval = nodes[0].expval;node.expval.addItem(new ExprAtrItem(".",nodes[2].value.name));break;
            case 38: node.expval = new Expr("-=",nodes[0].expval,nodes[3].expval);break;
            case 37: node.expval = new Expr("+=",nodes[0].expval,nodes[3].expval);break;
            case 25: node.expval = new Expr("!=",nodes[0].expval,nodes[3].expval);break;
            case 33: node.expval = new Expr("*=",nodes[0].expval,nodes[3].expval);break;
            case 34: node.expval = new Expr("/=",nodes[0].expval,nodes[3].expval);break;
            case 35: node.expval = new Expr("%=",nodes[0].expval,nodes[3].expval);break;
            case 40: node.expval = new Expr("<<=",nodes[0].expval,nodes[3].expval);break;
            case 41: node.expval = new Expr(">>=",nodes[0].expval,nodes[3].expval);break;
            case 20: node.expval = new Expr(">=",nodes[0].expval,nodes[3].expval);break;
            case 21: node.expval = new Expr("<=",nodes[0].expval,nodes[3].expval);break;
            case 22: node.expval = new Expr("==",nodes[0].expval,nodes[3].expval);break;
            case 36: node.expval = new Expr("&=",nodes[0].expval,nodes[3].expval);break;
            case 42: node.expval = new Expr("^=",nodes[0].expval,nodes[3].expval);break;
            case 43: node.expval = new Expr("|=",nodes[0].expval,nodes[3].expval);break;
            case 39: node.expval = new Expr("||=",nodes[0].expval,nodes[3].expval);break;
            case 86:
            case 72: node.expval = nodes[2].expval;node.expval.addParamAt(nodes[0].expval,0);break;
            case 59: node.expval = nodes[0].expval;node.expval.addItem(new ExprAtrItem(".",nodes[3].value.name,true));break;
            case 64: node.expval = [[nodes[0].expval,nodes[2].expval]];break;
            case 24: node.expval = new Expr("!==",nodes[0].expval,nodes[4].expval);break;
            case 23: node.expval = new Expr("===",nodes[0].expval,nodes[4].expval);break;
            case 44: node.expval = new Expr("?:",nodes[0].expval,nodes[2].expval,nodes[4].expval);break;
            case 87:
            case 63: node.expval = [[nodes[0].expval,nodes[2].expval]];node.expval = node.expval.concat(nodes.length==4?[null]:nodes[4].expval);break;
            case 45: node.expval = new Expr("spfor",nodes[2].expval,nodes[4].expval);break;
        }
    }

}