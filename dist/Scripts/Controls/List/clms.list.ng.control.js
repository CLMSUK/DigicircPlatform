var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var JbList = /** @class */ (function (_super) {
            __extends(JbList, _super);
            function JbList() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JbList;
        }(Joove.BaseAngularProvider));
        function jbList($timeout, $interval, ngRadio) {
            return {
                priority: 1001,
                restrict: "AE",
                link: function ($scope, $element, $attrs, ngModelCtrl) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    Joove.Common.setDirectiveScope($element, $scope);
                    $element.addClass("list-enabled");
                    $scope.selectedItems = [];
                    $scope.selectedItemKeys = [];
                    $scope.fullRecordsetIsSelected = false;
                    $scope.requestSelectedItemsfromServer = false;
                    $scope.itemDataType = Joove.Common.replaceAll($element.attr("ng-datatype"), "'", "");
                    var options = Joove.Common.toJson($element.data("options"));
                    function startList() {
                        if ($("body:visible").length === 0) {
                            setTimeout(startList, 20);
                            return;
                        }
                        var list = new Widgets.ListControl();
                        list.init($element.get(0), options);
                        Joove.Common.markDirectiveScopeAsReady($element);
                    }
                    startList();
                }
            };
        }
        angular
            .module("jbList", [])
            .provider("jbList", new JbList())
            .directive("jbList", ["$timeout", "$interval", "jbList", jbList]);
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
