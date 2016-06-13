module flower {
    export class ListBase extends DataGroup {

        public constructor() {
            super();
            this.requireSelection = true;
            this.itemClickedEnabled = true;
            this.itemSelectedEnabled = true;
        }
    }
}