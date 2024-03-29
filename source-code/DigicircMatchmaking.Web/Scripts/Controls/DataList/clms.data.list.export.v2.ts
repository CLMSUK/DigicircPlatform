﻿namespace Joove.Widgets {
    export class ExportHelperV2 {
        constructor(listRef: DataListControl) {
            this.listReference = listRef;
        }

        private listReference: DataListControl;

        public getPopUpContent(): JQuery {
            const $contents = $(`<div class='export-pop-up'>${this.getExportPopUpMarkUp()}`);

            this.configureExportPopUpContainer($contents, false);

            return $contents;
        }

        public okCallback($container: JQuery) {
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

                 if (column.visible()[0] !== true && allGroups.filter(x => x.column.name === columnInfo.name).length === 0) {
                    continue;
                 }

                if (columnInfo == undefined) {
                    this.listReference.handleError("DATALIST ERROR: Export could not find column info for column index: " + i);
                }
                //Handle back end formatting
                const formatting = (columnInfo.formatting as any) instanceof Object
                    ? (columnInfo.formatting as any).backEndFormatting
                    : columnInfo.formatting;

                const excelFormat = (columnInfo.formatting as any) instanceof Object
                    ? (columnInfo.formatting as any).excelFormat
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
        }

        private getExportPopUpMarkUp() {
            return `
<div class='export-preferences-container'>
    <div jb-type="FormGroup" class="jb-control">
        <div jb-type="FormGroupLabelContainer" class="jb-control ">
            <label jb-type="Label" class="jb-control ">${this.listReference.resources.textResources.ExportType}</label>
        </div>
        <div jb-type="FormGroupInputContainer" class="jb-control">
            <select class='form-control export-type'> 
                <option value='EXCEL'>Excel</option> 
                <option value='PDF'>PDF</option> 
                <option value='CSV'>CSV</option> 
            </select> 
        </div>
    </div>
    <div jb-type="FormGroup" class="jb-control">
        <div jb-type="FormGroupLabelContainer" class="jb-control ">
            <label jb-type="Label" class="jb-control ">${this.listReference.resources.textResources.ExportTitle}</label>
        </div>
        <div jb-type="FormGroupInputContainer" class="jb-control">
            <input jb-type="TextBox" class='jb-control form-control export-title' type='text' value='${Common.getModel().Title || ""}'>
        </div>
    </div>
    <div jb-type="FormGroup" class="jb-control">
        <div jb-type="FormGroupLabelContainer" class="jb-control ">
            <label jb-type="Label" class="jb-control ">${this.listReference.resources.textResources.ExportRange}</label>
        </div>
        <div jb-type="FormGroupInputContainer" class="jb-control">
            <select class='form-control export-range'>
                <option value='CURRENT' selected="selected">${this.listReference.resources.textResources.ExportRangeCurrent}</option>
                <option value='TOP100'>${this.listReference.resources.textResources.ExportRange100}</option>
                <option value='ALL'>${this.listReference.resources.textResources.ExportRangeAll}</option>
            </select>
        </div>
    </div>
    <div jb-type="FormGroup" class="jb-control">
        <div jb-type="FormGroupLabelContainer" class="jb-control ">
            <label jb-type="Label" class="jb-control ">${this.listReference.resources.textResources.FileName}</label>
        </div>
        <div jb-type="FormGroupInputContainer" class="jb-control">
            <input jb-type="TextBox" class='jb-control form-control export-filename' type='text' value='${this.listReference.serversideElementId}_${moment().format('DD-MM-YYYY (HH-mm)')}'> 
        </div>
    </div>
    <div class="row export-options">
        <div class="col-xs-6">
            <label style="display: block">Options:</label>
            <div jb-type="HtmlContainer" class="pretty p-smooth p-default jb-control" ui-role-color="default">
                <input type='checkbox' class='export-portrait-orientation'>
                <div class="state">
                    <label>${this.listReference.resources.textResources.PortraitOrientation}</label>
                </div>
            </div>
            <div jb-type="HtmlContainer" class="pretty p-smooth p-default jb-control" ui-role-color="default">
                <input type='checkbox' class='export-include-grid-lines'>
                <div class="state">
                    <label>${this.listReference.resources.textResources.IncludeGridLines}</label>
                </div>
            </div>
        </div>
        <div class="col-xs-6 export-color-select-group">
            <label>Colors:</label>
            <div class="group-input">
                <div id="header-line-color" class="colorpicker-container" title="Select color">
	                <div class="jscolor" style="background-color: #ddebf7"></div>
                    <div class="colorpicker-holder"></div>
                </div>
                <label>${this.listReference.resources.textResources.HeaderColor}</label>
            </div>
            <div class="group-input">
                <div id="even-lines-color" class="colorpicker-container" title="Select color">
	                <div class="jscolor"></div>
                    <div class="colorpicker-holder"></div>
                </div>
                <label>${this.listReference.resources.textResources.EvenColor}</label>
            </div>
            <div class="group-input">
                <div id="odd-lines-color" class="colorpicker-container" title="Select color">
	                <div class="jscolor"></div>
                    <div class="colorpicker-holder"></div>
                </div>
                <label>${this.listReference.resources.textResources.OddColor}</label>
            </div>
            <div class="group-input">
                <div id="aggregate-lines-color" class="colorpicker-container" title="Select color">
	                <div class="jscolor" style="background-color: #f0f0f0"></div>
                    <div class="colorpicker-holder"></div>
                </div>
                <label>${this.listReference.resources.textResources.AggregateColor}</label>
            </div>
            <div class="group-input">
                <div id="group-lines-color" class="colorpicker-container" title="Select color">
	                <div class="jscolor"></div>
                    <div class="colorpicker-holder"></div>
                </div>
                <label>${this.listReference.resources.textResources.GroupColor}</label>
            </div>
        </div>
    </div>
</div>`;
        }

        private configureExportPopUpContainer($container: JQuery, isNotPopUp: boolean) {
            const self = this;

            const $exportType = $container.find(".export-type");
            const $exportRange = $container.find(".export-range");
            const $exportFilename = $container.find(".export-filename");
            const $exportTitle = $container.find(".export-title");
            const $exportOrientation = $container.find(".export-portrait-orientation");
            const $exportGridLines = $container.find(".export-include-grid-lines");
            const $exportHeaderColor = $container.find("#header-line-color");
            const $exportEvenColor = $container.find("#even-lines-color");
            const $exportOddColor = $container.find("#odd-lines-color");
            const $exportGroupColor = $container.find("#group-lines-color");
            const $exportAggregateColor = $container.find("#aggregate-lines-color");

            $container.find(".colorpicker-container").each(function () {
                const $selectedColor = $(this).children(".jscolor");
                const $colorpickerHolder = $(this).children(".colorpicker-holder");

                ($colorpickerHolder as any).ColorPicker({
                    flat: true,
                    color: self.rgb2hex($selectedColor.css("background-color")),
                    onSubmit: function (hsb, hex, rgb) {
                        $selectedColor.css('background-color', '#' + hex);
                        $selectedColor.click();
                    }
                });

                $selectedColor.on('click', function () {
                    const isVisible = $colorpickerHolder.hasClass("colorpicker-visible")
                    $colorpickerHolder.toggleClass("colorpicker-visible", !isVisible, 200);
                });
            });

            //Listeners of the export PopUp
            $exportType.on("change", function () {
                let exportType = $(this).val();
                if (exportType == null) {
                    exportType = 'EXCEL'
                    $(this).val(exportType);
                    $exportRange.val('CURRENT');
                } else {
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
                } else {
                    $container.find(".export-portrait-orientation").attr("checked", "false");
                    $container.find(".export-portrait-orientation").attr("disabled", "disabled");
                }
            });

            $exportRange.val('CURRENT');

            //Set values from status
            if (self.listReference.status.exportSettings != undefined) {
                $exportType.val(self.listReference.status.exportSettings.type);
                $exportRange.val(self.listReference.status.exportSettings.range);
                if (self.listReference.status.exportSettings.fileName.length > 0) $exportFilename.val(self.listReference.status.exportSettings.fileName);
                if (self.listReference.status.exportSettings.exportTitle.length > 0) $exportTitle.val(self.listReference.status.exportSettings.exportTitle);
                $exportOrientation.prop("checked", self.listReference.status.exportSettings.portraitOrientation);
                $exportGridLines.prop("checked", self.listReference.status.exportSettings.includeGridLines);

                //Timeout for initializing colorpicker elements
                setTimeout(() => {
                    if (self.listReference.status.exportSettings.headerColor.length > 0) {
                        const $selectedColor = $exportHeaderColor.children(".jscolor");
                        const $colorpickerHolder = $exportHeaderColor.children(".colorpicker-holder");

                        $selectedColor.css("background-color", self.listReference.status.exportSettings.headerColor);
                        ($colorpickerHolder as any).ColorPickerSetColor(self.listReference.status.exportSettings.headerColor);
                    };
                    if (self.listReference.status.exportSettings.evenColor.length > 0) {
                        const $selectedColor = $exportEvenColor.children(".jscolor");
                        const $colorpickerHolder = $exportEvenColor.children(".colorpicker-holder");

                        $selectedColor.css("background-color", self.listReference.status.exportSettings.evenColor);
                        ($colorpickerHolder as any).ColorPickerSetColor(self.listReference.status.exportSettings.evenColor);
                    }
                    if (self.listReference.status.exportSettings.oddColor.length > 0) {
                        const $selectedColor = $exportOddColor.children(".jscolor");
                        const $colorpickerHolder = $exportOddColor.children(".colorpicker-holder");

                        $selectedColor.css("background-color", self.listReference.status.exportSettings.oddColor);
                        ($colorpickerHolder as any).ColorPickerSetColor(self.listReference.status.exportSettings.oddColor);
                    }
                    if (self.listReference.status.exportSettings.groupColor.length > 0) {
                        const $selectedColor = $exportGroupColor.children(".jscolor");
                        const $colorpickerHolder = $exportGroupColor.children(".colorpicker-holder");

                        $selectedColor.css("background-color", self.listReference.status.exportSettings.groupColor);
                        ($colorpickerHolder as any).ColorPickerSetColor(self.listReference.status.exportSettings.groupColor);
                    }
                    if (self.listReference.status.exportSettings.aggregateColor.length > 0) {
                        const $selectedColor = $exportAggregateColor.children(".jscolor");
                        const $colorpickerHolder = $exportAggregateColor.children(".colorpicker-holder");

                        $selectedColor.css("background-color", self.listReference.status.exportSettings.aggregateColor);
                        ($colorpickerHolder as any).ColorPickerSetColor(self.listReference.status.exportSettings.aggregateColor);
                    }
                }, 300);

                $exportType.trigger("change");
            }
        }

        private export(opts: any) {
            const activeAggregators = $.grep(this.listReference.status.aggregators, (item) => { return item.enabled; });

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
                cb: (downloadInfo: any) => {
                    if (downloadInfo == null || downloadInfo.Data == null) {
                        window._popUpManager.error("Could not prepare list export file for download!");
                        return;
                    }

                    CLMS.Framework.Utilities.OpenWindow(`${window._context.siteRoot}${window._context.currentController}/DownloadFile?id=${downloadInfo.Data}`);
                }
            });
        }

        //Function to convert rgb color to hex format
        private rgb2hex(rgb) {
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (rgb == null) return "#ffffff";
            return "#" + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(rgb[3]);
        }

        private hex(x) {
            const hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
            return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
        }
    }
}
