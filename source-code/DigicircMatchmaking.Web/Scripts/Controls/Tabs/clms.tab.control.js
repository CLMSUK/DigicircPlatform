var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var JbTabs = /** @class */ (function () {
            function JbTabs() {
                this._defaultOptions = {};
            }
            JbTabs.prototype.setOptions = function (options) {
                this._defaultOptions = options;
            };
            ;
            JbTabs.prototype.$get = function () {
                var _this = this;
                return {
                    getOptions: function () { return _this._defaultOptions; }
                };
            };
            ;
            return JbTabs;
        }());
        function jbTabs($timeout, $interval, ngRadio) {
            return {
                priority: 1001,
                restrict: "AE",
                scope: {},
                link: function ($scope, $element, $attrs, ngModelCtrl) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    var tab = new TabControl({ $target: $element });
                    tab.init();
                    Joove.Common.markDirectiveScopeAsReady($element);
                }
            };
        }
        var TabControl = /** @class */ (function () {
            function TabControl(options) {
                this.$tab = options.$target;
                this.$headerTabs = null;
                this.$tabPages = null;
                this.$tab.addClass("jb-tabs");
            }
            TabControl.prototype.init = function () {
                this.$headerTabs = this.$tab.children("[jb-type='TabHeader']").children("[jb-type='TabHeaderPageTitle']");
                this.$tabPages = this.$tab.children("[jb-type='TabContent']").children("[jb-type='TabPage']");
                for (var i = 0; i < this.$headerTabs.length; i++) {
                    this.$headerTabs.eq(i).attr("data-index", i);
                }
                for (var i = 0; i < this.$tabPages.length; i++) {
                    this.$tabPages.eq(i).attr("data-index", i);
                }
                var self = this;
                this.$headerTabs.on("click", function () {
                    self.showTab($(this));
                });
                this.$tabPages.hide();
                this.showTab(this.$headerTabs.eq(0));
                //this.refreshDimensions();
            };
            TabControl.prototype.refreshDimensions = function (attempt) {
                var _this = this;
                attempt = attempt || 0;
                var $header = this.$tab.children("[jb-type='TabHeader']").eq(0);
                var headerHeight = $header.height();
                var headerWidth = $header.width();
                if (attempt < 20 && headerHeight === 0 || headerWidth === 0) {
                    setTimeout(function () {
                        _this.refreshDimensions(++attempt);
                    }, 100);
                    return;
                }
                this.$tab.children("[jb-type='TabContent']")
                    .css({
                    "min-height": (headerHeight) + "px",
                    "min-width": (headerWidth) + "px",
                });
                if (this.$tab.hasClass("jb-tabs-left") === true || this.$tab.hasClass("jb-tabs-right") === true)
                    return;
                var bodycontainerWidth = $("[jb-type='BodyContainer']").width();
                var totalWidth = 0;
                var $tabs = $header.children("[jb-type='TabHeaderPageTitle']");
                for (var i = 0; i < $tabs.length; i++) {
                    var $thisTab = $tabs.eq(i);
                    totalWidth += $thisTab.width();
                }
                if (totalWidth >= bodycontainerWidth) {
                    $tabs.css({
                        "width": "10%"
                    });
                }
                else {
                    return;
                }
                var maxHeight = 0;
                for (var i = 0; i < $tabs.length; i++) {
                    var $thisTab = $tabs.eq(i);
                    var thisHeight = $thisTab.height();
                    if (thisHeight > maxHeight) {
                        maxHeight = thisHeight;
                    }
                }
                $tabs.children("[jb-type='TabHeaderPageTitleText']")
                    .css({
                    "height": maxHeight + "px"
                });
            };
            TabControl.prototype.showTab = function ($headerTab) {
                if ($headerTab.hasClass("active"))
                    return;
                var index = $headerTab.data("index");
                var $target = this.$tab.children("[jb-type='TabContent']")
                    .children("[jb-type='TabPage'][data-index='" + index + "']");
                this.$headerTabs.removeClass("active");
                $headerTab.addClass("active");
                this.$tabPages.css("opacity", 0).hide();
                for (var i = 0; i < this.$tabPages.length; i++) {
                    window._themeManager.removeControlState(this.$tabPages.eq(i), Joove.ThemeManager.States.Active);
                }
                window._themeManager.setControlState($target, Joove.ThemeManager.States.Active);
                $target.show().animate({ opacity: 1 }, 200);
                //Search for contained datalists inside the tab and refresh their dimension if any
                $target.find("[jb-type='DataList'][jb-id]").each(function (index, element) {
                    var datalistName = $(element).attr("jb-id");
                    var datalistInstance = Joove.Widgets.DataListControl.instancesDic[datalistName];
                    if (datalistInstance != undefined) {
                        datalistInstance.updateDataTableSize();
                    }
                    else {
                        console.log("TAB CONTROL ERROR: Could not find datalist instance for elemnent with jb-id=" + datalistName);
                    }
                });
                setTimeout(function () {
                    $(document).trigger("joove-tab-clicked", $target.attr("jb-id"));
                }, 60);
            };
            return TabControl;
        }());
        angular.module("jbTabs", [])
            .directive('tabset', function () {
            return {
                restrict: 'AE',
                transclude: true,
                scope: {},
                template: "\n<div role=\"tabpanel\">\n  <ul class=\"nav nav-tabs\" role=\"tablist\">\n    <li role=\"presentation\"\n      ng-repeat=\"tab in tabset.tabs\"\n      ng-class=\"{'active': tab.active}\">\n\n      <a href=\"\"\n        role=\"tab\"\n        ng-click=\"tabset.select(tab)\">{{tab.heading}}</a>\n    </li>\n  </ul>\n\n  <ng-transclude>\n  </ng-transclude>\n</div>",
                bindToController: true,
                controllerAs: 'tabset',
                controller: function () {
                    var self = this;
                    self.tabs = [];
                    self.addTab = function addTab(tab) {
                        self.tabs.push(tab);
                        if (self.tabs.length === 1) {
                            tab.active = true;
                        }
                    };
                    self.select = function (selectedTab) {
                        angular.forEach(self.tabs, function (tab) {
                            if (tab.active && tab !== selectedTab) {
                                tab.active = false;
                            }
                        });
                        selectedTab.active = true;
                    };
                }
            };
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
                link: function (scope, elem, attr, tabsetCtrl) {
                    scope.active = false;
                    tabsetCtrl.addTab(scope);
                }
            };
        })
            .provider("jbTabs", new JbTabs())
            .directive("jbTabs", ["$timeout", "$interval", "jbTabs", jbTabs]);
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
