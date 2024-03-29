namespace Joove.Widgets {

    class JbTabs implements angular.IServiceProvider {
        private _defaultOptions = {};

        setOptions(options: any) {
            this._defaultOptions = options;
        };

        $get(): any {
            return {
                getOptions: () => this._defaultOptions
            };
        };
    }

    function jbTabs($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            scope: {

            },
            link: ($scope, $element, $attrs, ngModelCtrl) => {
                if (Common.directiveScopeIsReady($element)) return;

                var tab = new TabControl({ $target: $element });
                tab.init();

                Common.markDirectiveScopeAsReady($element);
            }
        };
    }

    class TabControl {
        $tab;
        $headerTabs;
        $tabPages;

        constructor(options) {
            this.$tab = options.$target;
            this.$headerTabs = null;
            this.$tabPages = null;
            this.$tab.addClass("jb-tabs");
        }

        init(): void {
            this.$headerTabs = this.$tab.children("[jb-type='TabHeader']").children("[jb-type='TabHeaderPageTitle']");
            this.$tabPages = this.$tab.children("[jb-type='TabContent']").children("[jb-type='TabPage']");

            for (let i = 0; i < this.$headerTabs.length; i++) {
                this.$headerTabs.eq(i).attr("data-index", i);
            }

            for (let i = 0; i < this.$tabPages.length; i++) {
                this.$tabPages.eq(i).attr("data-index", i);
            }
            var self = this;
            this.$headerTabs.on("click",
                function () { // Don't use lambda function here.
                    self.showTab($(this));
                });

            this.$tabPages.hide();
            this.showTab(this.$headerTabs.eq(0));

            //this.refreshDimensions();
        }

        refreshDimensions(attempt?: number): void {
            attempt = attempt || 0;

            const $header = this.$tab.children("[jb-type='TabHeader']").eq(0);
            const headerHeight = $header.height();
            const headerWidth = $header.width();

            if (attempt < 20 && headerHeight === 0 || headerWidth === 0) {
                setTimeout(() => {
                    this.refreshDimensions(++attempt);
                },
                    100);
                return;
            }

            this.$tab.children("[jb-type='TabContent']")
                .css({
                    "min-height": (headerHeight) + "px",
                    "min-width": (headerWidth) + "px",
                });

            if (this.$tab.hasClass("jb-tabs-left") === true || this.$tab.hasClass("jb-tabs-right") === true) return;

            const bodycontainerWidth = $("[jb-type='BodyContainer']").width();
            let totalWidth = 0;

            const $tabs = $header.children("[jb-type='TabHeaderPageTitle']");

            for (let i = 0; i < $tabs.length; i++) {
                const $thisTab = $tabs.eq(i);
                totalWidth += $thisTab.width();
            }

            if (totalWidth >= bodycontainerWidth) {
                $tabs.css({
                    "width": "10%"
                });
            } else {
                return;
            }

            let maxHeight = 0;
            for (let i = 0; i < $tabs.length; i++) {
                const $thisTab = $tabs.eq(i);
                const thisHeight = $thisTab.height();

                if (thisHeight > maxHeight) {
                    maxHeight = thisHeight;
                }
            }

            $tabs.children("[jb-type='TabHeaderPageTitleText']")
                .css({
                    "height": maxHeight + "px"
                });
        }

        showTab($headerTab: JQuery): void {
            if ($headerTab.hasClass("active")) return;

            const index = $headerTab.data("index");
            const $target = this.$tab.children("[jb-type='TabContent']")
                .children(`[jb-type='TabPage'][data-index='${index}']`);

            this.$headerTabs.removeClass("active");
            $headerTab.addClass("active");

            this.$tabPages.css("opacity", 0).hide();

            for (let i = 0; i < this.$tabPages.length; i++) {
                window._themeManager.removeControlState(this.$tabPages.eq(i), ThemeManager.States.Active);
            }

            window._themeManager.setControlState($target, ThemeManager.States.Active);

            $target.show().animate({ opacity: 1 }, 200);
            //Search for contained datalists inside the tab and refresh their dimension if any
            $target.find("[jb-type='DataList'][jb-id]").each((index, element) => {
                const datalistName = $(element).attr("jb-id");
                const datalistInstance = Joove.Widgets.DataListControl.instancesDic[datalistName];
                if (datalistInstance != undefined) {
                    datalistInstance.updateDataTableSize();
                } else {
                    console.log("TAB CONTROL ERROR: Could not find datalist instance for elemnent with jb-id=" + datalistName);
                }
            });

            setTimeout(() => {
                $(document).trigger("joove-tab-clicked", $target.attr("jb-id"));             
            }, 60);
        }
    }

    angular.module("jbTabs", [])
        .directive('tabset', function () {
            return {
                restrict: 'AE',
                transclude: true,
                scope: {},
                template: `
<div role="tabpanel">
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation"
      ng-repeat="tab in tabset.tabs"
      ng-class="{'active': tab.active}">

      <a href=""
        role="tab"
        ng-click="tabset.select(tab)">{{tab.heading}}</a>
    </li>
  </ul>

  <ng-transclude>
  </ng-transclude>
</div>`,
                bindToController: true,
                controllerAs: 'tabset',
                controller: function () {
                    var self = this;
                    self.tabs = [];

                    self.addTab = function addTab(tab) {
                        self.tabs.push(tab);

                        if (self.tabs.length === 1) {
                            tab.active = true
                        }
                    }

                    self.select = function (selectedTab) {
                        angular.forEach(self.tabs, function (tab) {
                            if (tab.active && tab !== selectedTab) {
                                tab.active = false;
                            }
                        })

                        selectedTab.active = true;
                    }
                }
            }
        })
        .directive('tab', function () {
            return {
                restrict: 'AE',
                transclude: true,
                template: '<div role="tabpanel" ng-if="active" ng-transclude></div>',
                require: '^tabset',
                scope: {
                    heading: '@'
                },
                link: function (scope, elem, attr, tabsetCtrl: any) {
                    scope.active = false
                    tabsetCtrl.addTab(scope)
                }
            }
        })
        .provider("jbTabs", new JbTabs())
        .directive("jbTabs", ["$timeout", "$interval", "jbTabs", jbTabs]);

}