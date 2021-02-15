var Joove;
(function (Joove) {
    var ViewModelMerger = /** @class */ (function () {
        function ViewModelMerger() {
            this._seen = [];
        }
        /**
         * @param clientModel
         * @param serverModel
         */
        ViewModelMerger.prototype.merge = function (clientModel, serverModel) {
            if (this._seen.indexOf(clientModel) !== -1) {
                return clientModel;
            }
            this._seen.push(clientModel);
            if (!Joove.Common.valueIsObject(clientModel)) {
            }
            else {
                if (Object.prototype.toString.apply(clientModel) === "[object Array]") {
                }
                else {
                }
            }
        };
        return ViewModelMerger;
    }()); /* end class ViewModelMerger*/
    Joove.ViewModelMerger = ViewModelMerger;
})(Joove || (Joove = {})); /* end Joove namespace */
