namespace Joove.Widgets {
 
    class ValidationUiProvider extends BaseAngularProvider {
    }
 
    export interface IValidationUiScope extends IJooveScope {
        _showDvPanel: boolean;
        _dvSummaryVisible: boolean;
        show: () => void;
        hide: () => void;
        headingSigular: string;
        headingPlural: string;
    }

    export class ValidationPanelAngular {
        public init(rootElementSelector: string) {            
            var $rootElement = $(rootElementSelector);
                                   
            if ($rootElement.length === 0) {
                setTimeout(() => {
                    this.init(rootElementSelector);
                }, 500);
                return;
            }
            
            var $html = $(`<div class="dv-panel-root" jb-validation-ui></div>`);            
            $rootElement.append($html);
                              
            angular.element($rootElement)
                .injector()
                .invoke([
                    "$compile", "$rootScope", ($compile) => {                            
                        $compile($html)(window.$form);                        
                    }
                ]);            
        }        
    }
   
    function jbValidationUi($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, $compile: any, joovegrid): ng.IDirective {
        var defaultOptions = joovegrid.getOptions();

        return {
            priority: 1001,
            templateUrl: window._context.siteRoot + 'Scripts/Controls/ValidationPanel/clms.validation.ui.html',            
            restrict: "AE",
            scope: true,
            link: ($scope: IValidationUiScope, $attrs: any) => {
                Validation.UiHelper.panelScope = $scope;
                $scope.headingPlural = window._resourcesManager.getGlobalResource("RES_WEBFORM_VALIDATIONS_RequireYourAttention");
                $scope.headingSingular = window._resourcesManager.getGlobalResource("RES_WEBFORM_VALIDATIONS_RequireYourAttentionSingular");

                $scope.show = () => {
                    $scope._showDvPanel = true;
                    Joove.Core.applyScope($scope);
                }

                $scope.hide = () => {
                    $scope._dvSummaryVisible = false;
                    $scope._showDvPanel = false;
                }

                $scope.navigateToControl = (entry: Joove.Validation.BindingEntry, e: Event) => {
                    e.stopPropagation();
                    Joove.Validation.UiHelper.navigateToRelatedControl(entry);
                }
            }            
        };
    }

    angular
        .module("jbValidationUi", [])
        .provider("jbValidationUi", new ValidationUiProvider())
        .directive("jbValidationUi",
        [
            "$timeout",
            "$interval",
            "$compile",
            "jbValidationUi",
            jbValidationUi
        ]);

}