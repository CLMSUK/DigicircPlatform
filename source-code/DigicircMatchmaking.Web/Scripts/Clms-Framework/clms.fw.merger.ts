namespace Joove {

    export class ViewModelMerger {
        private _seen = [];


        /**
         * @param clientModel 
         * @param serverModel
         */
        public merge(clientModel: any, serverModel: any): any {
            if (this._seen.indexOf(clientModel) !== -1) {
                return clientModel;
            }
            this._seen.push(clientModel);

            if (!Common.valueIsObject(clientModel)) {

            } else {
                if (Object.prototype.toString.apply(clientModel) === "[object Array]") {               
                }
                else {
                    
                }

            }

        }
    } /* end class ViewModelMerger*/
} /* end Joove namespace */
