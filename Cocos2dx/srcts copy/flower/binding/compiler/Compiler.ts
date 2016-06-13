module flower {
	export class Compiler {
		private _scanner:flower.Scanner;
		private _parser:flower.Parser;

		public constructor()
		{
			this._scanner = new flower.Scanner();
			this._parser = new flower.Parser();
		}

		public parserExpr(content:string,checks:Array<any>,objects:any,classes:any,result:Array<any>):flower.Stmts
		{
			var scanner:flower.Scanner = new flower.Scanner();
			var common:any = {"content":content,"objects":objects,"classes":classes,"checks":checks,"ids":{},"tokenValue":null,"scanner":this._scanner,"nodeStack":null,bindList:new Array<string>()};
			this._scanner.setCommonInfo(common);
			this._parser.setCommonInfo(common);
			this._parser.parser(content);
			if(common.parserError) {
				return null;
			}
			common.result = result;
			common.expr = common.newNode.expval;
			common.expr.checkPropertyBinding(common);
			return common.expr;
		}

		public static ist:flower.Compiler;
		public static parserExpr(content:string,checks:Array<any>,objects:any,classes:any,result:Array<any>):flower.Stmts
		{
			if(!flower.Compiler.ist)
			{
				flower.Compiler.ist = new flower.Compiler();
			}
			return flower.Compiler.ist.parserExpr(content,checks,objects,classes,result);
		}

	}
}

