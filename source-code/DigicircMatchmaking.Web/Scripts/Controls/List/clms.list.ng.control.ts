﻿namespace Joove.Widgets {
    class JbList extends BaseAngularProvider {
    }

    interface IJbListScope extends IJooveScope {
        selectedItems: typeof undefined[];
        selectedItemKeys: typeof undefined[];
        fullRecordsetIsSelected: boolean;
        requestSelectedItemsfromServer: boolean;
        itemDataType: string;
    }

    function jbList($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            link: ($scope: IJbListScope, $element: JQuery, $attrs, ngModelCtrl) => {
                if (Common.directiveScopeIsReady($element)) return;

                Common.setDirectiveScope($element, $scope);

                $element.addClass("list-enabled");

                $scope.selectedItems = [];
                $scope.selectedItemKeys = [];
                $scope.fullRecordsetIsSelected = false;
                $scope.requestSelectedItemsfromServer = false;
                $scope.itemDataType = Joove.Common.replaceAll($element.attr("ng-datatype"), "'", "");

                var options: IListControlOptions = Common.toJson($element.data("options")) as any;

                function startList() {
                    if ($("body:visible").length === 0) {
                        setTimeout(startList, 20);
                        return;
                    }
                    const list = new ListControl();
                    list.init($element.get(0), options);

                    Common.markDirectiveScopeAsReady($element);
                }

                startList();
            }
        };
    }

    angular
        .module("jbList", [])
        .provider("jbList", new JbList())
        .directive("jbList", ["$timeout", "$interval", "jbList", jbList]);
}