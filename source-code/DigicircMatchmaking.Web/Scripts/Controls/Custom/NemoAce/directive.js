
angular
.module('NemoAce', [])
.provider('NemoAce', function () {
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
.directive('nemoacedirectiva', [
               '$timeout',
               '$parse',
               '$compile',
function ($timeout, $parse, $compile) {
    return {
scope: {
ngcustomvalue: '='
        },
link:
        function (scope, elm, attrs) {
            var _currentScope = scope.$parent;
            var controlName = elm.attr("jb-id");
            var options = JSON.parse(attrs.nemoaceoptions);

            var properties = {
Language:
options.Language,Theme:
options.Theme,Value:
                _currentScope.$eval(attrs.ngcustomvalue),

            };

            var context = {
ValueChanged:
                function (newValue) {
                    var boundAttr = attrs.ngcustomvalue;
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

            var control = new NemoAceCustomControl(elm.get(0), properties, context);
            control.init();

            _currentScope.$watch(attrs.ngcustomvalue, function(value) {
                control.ValueChanged(value || "", context);
            });

        }
    }
}
           ]);
