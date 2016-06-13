module flower {
    export class FlowerData {

        public constructor() {

        }

        public init() {

            flower.Binding.addBindingCheck(DataManager.ist);
            flower.Binding.addBindingCheck(flower.Formula);

            DataManager.ist.addDefine({
                "name": "Size",
                "members": {
                    "width": {"type": "int"},
                    "height": {"type": "int"}
                }
            });
            DataManager.ist.addDefine({
                "name": "Point",
                "members": {
                    "x": {"type": "int"},
                    "y": {"type": "int"}
                }
            });
            DataManager.ist.addDefine({
                "name": "Rectangle",
                "members": {
                    "x": {"type": "int"},
                    "y": {"type": "int"},
                    "width": {"type": "int"},
                    "height": {"type": "int"}
                }
            });

            DataManager.ist.addDefine({
                "name": "Flower",
                "members": {
                    "system": {"type": "Flower.System"},
                }
            });
            DataManager.ist.addDefine({
                "name": "Flower.System",
                "members": {
                    "screen": {"type": "Size"},
                }
            });
            DataManager.ist.addRootData("flower", "Flower");
        }

        public static ist = new FlowerData();
    }
}