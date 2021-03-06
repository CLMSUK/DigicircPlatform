
angular
.module('Ul', [])
.provider('Ul', function () {
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
.directive('uldirectiva', [
               '$timeout',
               '$parse',
               '$compile',
function ($timeout, $parse, $compile) {
    return {
scope: {

        },
link:
        function (scope, elm, attrs) {
            var _currentScope = scope.$parent;
            var controlName = elm.attr("jb-id");
            var options = JSON.parse(attrs.uloptions);

            var properties = {
ListType:
                options.ListType,
            };

            var context = {

            };

            var control = new UlCustomControl(elm.get(0), properties, context);
            control.init();


        }
    }
}
           ]);
