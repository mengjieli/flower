module flower {
    export class ImagePlugin {

        private static plugins:Array<flower.IImagePlugin> = [];
        private static pluginsName:Array<string> = [];
        private static pluginsEnd:Object = {};

        public static registerPlugin = function (name:string, ends:Array<string>, plugin:flower.IImagePlugin) {
            ImagePlugin.pluginsName.push(name);
            ImagePlugin.plugins.push(plugin);
            for(var i = 0; i < ends.length; i++) {
                ImagePlugin.pluginsEnd[ends[i]] = plugin;
            }
        }

        public static getPlugin(end:string, name:string = null):flower.IImagePlugin {
            var plugin:IImagePlugin;
            if (name) {
                for (var i = 0; i < ImagePlugin.pluginsName.length; i++) {
                    if (ImagePlugin.pluginsName[i] == name) {
                        plugin = ImagePlugin.plugins[i];
                        break;
                    }
                }
            } else {
                plugin = ImagePlugin.pluginsEnd[end];
            }
            return plugin;
        }
    }
}