var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var ExportHelperV2 = /** @class */ (function () {
            function ExportHelperV2(listRef) {
                this.listReference = listRef;
            }
            ExportHelperV2.prototype.getPopUpContent = function () {
                var $contents = $("<div class='export-pop-up'>" + this.getExportPopUpMarkUp());
                this.configureExportPopUpContainer($contents, false);
                return $contents;
            };
            ExportHelperV2.prototype.okCallback = function ($container) {
                //Options
                var type = $container.find(".export-type").val();
                var range = $container.find(".export-range").val();
                var fileName = $container.find(".export-filename").val();
                var exportTitle = $container.find(".export-title").val();
                var includeGridLines = $container.find(".export-include-grid-lines").is(":checked") === true;
                var portraitOrientation = $container.find(".export-portrait-orientation").is(":checked") === true;
                //Column Info
                var columns = [];
                var allGroups = this.listReference.status.groupBy || [];
                for (var i = this.listReference.options.showRowNumbers ? 1 : 0; i < this.listReference.dataTableInstance.columns().count(); i++) {
                    var column = this.listReference.dataTableInstance.columns(i);
                    var columnInfo = this.listReference.getColumnInfoForElement($(column.header()[0]));
                    if (column.visible()[0] !== true && allGroups.filter(function (x) { return x.column.name === columnInfo.name; }).length === 0) {
                        continue;
                    }
                    if (columnInfo == undefined) {
                        this.listReference.handleError("DATALIST ERROR: Export could not find column info for column index: " + i);
                    }
                    //Handle back end formatting
                    var formatting = columnInfo.formatting instanceof Object
                        ? columnInfo.formatting.backEndFormatting
                        : columnInfo.formatting;
                    var excelFormat = columnInfo.formatting instanceof Object
                        ? columnInfo.formatting.excelFormat
                        : columnInfo.formatting;
                    //Handle width
                    /* NOTE: The width value is only used in PDF export and only as an analogy to the list column widths. Since the column widths may
                     *       have null values (no predefined with or the user hasn't resized them) we get the actual width of the header element itself
                     */
                    var columnWidth = $(column.header()[0]).width();
                    columns.push({
                        name: columnInfo.name,
                        caption: columnInfo.caption,
                        formatting: formatting,
                        width: columnWidth,
                        excelFormat: excelFormat
                    });
                }
                //Group Info
                var groups = [];
                for (var i = 0; i < this.listReference.status.groupBy.length; i++) {
                    var groupBy = this.listReference.status.groupBy[i];
                    groups.push(groupBy.column.name.toLowerCase());
                }
                //Colors
                var headerColor = $container.find("#header-line-color .jscolor").css("background-color");
                var evenColor = $container.find("#even-lines-color .jscolor").css("background-color");
                var oddColor = $container.find("#odd-lines-color .jscolor").css("background-color");
                var groupColor = $container.find("#group-lines-color .jscolor").css("background-color");
                var aggregateColor = $container.find("#aggregate-lines-color .jscolor").css("background-color");
                var reservedChars = /^[^\\/:\*\?"<>\|]+$/;
                var forbiddenCharIndex = /^\./;
                if (fileName == "") {
                    alert("Error - Empty FileName");
                    return;
                }
                if (!reservedChars.test(fileName)) {
                    alert("Error - FileName can not contain any of the following characters \/:*?\"<>| ");
                    return;
                }
                if (!reservedChars.test(fileName)) {
                    alert("Error - FileName can not start with char .");
                    return;
                }
                this.listReference.status.exportSettings = {
                    type: type,
                    range: range,
                    fileName: fileName,
                    exportTitle: exportTitle,
                    includeGridLines: includeGridLines,
                    portraitOrientation: portraitOrientation,
                    columnInfo: columns,
                    groupInfo: groups,
                    headerColor: headerColor,
                    evenColor: evenColor,
                    oddColor: oddColor,
                    groupColor: groupColor,
                    aggregateColor: aggregateColor,
                };
                this.listReference.dataTableInstance.state.save();
                this.export(this.listReference.status.exportSettings);
            };
            ExportHelperV2.prototype.getExportPopUpMarkUp = function () {
                return "\n<div class='export-preferences-container'>\n    <div jb-type=\"FormGroup\" class=\"jb-control\">\n        <div jb-type=\"FormGroupLabelContainer\" class=\"jb-control \">\n            <label jb-type=\"Label\" class=\"jb-control \">" + this.listReference.resources.textResources.ExportType + "</label>\n        </div>\n        <div jb-type=\"FormGroupInputContainer\" class=\"jb-control\">\n            <select class='form-control export-type'> \n                <option value='EXCEL'>Excel</option> \n                <option value='PDF'>PDF</option> \n                <option value='CSV'>CSV</option> \n            </select> \n        </div>\n    </div>\n    <div jb-type=\"FormGroup\" class=\"jb-control\">\n        <div jb-type=\"FormGroupLabelContainer\" class=\"jb-control \">\n            <label jb-type=\"Label\" class=\"jb-control \">" + this.listReference.resources.textResources.ExportTitle + "</label>\n        </div>\n        <div jb-type=\"FormGroupInputContainer\" class=\"jb-control\">\n            <input jb-type=\"TextBox\" class='jb-control form-control export-title' type='text' value='" + (Joove.Common.getModel().Title || "") + "'>\n        </div>\n    </div>\n    <div jb-type=\"FormGroup\" class=\"jb-control\">\n        <div jb-type=\"FormGroupLabelContainer\" class=\"jb-control \">\n            <label jb-type=\"Label\" class=\"jb-control \">" + this.listReference.resources.textResources.ExportRange + "</label>\n        </div>\n        <div jb-type=\"FormGroupInputContainer\" class=\"jb-control\">\n            <select class='form-control export-range'>\n                <option value='CURRENT' selected=\"selected\">" + this.listReference.resources.textResources.ExportRangeCurrent + "</option>\n                <option value='TOP100'>" + this.listReference.resources.textResources.ExportRange100 + "</option>\n                <option value='ALL'>" + this.listReference.resources.textResources.ExportRangeAll + "</option>\n            </select>\n        </div>\n    </div>\n    <div jb-type=\"FormGroup\" class=\"jb-control\">\n        <div jb-type=\"FormGroupLabelContainer\" class=\"jb-control \">\n            <label jb-type=\"Label\" class=\"jb-control \">" + this.listReference.resources.textResources.FileName + "</label>\n        </div>\n        <div jb-type=\"FormGroupInputContainer\" class=\"jb-control\">\n            <input jb-type=\"TextBox\" class='jb-control form-control export-filename' type='text' value='" + this.listReference.serversideElementId + "_" + moment().format('DD-MM-YYYY (HH-mm)') + "'> \n        </div>\n    </div>\n    <div class=\"row export-options\">\n        <div class=\"col-xs-6\">\n            <label style=\"display: block\">Options:</label>\n            <div jb-type=\"HtmlContainer\" class=\"pretty p-smooth p-default jb-control\" ui-role-color=\"default\">\n                <input type='checkbox' class='export-portrait-orientation'>\n                <div class=\"state\">\n                    <label>" + this.listReference.resources.textResources.PortraitOrientation + "</label>\n                </div>\n            </div>\n            <div jb-type=\"HtmlContainer\" class=\"pretty p-smooth p-default jb-control\" ui-role-color=\"default\">\n                <input type='checkbox' class='export-include-grid-lines'>\n                <div class=\"state\">\n                    <label>" + this.listReference.resources.textResources.IncludeGridLines + "</label>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-xs-6 export-color-select-group\">\n            <label>Colors:</label>\n            <div class=\"group-input\">\n                <div id=\"header-line-color\" class=\"colorpicker-container\" title=\"Select color\">\n\t                <div class=\"jscolor\" style=\"background-color: #ddebf7\"></div>\n                    <div class=\"colorpicker-holder\"></div>\n                </div>\n                <label>" + this.listReference.resources.textResources.HeaderColor + "</label>\n            </div>\n            <div class=\"group-input\">\n                <div id=\"even-lines-color\" class=\"colorpicker-container\" title=\"Select color\">\n\t                <div class=\"jscolor\"></div>\n                    <div class=\"colorpicker-holder\"></div>\n                </div>\n                <label>" + this.listReference.resources.textResources.EvenColor + "</label>\n            </div>\n            <div class=\"group-input\">\n                <div id=\"odd-lines-color\" class=\"colorpicker-container\" title=\"Select color\">\n\t                <div class=\"jscolor\"></div>\n                    <div class=\"colorpicker-holder\"></div>\n                </div>\n                <label>" + this.listReference.resources.textResources.OddColor + "</label>\n            </div>\n            <div class=\"group-input\">\n                <div id=\"aggregate-lines-color\" class=\"colorpicker-container\" title=\"Select color\">\n\t                <div class=\"jscolor\" style=\"background-color: #f0f0f0\"></div>\n                    <div class=\"colorpicker-holder\"></div>\n                </div>\n                <label>" + this.listReference.resources.textResources.AggregateColor + "</label>\n            </div>\n            <div class=\"group-input\">\n                <div id=\"group-lines-color\" class=\"colorpicker-container\" title=\"Select color\">\n\t                <div class=\"jscolor\"></div>\n                    <div class=\"colorpicker-holder\"></div>\n                </div>\n                <label>" + this.listReference.resources.textResources.GroupColor + "</label>\n            </div>\n        </div>\n    </div>\n</div>";
            };
            ExportHelperV2.prototype.configureExportPopUpContainer = function ($container, isNotPopUp) {
                var self = this;
                var $exportType = $container.find(".export-type");
                var $exportRange = $container.find(".export-range");
                var $exportFilename = $container.find(".export-filename");
                var $exportTitle = $container.find(".export-title");
                var $exportOrientation = $container.find(".export-portrait-orientation");
                var $exportGridLines = $container.find(".export-include-grid-lines");
                var $exportHeaderColor = $container.find("#header-line-color");
                var $exportEvenColor = $container.find("#even-lines-color");
                var $exportOddColor = $container.find("#odd-lines-color");
                var $exportGroupColor = $container.find("#group-lines-color");
                var $exportAggregateColor = $container.find("#aggregate-lines-color");
                $container.find(".colorpicker-container").each(function () {
                    var $selectedColor = $(this).children(".jscolor");
                    var $colorpickerHolder = $(this).children(".colorpicker-holder");
                    $colorpickerHolder.ColorPicker({
                        flat: true,
                        color: self.rgb2hex($selectedColor.css("background-color")),
                        onSubmit: function (hsb, hex, rgb) {
                            $selectedColor.css('background-color', '#' + hex);
                            $selectedColor.click();
                        }
                    });
                    $selectedColor.on('click', function () {
                        var isVisible = $colorpickerHolder.hasClass("colorpicker-visible");
                        $colorpickerHolder.toggleClass("colorpicker-visible", !isVisible, 200);
                    });
                });
                //Listeners of the export PopUp
                $exportType.on("change", function () {
                    var exportType = $(this).val();
                    if (exportType == null) {
                        exportType = 'EXCEL';
                        $(this).val(exportType);
                        $exportRange.val('CURRENT');
                    }
                    else {
                        exportType = exportType.toString();
                    }
                    if (exportType === "CSV") {
                        $container.find(".export-color-select-group").hide();
                    }
                    else {
                        $container.find(".export-color-select-group").show();
                    }
                    if (exportType === "PDF") {
                        $container.find(".export-portrait-orientation").removeAttr("disabled");
                    }
                    else {
                        $container.find(".export-portrait-orientation").attr("checked", "false");
                        $container.find(".export-portrait-orientation").attr("disabled", "disabled");
                    }
                });
                $exportRange.val('CURRENT');
                //Set values from status
                if (self.listReference.status.exportSettings != undefined) {
                    $exportType.val(self.listReference.status.exportSettings.type);
                    $exportRange.val(self.listReference.status.exportSettings.range);
                    if (self.listReference.status.exportSettings.fileName.length > 0)
                        $exportFilename.val(self.listReference.status.exportSettings.fileName);
                    if (self.listReference.status.exportSettings.exportTitle.length > 0)
                        $exportTitle.val(self.listReference.status.exportSettings.exportTitle);
                    $exportOrientation.prop("checked", self.listReference.status.exportSettings.portraitOrientation);
                    $exportGridLines.prop("checked", self.listReference.status.exportSettings.includeGridLines);
                    //Timeout for initializing colorpicker elements
                    setTimeout(function () {
                        if (self.listReference.status.exportSettings.headerColor.length > 0) {
                            var $selectedColor = $exportHeaderColor.children(".jscolor");
                            var $colorpickerHolder = $exportHeaderColor.children(".colorpicker-holder");
                            $selectedColor.css("background-color", self.listReference.status.exportSettings.headerColor);
                            $colorpickerHolder.ColorPickerSetColor(self.listReference.status.exportSettings.headerColor);
                        }
                        ;
                        if (self.listReference.status.exportSettings.evenColor.length > 0) {
                            var $selectedColor = $exportEvenColor.children(".jscolor");
                            var $colorpickerHolder = $exportEvenColor.children(".colorpicker-holder");
                            $selectedColor.css("background-color", self.listReference.status.exportSettings.evenColor);
                            $colorpickerHolder.ColorPickerSetColor(self.listReference.status.exportSettings.evenColor);
                        }
                        if (self.listReference.status.exportSettings.oddColor.length > 0) {
                            var $selectedColor = $exportOddColor.children(".jscolor");
                            var $colorpickerHolder = $exportOddColor.children(".colorpicker-holder");
                            $selectedColor.css("background-color", self.listReference.status.exportSettings.oddColor);
                            $colorpickerHolder.ColorPickerSetColor(self.listReference.status.exportSettings.oddColor);
                        }
                        if (self.listReference.status.exportSettings.groupColor.length > 0) {
                            var $selectedColor = $exportGroupColor.children(".jscolor");
                            var $colorpickerHolder = $exportGroupColor.children(".colorpicker-holder");
                            $selectedColor.css("background-color", self.listReference.status.exportSettings.groupColor);
                            $colorpickerHolder.ColorPickerSetColor(self.listReference.status.exportSettings.groupColor);
                        }
                        if (self.listReference.status.exportSettings.aggregateColor.length > 0) {
                            var $selectedColor = $exportAggregateColor.children(".jscolor");
                            var $colorpickerHolder = $exportAggregateColor.children(".colorpicker-holder");
                            $selectedColor.css("background-color", self.listReference.status.exportSettings.aggregateColor);
                            $colorpickerHolder.ColorPickerSetColor(self.listReference.status.exportSettings.aggregateColor);
                        }
                    }, 300);
                    $exportType.trigger("change");
                }
            };
            ExportHelperV2.prototype.export = function (opts) {
                var activeAggregators = $.grep(this.listReference.status.aggregators, function (item) { return item.enabled; });
                Joove.Core.executeControllerActionNew({
                    action: this.listReference.serversideElementId + "_ExportV2",
                    controller: window._context.currentController,
                    postData: {
                        model: window.$form.model,
                        exportData: opts,
                        datasourceRequest: this.listReference.prepareDatasourceRequestInfo(),
                        aggregatorsRequest: JSON.parse(JSON.stringify(activeAggregators || []))
                    },
                    verb: "POST",
                    cb: function (downloadInfo) {
                        if (downloadInfo == null || downloadInfo.Data == null) {
                            window._popUpManager.error("Could not prepare list export file for download!");
                            return;
                        }
                        CLMS.Framework.Utilities.OpenWindow("" + window._context.siteRoot + window._context.currentController + "/DownloadFile?id=" + downloadInfo.Data);
                    }
                });
            };
            //Function to convert rgb color to hex format
            ExportHelperV2.prototype.rgb2hex = function (rgb) {
                rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                if (rgb == null)
                    return "#ffffff";
                return "#" + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(rgb[3]);
            };
            ExportHelperV2.prototype.hex = function (x) {
                var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
                return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
            };
            return ExportHelperV2;
        }());
        Widgets.ExportHelperV2 = ExportHelperV2;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
