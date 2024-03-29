namespace Joove.Widgets {

    class JbProgress extends BaseAngularProvider {
    }

    interface IJbProgressScope extends IJooveScope {        
        init: () => void;
        $showPercentage: boolean;
        $min: number;
        $max: number;
        $colorize: boolean;
        $invertColors: boolean;
        $innerBar: JQuery;
        $percentageLabel: JQuery;
        model: number;  
    }

    function jbProgress($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {
                model: "=ngModel",
                $showPercentage: "=?jbShowPercentage",                
                $min: "=jbMin",                
                $max: "=jbMax",  
                $colorize: "=?jbColorize",
                $invertColors: "=?jbInverted",
            },
            link($scope: IJbProgressScope, $element: JQuery, $attrs, ngModelCtrl) {
                if (Common.directiveScopeIsReady($element)) return;

                var classesForColors = [
                    "progress-bar-danger",
                    "progress-bar-warning",
                    "progress-bar-info",
                    "progress-bar-normal",
                    "progress-bar-success",
                ];
                
                $scope.init = () => {
                    $scope.$colorize = $scope.$colorize || false;
                    $scope.$showPercentage = $scope.$showPercentage || false;
                    $scope.$invertColors = $scope.$invertColors || false;

                    $element.addClass("progress");
                    $scope.$innerBar = $element.find(".inner-bar");
                    $scope.$percentageLabel = $("<span class='percentage'><span>");

                    $scope.$innerBar.addClass("progress-bar");

                    if ($scope.$showPercentage == true) {
                        $scope.$innerBar.append($scope.$percentageLabel);
                    }

                    if ($scope.$invertColors == true) {
                        classesForColors.reverse();
                    }
                    
                    updateBar($scope.model);
                }
                
                $scope.init();

                $scope.$watch("model", (newValue: number, oldValue: number) => {
                    if (newValue == oldValue) return;

                    updateBar(newValue);
                });

                function updateBar(value: number) {
                    if (value == null || isNaN(value)) {
                        value = 0;
                    }
                    else {
                        value = parseFloat(value.toString());
                    }

                    var range = $scope.$max - $scope.$min;
                    var actualProgress = value - $scope.$min;

                    var percentage = (actualProgress / range) * 100;
                   
                    if (percentage < 0) {
                        percentage = 0;
                    }

                    if (percentage > 100) {
                        percentage = 100;
                    }

                    var percentageStr = percentage.toFixed(0) + "%";

                    $scope.$innerBar.css("width", percentageStr);

                    if ($scope.$showPercentage == true) {
                        $scope.$percentageLabel.text(percentageStr);
                    }

                    if ($scope.$colorize == false) return;
                                      
                    for (let i = 0; i < classesForColors.length; i++) {
                        $scope.$innerBar.removeClass(classesForColors[i]);
                    }

                    var cls = "";

                    if (percentage < 20) {
                        cls = classesForColors[0];
                    }
                    else if (percentage < 35) {
                        cls = classesForColors[1];
                    }
                    else if (percentage < 50) {
                        cls = classesForColors[2];
                    }
                    else if (percentage < 80) {
                        cls = classesForColors[3];
                    }
                    else {
                        cls = classesForColors[4];
                    }
                  
                    $scope.$innerBar.addClass(cls);

                }

                Common.markDirectiveScopeAsReady($element);
            }
        };
    }

    angular
        .module("jbProgress", [])
        .provider("jbProgress", new JbProgress())
        .directive("jbProgress", ["$timeout", "$interval", "jbProgress", jbProgress]);

}