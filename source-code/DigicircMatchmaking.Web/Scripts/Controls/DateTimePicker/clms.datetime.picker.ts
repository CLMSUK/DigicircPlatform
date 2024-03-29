namespace Joove.Widgets {

    export class DatePicker {
        static getFormatOfDate(format, withTime?) {
            const defaultDateFormat = "DD/MM/YYYY";
            const defaultTimeFormat = "h:mm";
            const formatToUse = format == null || format.trim() === "" ? defaultDateFormat : format;

            return withTime === true
                ? formatToUse + " " + defaultTimeFormat
                : formatToUse;
        }

        static convertElementToDatePicker($el, format) {
            $el.datetimepicker({                      
                format: DatePicker.getFormatOfDate(format),
                timepicker: false,
                datepicker: true
            });
        }
    }

    class JbDatepicker extends BaseAngularProvider {
    }

    interface IJbDatepickerScope extends IJooveScope {
        timeFormat: string;
        dateFormat: string;
        monthFormat: string;
        timePicker;
        datePicker;
        monthPicker;
        onChangeDateTime: any;
		contextModel: any;
        contextParents: Array<any>;
        calendarPickerHidden: boolean;
    }

    function jbDatepicker($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            require: "?ngModel",
            restrict: "AE",
            scope: {
                model: "=ngTarget",
                timePicker: "=ngTimepicker",
                datePicker: "=ngDatepicker",
                monthPicker: "=ngMonthpicker",
                timeFormat: "=ngTimeformat",
                dateFormat: "=ngDateformat", 
                monthFormat: "=ngMonthformat", 
                allowTyping: "=ngAllowtyping",
                onChangeDateTime: "=jbChangeDateTime",
                contextModel: "=?jbContextModel",
                contextParents: "=?jbContextParents"				
            },
            link: ($scope: IJbDatepickerScope, $element: JQuery, $attrs, ngModelCtrl) => {
                if (Common.directiveScopeIsReady($element)) return;

                // Init plug in
                configurePlugIn();

                var offTheRecord = false;
                var defaultTimeFormat = "h:mm";
                var defaultDateFormat = "DD/MM/YYYY";
                const defaultMonthFormat = "MM/YYΥΥ";

                var monthFormat = $scope.monthFormat === "DEFAULT" || $scope.monthFormat === "" || $scope.monthFormat == null
                    ? defaultMonthFormat
                    : $scope.monthFormat;

                var timeFormat = $scope.timeFormat === "DEFAULT" || $scope.timeFormat === ""
                    ? defaultTimeFormat
                    : $scope.timeFormat;

                var dateFormat = $scope.dateFormat === "DEFAULT" || $scope.dateFormat === ""
                    ? defaultDateFormat
                    : $scope.dateFormat;

				if($scope.monthPicker === true){
					dateFormat = $scope.monthFormat;
				}

                $scope.$watch("model",
                    value => {       
                        var valueStr = Common.getDateStringFromUtc(value as Date, getFullFormat());
                        offTheRecord = true;
                        setTimeout(() => {
                                offTheRecord = false;
                            },
                            250);

                        $element.val(valueStr);
                    });

                if ($element.attr("readonly") == null) {
                    enableDatePicker();
                }

                function disableKeyDown() {
                    $element.on("keydown",
                        e => {
                            //Allow only: tab, enter and arrows
                            var keyCodesToAllow = [9, 13, 37, 38, 39, 40];
                            if (keyCodesToAllow.indexOf(e.keyCode) < 0) {
                                e.stopPropagation();
                                e.preventDefault();
                                return false;
                            }
                        });
                }//end disableKeyDown

                function onDateTimeChanged(event) {

                    if (offTheRecord)
                        return;

                    var rawValue = $element.val();

                    // http://redmine.clmsuk.com:81/redmine/issues/10208

                    var setToMidday = $scope.timePicker !== true;

                    //Compare the value you got, with the previous one and abort if th values are the same
                    var oldModel = $scope.model;
                    var newValue = Joove.Common.getUtcDateFromRawString(rawValue, getFullFormat(), setToMidday);

                    if (new Date(oldModel).getTime() == new Date(newValue as any).getTime()) {
                        return;
                    }

                    if (rawValue == null || rawValue == "" || (rawValue.trim && rawValue.trim() == "")) {
                        //If was empty and remains empty, just leave
                        if (oldModel == null || oldModel.toString() == null || oldModel.toString().trim() == "") {
                            return;
                        }
                        //If has a value and then became empty, nullify
                        newValue = null;
                    }

                    //Update the model. 
                    //Important: to avoid other events firing, do not move this line above the previous check!!!
                    $scope.model = newValue;
                    Joove.Core.applyScope(Joove.Common.getScope(), true);
										
                    if ($scope.onChangeDateTime != null) {
						let parents = [];
						let model = $scope.model;
						let contextItems = $element.data("context-items");

						//If the datetime picker is within a context (i.e. a table/grid)
						//we'll need to get some extra values before calling the onChange event
						if(contextItems && contextItems != "" && $scope.model){
							if($scope.contextParents){
								parents = $scope.contextParents; 
							}
							model = $scope.contextModel; 
						}
						
						$scope.onChangeDateTime(event, $element, model, parents);	
                    }
                }

                function enableDatePicker() {
                    $element["datetimepicker"](({
                        format: getFullFormat(),
                        formatTime: timeFormat,
                        formatDate: dateFormat,
                        timepicker: $scope.timePicker,
                        datepicker: $scope.datePicker,
                        scrollInput: false, 
                        onClose: function (value, element, event) {
                            onDateTimeChanged(event);
                        },
                        onChangeMonth: function (value, $input, event) {
                            if ($scope.monthPicker !== true) { return; }

                            var valueStr = Common.getDateStringFromUtc(value.setDate(1) as Date, monthFormat);
                            $input.val(valueStr);
                            $element["datetimepicker"]("hide");  
                        },
                        onShow(value, $input, event) {
                            if ($scope.monthPicker !== true) { return; }

                            if ($scope.calendarPickerHidden === true) {
                                return;
                            }

                            const $dateTimePicker = $(event.currentTarget.closest(".xdsoft_datetimepicker"));
                            const $calendarPicker = $($dateTimePicker.find(".xdsoft_calendar"));
                            $calendarPicker.hide();
                            $scope.calendarPickerHidden = true;
                        }
                    }) as any);

                    if ($scope.allowTyping === false) {
                        disableKeyDown();
                    }

                    //This will help us as part of the "OnChange" logic, when the user types something and then just leaves
                    $element.on("blur", function (event) {
                        onDateTimeChanged(event);                    
                    });

                    $(".xdsoft_datepicker.active").on("click", ".xdsoft_today_button", (e: Event) => {                        
                        setTimeout(() => { 
                            var $calendar = $(e.target).closest(".xdsoft_datepicker");
                            var $todayBtn = $calendar.find(".xdsoft_current.xdsoft_today").eq(0);
                            
                            $todayBtn.click();
                            $element["datetimepicker"]("hide");                          
                        }, 100);
                    });

                }

                function configurePlugIn() {
                    if (window.momentJsInitialized) return;

                    // Configure Timepicker to use moment.js (only once)
                    Date["parseDate"] = (input, format) => moment(input, format).toDate();

                    Date.prototype.dateFormat = function(format) {
                        return moment(this).format(format);
                    };

                    window.momentJsInitialized = true;
                    
                    // Apply Locales
                    $["datetimepicker"]["setLocale"](window._context.locale);
                }

                function getFullFormat() : string {
                    let fullFormat = $scope.datePicker === true ? dateFormat : "";

                    if (fullFormat.length > 0 && $scope.timePicker === true) {
                        fullFormat += " ";
                    }

                    if ($scope.timePicker === true) {
                        fullFormat += timeFormat;
                    }

                    return fullFormat;
                }

                Common.markDirectiveScopeAsReady($element);
            }
        };
    }

    angular
        .module("jbDatepicker", [])
        .provider("jbDatepicker", new JbDatepicker())
        .directive("jbDatepicker",
        [
            "$timeout",
            "$interval",
            "jbDatepicker",
            jbDatepicker
        ]);

}