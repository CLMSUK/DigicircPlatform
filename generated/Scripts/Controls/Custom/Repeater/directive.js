
angular
.module('Repeater', [])
.provider('Repeater', function () {
    var default_options = {};

    this.setOptions = function (options) {
        default_options = options;
    };

    this.$get = function () {
        return {
getOptions:
            function () {
                return default_options;
            }
        };
    };
})
.directive('repeaterdirectiva', [
               '$timeout',
               '$parse',
               '$compile',
function ($timeout, $parse, $compile) {
    return {
scope: {
ngcustomcollection: '='
        },
link:
        function (scope, elm, attrs) {
            var _currentScope = scope.$parent;
            var controlName = elm.attr("jb-id");
            var options = JSON.parse(attrs.repeateroptions);

            var properties = {
Collection:
                _currentScope.$eval(attrs.ngcustomcollection),

            };

            var context = {
CollectionChanged:
                function (newValue) {
                    var boundAttr = attrs.ngcustomcollection;
                    var current = _currentScope.$eval(boundAttr) || "";

                    if (_currentScope.$eval(boundAttr) == newValue) {
                        return;
                    }

                    $parse(boundAttr).assign(_currentScope, newValue);
                    if(!_currentScope.$$phase) {
                        _currentScope.$apply();
                    }
                },

            };

            var control = new RepeaterCustomControl(elm.get(0), properties, context);
            control.init();

            _currentScope.$watch(attrs.ngcustomcollection, function(value) {
                control.CollectionChanged(value || "", context);
            });

        }
    }
}
           ]);
