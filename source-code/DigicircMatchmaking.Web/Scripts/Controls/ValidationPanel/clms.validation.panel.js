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
        var ValidationUiProvider = /** @class */ (function (_super) {
            __extends(ValidationUiProvider, _super);
            function ValidationUiProvider() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ValidationUiProvider;
        }(Joove.BaseAngularProvider));
        var ValidationPanelAngular = /** @class */ (function () {
            function ValidationPanelAngular() {
            }
            ValidationPanelAngular.prototype.init = function (rootElementSelector) {
                var _this = this;
                var $rootElement = $(rootElementSelector);
                if ($rootElement.length === 0) {
                    setTimeout(function () {
                        _this.init(rootElementSelector);
                    }, 500);
                    return;
                }
                var $html = $("<div class=\"dv-panel-root\" jb-validation-ui></div>");
                $rootElement.append($html);
                angular.element($rootElement)
                    .injector()
                    .invoke([
                    "$compile", "$rootScope",
                    function ($compile) {
                        $compile($html)(window.$form);
                    }
                ]);
            };
            return ValidationPanelAngular;
        }());
        Widgets.ValidationPanelAngular = ValidationPanelAngular;
        function jbValidationUi($timeout, $interval, $compile, joovegrid) {
            var defaultOptions = joovegrid.getOptions();
            return {
                priority: 1001,
                templateUrl: window._context.siteRoot + 'Scripts/Controls/ValidationPanel/clms.validation.ui.html',
                restrict: "AE",
                scope: true,
                link: function ($scope, $attrs) {
                    Joove.Validation.UiHelper.panelScope = $scope;
                    $scope.headingPlural = window._resourcesManager.getGlobalResource("RES_WEBFORM_VALIDATIONS_RequireYourAttention");
                    $scope.headingSingular = window._resourcesManager.getGlobalResource("RES_WEBFORM_VALIDATIONS_RequireYourAttentionSingular");
                    $scope.show = function () {
                        $scope._showDvPanel = true;
                        Joove.Core.applyScope($scope);
                    };
                    $scope.hide = function () {
                        $scope._dvSummaryVisible = false;
                        $scope._showDvPanel = false;
                    };
                    $scope.navigateToControl = function (entry, e) {
                        e.stopPropagation();
                        Joove.Validation.UiHelper.navigateToRelatedControl(entry);
                    };
                }
            };
        }
        angular
            .module("jbValidationUi", [])
            .provider("jbValidationUi", new ValidationUiProvider())
            .directive("jbValidationUi", [
            "$timeout",
            "$interval",
            "$compile",
            "jbValidationUi",
            jbValidationUi
        ]);
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
