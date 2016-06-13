module flower {
    export class StringDo {
        public static changeStringToInner = function (content:string) {
            var len = content.length;
            for(var i = 0; i < len; i++) {
                if(content.charAt(i) == "\t") {
                    content = content.slice(0,i) + "\\t" + content.slice(i+1,len);
                    i++;
                    len++;
                } else if(content.charAt(i) == "\n") {
                    content = content.slice(0,i) + "\\n" + content.slice(i+1,len);
                    i++;
                    len++;
                } else if(content.charAt(i) == "\r") {
                    content = content.slice(0,i) + "\\r" + content.slice(i+1,len);
                    i++;
                    len++;
                } else if(content.charAt(i) == "\"") {
                    content = content.slice(0,i) + "\\\"" + content.slice(i+1,len);
                    i++;
                    len++;
                }
            }
            return content;
        }
    }
}