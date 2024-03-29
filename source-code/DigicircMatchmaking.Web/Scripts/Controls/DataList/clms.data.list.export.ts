﻿namespace Joove.Widgets {
    export class ExportHelper {
        constructor(listRef: DataListControl) {
            this.listReference = listRef;
        }

        private listReference: DataListControl;

        public getPopUpContent(): JQuery {
            const $contents = $(`<div class='export-pop-up'>${this.getExportPopUpMarkUp()}${this.getExportDisplayColumns()}`);

            this.populateExportPopUpContainer($contents, false);

            return $contents;
        }

        public okCallback($container: JQuery) {
            var type = $container.find(".export-type").val();
            var onlyGroups = $container.find(".export-only-group-data").is(":checked") === true;
            var range = $container.find(".export-range").val();
            var fileName = $container.find(".export-filename").val();
            var includeGridLines = $container.find(".export-include-grid-lines").is(":checked") === true;
            var portraitOrientation = $container.find(".export-portrait-orientation").is(":checked") === true;
            var nonGroupCount = $container.find(".export-non-group-count").is(":checked") === true;
            var visibleColumnsCollection = this.populateVisibleColumns($container);
            var groupColor = $container.find("#group-lines-color").css("background-color");
            var headerColor = $container.find("#header-line-color").css("background-color");
            var evenColor = $container.find("#even-lines-color").css("background-color");
            var oddColor = $container.find("#odd-lines-color").css("background-color");
            var aggregateColor = $container.find("#aggregate-lines-color").css("background-color");
            var allColumnsNoVisible = visibleColumnsCollection.every(function (x) {
                for (var i = 0; i < visibleColumnsCollection.length; i++) {
                    if (x.isVisible == true) return false;
                }
                return true;
            })
            if (allColumnsNoVisible) {
                alert("Error - None Visible Column");
                return;
            }
            if (fileName == "") {
                alert("Error - Empty FileName");
                return;
            }
            var reservedChars = /^[^\\/:\*\?"<>\|]+$/;
            if (!reservedChars.test(fileName)) {
                alert("Error - FileName can not contain any of the following characters \/:*?\"<>| ");
                return;
            }
            var forbiddenCharIndex = /^\./;
            if (!reservedChars.test(fileName)) {
                alert("Error - FileName can not start with char .");
                return;
            }

            const exportAggregatorInfo = this.addAggregatorsForExport($container, visibleColumnsCollection);

            this.export({
                type: type,
                range: range,
                onlyGroups: onlyGroups,
                fileName: fileName,
                includeGridLines: includeGridLines,
                portraitOrientation: portraitOrientation,
                visibleColumnsCollection: visibleColumnsCollection,
                groupColor: groupColor,
                headerColor: headerColor,
                evenColor: evenColor,
                oddColor: oddColor,
                aggregateColor: aggregateColor,
                aggregatorsRequest: exportAggregatorInfo,
                nonGroupCount: nonGroupCount,
            });
        }

        private getExportPopUpMarkUp() {
            return `<div class='export-preferences-container'> \
            <table class='table' style='margin-bottom:0px;'>\
                <thead>\
                    <tr>\
                        <th style='vertical-align: middle'>${this.listReference.resources.textResources.ExportType}</th> \
                        <th> \
                            <select class='form-control export-type'>\
                                <option value='EXCEL'>Excel</option> \
                                <option value='WORD'>Word</option> \
                                <option value='PDF'>PDF</option> \
                            </select>\
                        </th>\
                    </tr>\
                    <tr>\
                        <th style='vertical-align: middle'>${this.listReference.resources.textResources.ExportRange}</th> \
                        <th> \
                            <select class='form-control export-range'>\
                                <option value='CURRENT'>${this.listReference.resources.textResources.ExportRangeCurrent}</option> \
                                <option value='TOP100'>${this.listReference.resources.textResources.ExportRange100}</option> \
                                <option value='ALL'>${this.listReference.resources.textResources.ExportRangeAll}</option> \
                            </select>\
                        </th>\
                    </tr>\
                    <tr> \
                        <th style='vertical-align: middle'>\
                            <span>${this.listReference.resources.textResources.FileName}</span>\
                        </th>\
                        <th>\
                            <input class='default-input form-control export-filename' type='text' value='${this.listReference.serversideElementId}'> \
                        </th>\
                    </tr> \
                </thead> \
            </table>\
            <fieldset>\
            <table class='table' style='width:50%; float:left;'>\
                    <thead> \
                        <tr class='row-table-export-pop-up' data-column='export-group-data'> \
                            <th>\
                                <span>${this.listReference.resources.textResources.ExportOnlyGroups}</span>\
                            </th>\
                            <th>\
                                <input type='checkbox' class='export-only-group-data'> \
                            </th>\
                        </tr> \
                        <tr class='row-table-export-pop-up' data-column='export-PDFportrait-orientation'> \
                            <th>\
                                <span>${this.listReference.resources.textResources.PortraitOrientation}</span>\
                            </th>\
                            <th>\
                                <input type='checkbox' class='export-portrait-orientation'> \
                            </th>\
                        </tr> \
                        <tr>\
                            <th>\
                                <span>${this.listReference.resources.textResources.IncludeGridLines}</span>\
                            </th>\
                            <th>\
                                <input type='checkbox' class='export-include-grid-lines'> \
                            </th>\
                        </tr>\
                        <tr class='row-table-export-pop-up' data-column='export-total-count'>\
                            <th>\
                                <span>${this.listReference.resources.textResources.TotalNonGroupCount}</span>\
                            </th>\
                            <th>\
                                <input type='checkbox' class='export-non-group-count'> \
                            </th>\
                        </tr>\     
                        <tr>\
                            <th colspan='2'>\
                                <a id='disCols' jb-id='disCols' title='${this.listReference.resources.textResources.DisplayColumns}' data-state='collapsed'>\                                
                                    <span>${this.listReference.resources.textResources.DisplayColumns}</span>\                            
                                </a> \         
                            </th>
                        </tr>
                    </thead>\
                </table>\
            <table class='table' style='width:50%'; float:right;>\
                <thead style='border-left: medium #DDDDDD; border-left-style: solid;'> \
                    <tr class='row-table-colors-export-pop-up' data-column='row-table-group-color'> \
                        <th>\
                            <span>${this.listReference.resources.textResources.GroupColor}</span>\
                        </th>\
                        <th style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='group-lines-color' jb-id='group-lines-color' class="jscolor {closable:true,closeText:'OK', valueElement:null} color-picker-button" title='Select color'> \
                            </button> \
                        </th>\
                    </tr> \
                    <tr class='row-table-colors-export-pop-up' data-column='row-table-header-color'> \
                        <th>\
                            <span>${this.listReference.resources.textResources.HeaderColor}</span>\
                        </th>\
                        <th  style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='header-line-color' jb-id='header-line-color' class="jscolor {closable:true ,closeText:'OK' , valueElement:null, value:'66ccff'} color-picker-button" title='Select color'> \
                        </th>\
                    </tr> \
                    <tr class='row-table-colors-export-pop-up' data-column='row-table-even-color'>\
                        <th>\
                            <span>${this.listReference.resources.textResources.EvenColor}</span>\
                        </th>\
                        <th  style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='even-lines-color' jb-id='even-lines-color' class="jscolor {closable:true ,closeText:'OK', valueElement:null, value:'DBD7D0'} color-picker-button" title='Select color'> \
                        </th>\
                    </tr>\
                    <tr class='row-table-colors-export-pop-up' data-column='row-table-odd-color'> \
                        <th>\
                            <span>${this.listReference.resources.textResources.OddColor}</span>\
                        </th>\
                        <th  style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='odd-lines-color' id='jb-odd-lines-color'  class="jscolor {closable:true ,closeText:'OK', valueElement:null, value:'D1BFDB'} color-picker-button" title='Select color'> \
                        </th>\
                    </tr> \
                    <tr class='row-table-colors-export-pop-up' data-column='row-table-aggregate-color'> \
                        <th>\
                            <span>${this.listReference.resources.textResources.AggregateColor}</span>\
                        </th>\
                        <th  style='padding:0px 0px 0px 0px; vertical-align:middle;'>\
                            <button id='aggregate-lines-color' jb-id='aggregate-lines-color' class="jscolor {closable:true,closeText:'OK', valueElement:null, value:'DBDBDB'} color-picker-button" title='Select color'> \
                        </th>\
                    </tr> \
                </thead> \
            </table>\
        </fieldset>\            
        </div>`;
        }

        private getExportDisplayColumns() {
            return `<div  id='exportDisplayColumns' class= "hideColumnsPopUp" jb-id='exportDisplayColumns' style='overflow: hidden; display: none;'> \              
                        <div class='export-table-display-columns'> \
                            <table class='preferences-table table table-hover'> \
                            <thead>\
                                <tr>\
                                    <th style='width:181px; padding-left: 8px; '>\
                                        <span class='export-pop-up-subtitle'>${this.listReference.resources.textResources.ColumnExport}</span>\
                                    </th>\
                                    <th style='width:68px; text-align: center;'>\
                                        <span class='export-pop-up-subtitle'>${this.listReference.resources.textResources.VisibleExport}</span>\
                                    </th>\
                                    <th style='width:68px; text-align: center;'>\
                                        <span class='export-pop-up-subtitle'>${this.listReference.resources.textResources.SumHeader}</span>\
                                    </th>\
                                    <th style='width:68px; text-align: center;'>\
                                        <span class='export-pop-up-subtitle'>${this.listReference.resources.textResources.AverageHeader}</span>\
                                    </th>\
                                    <th style='width:67px; text-align: center;'>\
                                        <span class='export-pop-up-subtitle'>${this.listReference.resources.textResources.CountHeader}</span>\
                                    </th>\
                                    <th style='width:18px; text-align: center;'>\
                                    </th>\
                                </tr>\
                                <tr>\
                                    <th style='vertical-align: top; '>\
                                    </th>\
                                    <th style='vertical-align: top; text-align: center;'>\
                                        <input class='checkall-header-isvisible' type='checkbox' data-state='unchecked'/>\
                                    </th>\
                                    <th style='vertical-align: top; text-align: center;'>\
                                        <input class='checkall-header-issum' type='checkbox' data-state='unchecked'/>\
                                    </th>\
                                    <th style='vertical-align: top; text-align: center;'>\
                                        <input class='checkall-header-isaverage' type='checkbox' data-state='unchecked'/>\
                                    </th>\
                                    <th style='vertical-align: top; text-align: center;'>\
                                        <input class='checkall-header-iscount' type='checkbox' data-state='unchecked'/>\
                                    </th>\
                                    <th style='vertical-align: top; text-align: center;'>\
                                    </th>\
                                </tr>\
                            </thead>\
                            <tbody> \
                                ${this.populateExportPopUpTableDisplayContainer()} \
                            </tbody> \
                            </table> \
                        </div> \
                    </div>`;
        }

        private populateExportPopUpTableDisplayContainer() {
            var str = "";

            for (var i = 0; i < this.listReference.status.columnInfo.length; i++) {
                var column = this.listReference.status.columnInfo[i];
                //var checkedAttr = column.isVisible === true ? "checked='checked'" : "";

                var line = `<tr class='row-preference' data-column='${column.name}'>\
                            <td style='width:181px; text-align:left;'>\
                                <span>${column.caption}</span>\
                            </td>\
                            <td style='width:68px; text-align:center;'>\
                                <input type='checkbox' class='column-is-visible checkbox-position' checked='checked'/>\
                            </td>\
                            <td style='width:68px; text-align:center;'>\
                                <input type='checkbox' class='sum-is-visible checkbox-position' ${this.listReference.resources.textResources.SumHeader}/>\
                            </td>\
                            <td style='width:68px; text-align:center;'>\
                                <input type='checkbox' class='average-is-visible checkbox-position' ${this.listReference.resources.textResources.AverageHeader}/>\
                            </td>\
                            <td style='width:67px; text-align:center;'>\
                                <input type='checkbox' class='count-is-visible checkbox-position' ${this.listReference.resources.textResources.CountHeader}/>\
                            </td>\
                        </tr>`;

                str += line;
            }
            return str;
        }

        private populateExportPopUpContainer($container: JQuery, isNotPopUp: boolean) {
            const self = this;

            //On Load Export popUP initialize depend on group of ListForm and dataType of columns
            var groupColumns = this.listReference.status.groupBy;
            var allColumns = this.listReference.status.columnInfo;
            var groupsDataOnly = false; //this.status.getGroupsClosed;

            var row = $container.find(".row-table-export-pop-up[data-column='export-PDFportrait-orientation']")
                .attr("disabled", "disabled");
            var nonGroupCnt = $container.find(".row-table-export-pop-up[data-column='export-total-count']");
            var rowColor = $container.find(".row-table-colors-export-pop-up[data-column='row-table-aggregate-color']")
                .attr("disabled", "disabled");
            row.find(".export-portrait-orientation").attr("disabled", "disabled");

            $container.find(".export-include-grid-lines").attr("checked", "true");
            //For every checkbox in the display columns on the load of export-pop-up

            for (var i = 0; i < allColumns.length; i++) {
                var isVisibleNotChecked = $container.find(`.row-preference[data-column='${allColumns[i].name}']`)
                    .find(".column-is-visible").is(":checked") === false;

                var $temp = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);
                
                if (isVisibleNotChecked) {
                    $temp.find(".sum-is-visible").prop("checked", false);
                    $temp.find(".sum-is-visible").attr("disabled", "disabled");

                    $temp.find(".average-is-visible").prop("checked", false);
                    $temp.find(".average-is-visible").attr("disabled", "disabled");

                    $temp.find(".count-is-visible").prop("checked", false);
                    $temp.find(".count-is-visible").attr("disabled", "disabled");
                }
                else if (isVisibleNotChecked === false) {
                    if (allColumns[i].name == null || this.isDataTypeNumeric(allColumns[i]) === false) {
                        var $nonNumericColumnsExport = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);

                        $nonNumericColumnsExport.find(".sum-is-visible").prop("checked", false);
                        $nonNumericColumnsExport.find(".sum-is-visible").attr("disabled", "disabled");

                        $nonNumericColumnsExport.find(".average-is-visible").prop("checked", false);
                        $nonNumericColumnsExport.find(".average-is-visible").attr("disabled", "disabled");

                        $nonNumericColumnsExport.addClass("non-numeric-column");
                    }
                    else if (allColumns[i].name != null && this.isDataTypeNumeric(allColumns[i]) && this.listReference.status.aggregators != null) {
                        for (var j = 0; j < this.listReference.status.aggregators.length; j++) {
                            var $NumericColumn = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);

                            $NumericColumn.find(".average-is-visible").removeAttr("disabled");
                            $NumericColumn.find(".sum-is-visible").removeAttr("disabled");
                            $NumericColumn.find(".count-is-visible").removeAttr("disabled");

                            if (this.listReference.status.aggregators[j].column == allColumns[i].name &&
                                this.listReference.status.aggregators[j].type === AggregatorTypes.SUM) {
                                $NumericColumn.find(".sum-is-visible").prop("checked", this.listReference.status.aggregators[j].enabled);
                            }

                            if (this.listReference.status.aggregators[j].column == allColumns[i].name &&
                                this.listReference.status.aggregators[j].type === AggregatorTypes.AVERAGE) {
                                $NumericColumn.find(".average-is-visible").prop("checked", this.listReference.status.aggregators[j].enabled);
                            }

                            if (this.listReference.status.aggregators[j].column == allColumns[i].name &&
                                this.listReference.status.aggregators[j].type === AggregatorTypes.COUNT) {
                                $NumericColumn.find(".count-is-visible").prop("checked", this.listReference.status.aggregators[j].enabled);
                            }
                        }
                    }
                }
            }

            if (groupColumns.length != 0) {
                for (var i = 0; i < groupColumns.length; i++) {
                    var $currentRow = $container.find(`.row-preference[data-column='${groupColumns[i].column}']`);
                    if ($currentRow != null) {
                        $currentRow.find(".column-is-visible").prop("checked", true);
                        $currentRow.find(".column-is-visible").attr("disabled", "disabled");
                        $currentRow.find(".count-is-visible").removeAttr("disabled");
                    }
                }
                nonGroupCnt.attr("disabled", "disabled");
                nonGroupCnt.find(".export-non-group-count").attr("checked", "false");
                nonGroupCnt.find(".export-non-group-count").attr("disabled", "disabled");
            }
            else {
                var exportGroupData = $container.find(".row-table-export-pop-up[data-column='export-group-data']")
                    .attr("disabled", "disabled");
                exportGroupData.find(".export-only-group-data").attr("disabled", "disabled");
                $container.find(".row-table-colors-export-pop-up[data-column='row-table-group-color']")
                    .attr("disabled", "disabled");
                $container.find("#group-lines-color").attr("disabled", "disabled");
                nonGroupCnt.removeAttr("disabled");
                nonGroupCnt.find(".export-non-group-count").removeAttr("disabled");
            }
            //Listeners of the export PopUp
            $container.find(".checkall-header-isvisible").on("click",
                function () {
                    var checkAll = $(this).data("state") === "unchecked";

                    for (var i = 0; i < allColumns.length; i++) {
                        var rowWithNoVisibleDisabled = $container
                            .find(`.row-preference[data-column='${allColumns[i].name}']`)
                            .find(".column-is-visible")
                            .is(":disabled") === false;

                        var $temp = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);

                        if (rowWithNoVisibleDisabled === false) continue;

                        $temp.find(".column-is-visible").prop("checked", checkAll).change();
                    }

                    $(this).data("state", checkAll === true ? "checked" : "unchecked");
                });

            $container.find(".checkall-header-issum")
                .on("click",
                function () {
                    var checkAll = $(this).data("state") === "unchecked";
                    for (var i = 0; i < allColumns.length; i++) {
                        var rowWithNoVisibleDisabled = $container
                            .find(`.row-preference[data-column='${allColumns[i].name}']`)
                            .find(".sum-is-visible")
                            .is(":disabled") === false;

                        var $temp = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);

                        if (rowWithNoVisibleDisabled === false) continue;

                        $temp.find(".sum-is-visible").prop("checked", checkAll).change();
                    }

                    $(this).data("state", checkAll === true ? "checked" : "unchecked");
                });

            $container.find(".checkall-header-isaverage")
                .on("click",
                function () {
                    var checkAll = $(this).data("state") === "unchecked";
                    for (var i = 0; i < allColumns.length; i++) {
                        var rowWithNoVisibleDisabled = $container
                            .find(`.row-preference[data-column='${allColumns[i].name}']`)
                            .find(".average-is-visible")
                            .is(":disabled") === false;

                        var $temp = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);

                        if (rowWithNoVisibleDisabled === false) continue;

                        $temp.find(".average-is-visible").prop("checked", checkAll).change();
                    }
                    $(this).data("state", checkAll === true ? "checked" : "unchecked");
                });

            $container.find(".checkall-header-iscount")
                .on("click",
                function () {
                    var checkAll = $(this).data("state") === "unchecked";
                    for (var i = 0; i < allColumns.length; i++) {
                        var rowWithNoVisibleDisabled = $container
                            .find(`.row-preference[data-column='${allColumns[i].name}']`)
                            .find(".count-is-visible")
                            .is(":disabled") === false;
                        var $temp = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);

                        if (rowWithNoVisibleDisabled === false) continue;

                        $temp.find(".count-is-visible").prop("checked", checkAll);
                    }
                    $(this).data("state", checkAll === true ? "checked" : "unchecked");
                });
          
            $container.find("#disCols").click(function ($container) {
                    var state = $(this).data("state");
                    //$("#exportDisplayColumns").removeClass("hideColumnsPopUp");

                    if (state == "collapsed") {
                        //$(this).closest(".clms-pop-up").css("height", "725px");
                        $("#exportDisplayColumns").slideDown("fast");
                        $(this).data("state", "expand");
                    }
                    else {
                        var displayColumns = this;
                        $("#exportDisplayColumns").slideUp("fast");

                        $(this).data("state", "collapsed");
                    }
                });

            $container.find(".column-is-visible").on("change", function () {
                    var isVisible = $(this).is(":checked") === true;
                    var $parentRow = $(this).closest(".row-preference");
                    var $sumRowChkBox = $parentRow.find(".sum-is-visible");
                    var $avgRowChkBox = $parentRow.find(".average-is-visible");
                    var $countRowChkBox = $parentRow.find(".count-is-visible");
                    
                    if (isVisible === false) {
                        $sumRowChkBox.prop("checked", false);
                        $sumRowChkBox.attr("disabled", "disabled");

                        $avgRowChkBox.prop("checked", false);
                        $avgRowChkBox.attr("disabled", "disabled");

                        $countRowChkBox.prop("checked", false);
                        $countRowChkBox.attr("disabled", "disabled");
                    }
                    else if (isVisible === true) {
                        if ($parentRow.hasClass("non-numeric-column") === false) {
                            $sumRowChkBox.removeAttr("disabled");
                            $avgRowChkBox.removeAttr("disabled");
                        }

                        $countRowChkBox.removeAttr("disabled");
                    }
                });

            $container.find(".sum-is-visible").on("change", function () {
                var isSumChecked = $(this).is(":checked") === true;

                    if (isSumChecked === false) {
                        for (var i = 0; i < self.listReference.status.columnInfo.length; i++) {
                            var column = self.listReference.status.columnInfo[i];
                            var currentRow = $container.find(`.row-preference[data-column='${column.name}']`);

                            var isCurrentAverageChecked =
                                currentRow.find(".average-is-visible").is(":checked") === true
                            if (isCurrentAverageChecked === true) return;

                            var isTotalCountChecked = $container.find(".export-non-group-count").is(":checked") ===
                                true
                            if (isTotalCountChecked === true) return;
                        }
                        $container.find(".row-table-colors-export-pop-up[data-column='row-table-aggregate-color']")
                            .attr("disabled", "disabled");
                        $container.find("#aggregate-lines-color").attr("disabled", "disabled");
                    }
                    else if (isSumChecked === true) {
                        rowColor.removeAttr("disabled");                        
                    }
                });

            $container.find(".average-is-visible").on("change", function () {
                    var isAverageChecked = $(this).is(":checked") === true;
                    if (isAverageChecked === false) {
                        for (var i = 0; i < self.listReference.status.columnInfo.length; i++) {
                            var column = self.listReference.status.columnInfo[i];
                            var currentRow = $container.find(`.row-preference[data-column='${column.name}']`);

                            var isCurrentSumChecked = currentRow.find(".sum-is-visible").is(":checked") === true
                            if (isCurrentSumChecked === true) return;

                            var isTotalCountChecked = $container.find(".export-non-group-count").is(":checked") === true
                            if (isTotalCountChecked === true) return;
                        }
                        $container.find(".row-table-colors-export-pop-up[data-column='row-table-aggregate-color']")
                            .attr("disabled", "disabled");
                        $container.find("#aggregate-lines-color").attr("disabled", "disabled");
                    }
                    else if (isAverageChecked === true) {
                        rowColor.removeAttr("disabled");                        
                    }
                });

            $container.find(".export-only-group-data").on("change", function () {
                    var exportOnlyGroupData = $(this).is(":checked") === true;
                    var allColumns = self.listReference.status.columnInfo;
                    var nonGroupColumns = allColumns.filter(function (x) {
                        for (var i = 0; i < self.listReference.status.groupBy.length; i++) {
                            if (x.name == self.listReference.status.groupBy[i].column.name) return false;
                        }
                        return true;
                    });

                    if (exportOnlyGroupData === true) {
                        $container.find(".row-table-colors-export-pop-up[data-column='row-table-odd-color']")
                            .attr("disabled", "disabled");
                        $container.find("#odd-lines-color").attr("disabled", "disabled");

                        $container.find(".row-table-colors-export-pop-up[data-column='row-table-even-color']")
                            .attr("disabled", "disabled");
                        $container.find("#even-lines-color").attr("disabled", "disabled");
                        for (var i = 0; i < allColumns.length; i++) {
                            var $rowWithChkBoxes = $container.find(`.row-preference[data-column='${allColumns[i].name}']`);

                            var groupColumnsFiltered = groupColumns.filter(function (obj) {
                                if (obj.column === allColumns[i].caption) return true;
                                return false;
                            });

                            var flag;
                            if (groupColumnsFiltered.length == 0)
                                flag = false;
                            else
                                flag = groupColumnsFiltered[0].column === allColumns[i].caption

                            if (self.isDataTypeNumeric(allColumns[i]) === true || flag) {
                                $rowWithChkBoxes.find(".column-is-visible").prop("checked", true).change();
                            }
                            else {
                                $rowWithChkBoxes.find(".column-is-visible").prop("checked", false);
                                $rowWithChkBoxes.find(".column-is-visible").attr("disabled", "disabled");
                                $rowWithChkBoxes.removeAttr("disabled");
                            }
                        }
                    } else {
                        $container.find(".row-table-colors-export-pop-up[data-column='row-table-odd-color']")
                            .removeAttr("disabled");
                        $container.find("#odd-lines-color").removeAttr("disabled");

                        $container.find(".row-table-colors-export-pop-up[data-column='row-table-even-color']")
                            .removeAttr("disabled");
                        $container.find("#even-lines-color").removeAttr("disabled");
                        for (var i = 0; i < nonGroupColumns.length; i++) {
                            var $rowWithChkBoxes = $container
                                .find(`.row-preference[data-column='${nonGroupColumns[i].name}']`);
                            $rowWithChkBoxes.find(".column-is-visible").removeAttr("disabled");
                            $rowWithChkBoxes.find(".column-is-visible").prop("checked", true).change();
                            $rowWithChkBoxes.removeAttr("disabled");

                        }
                    }
                });

            $container.find(".export-type").on("change", function () {
                    var $orientation = $container
                        .find(".row-table-export-pop-up[data-column='export-PDFportrait-orientation']");
                    if ($(this).val().toString() === "PDF") {
                        $orientation.removeAttr("disabled");
                        $orientation.find(".export-portrait-orientation").removeAttr("disabled");
                    } else {
                        $orientation.attr("disabled", "disabled");
                        $orientation.find(".export-portrait-orientation").attr("checked", "false");
                        $orientation.find(".export-portrait-orientation").attr("disabled", "disabled");
                    }
                });

            $container.find(".export-non-group-count").on("change", function () {
                    var totalCountChecked = $(this).is(":checked") === true;
                    if (totalCountChecked === false) {
                        for (var i = 0; i < self.listReference.status.columnInfo.length; i++) {
                            var column = self.listReference.status.columnInfo[i];

                            var currentRow = $container.find(`.row-preference[data-column='${column.name}']`);
                            var isCurrentSumChecked = currentRow.find(".sum-is-visible").is(":checked") === true
                            if (isCurrentSumChecked === true) return;

                            var isCurrentAverageChecked =
                                currentRow.find(".average-is-visible").is(":checked") === true
                            if (isCurrentAverageChecked === true) return;
                        }
                        $container.find(".row-table-colors-export-pop-up[data-column='row-table-aggregate-color']")
                            .attr("disabled", "disabled");
                        $container.find("#aggregate-lines-color").attr("disabled", "disabled");
                    }
                    else if (totalCountChecked === true) {
                        rowColor.removeAttr("disabled");                       
                    }
                });

            this.addScrollListener($container.find(".export-table-display-columns"));            
        }

        private addScrollListener($element) {
            $element.on("mousewheel",
                function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const scrollMovement = -(e.originalEvent.wheelDelta / 2);
                    $(this).scrollTop(scrollMovement + $(this).scrollTop());
                });
        }

        private isDataTypeNumeric(columnInfo: ColumnInfo) {
            return Common.getMambaDataType(columnInfo.mambaDataType) === MambaDataType.NUMBER;
        }

        private populateVisibleColumns($container) {
            var $rows = $container.find(".row-preference");
            var JSONObj = [];
            for (var i = 0; i < $container.find(".row-preference").length; i++) {

                var $row = $rows.eq(i)
                var columnName = $row.data("column");
                var columnIsVisible = $row.find(".column-is-visible").is(":checked") === true;
                var sumIsVisible = $row.find(".sum-is-visible").is(":checked") === true;
                var averageIsVisible = $row.find(".average-is-visible").is(":checked") === true;
                var countIsVisible = $row.find(".count-is-visible").is(":checked") === true;
                var item = {};
                item["column"] = columnName;
                item["isVisible"] = columnIsVisible;
                item["sumIsVisible"] = sumIsVisible;
                item["averageIsVisible"] = averageIsVisible;
                item["countIsVisible"] = countIsVisible;

                JSONObj.push(item);
            }
            return JSONObj;
        }

        private addAggregatorsForExport($container, visibleColumnsCollection) {
            const exportAggregatorInfo = [];

            for (let j = 0; j < visibleColumnsCollection.length; j++) {
                const columnName = visibleColumnsCollection[j].column;
                const columnInfo = this.listReference.status.columnInfo.filter((col) => { return col.name === columnName; })[0];
                const exportRowOptions = $container.find(`.row-preference[data-column='${columnName}']`);

                if (columnInfo == undefined || exportRowOptions.length !== 1) {
                    this.listReference.handleError(`DATALIST ERROR: Could not find columnInfo or export options for column ${columnName} during aggregator export`);
                    continue;
                }

                const istSumChecked = exportRowOptions.find(".sum-is-visible").is(":checked") === true;
                const isAverageChecked = exportRowOptions.find(".average-is-visible").is(":checked") === true;
                const istCountChecked = exportRowOptions.find(".count-is-visible").is(":checked") === true;

                if (istSumChecked) {
                    columnName.SumIsVisible = true;
                    exportAggregatorInfo.push(new DataListAggregatorInfo(columnInfo.name, AggregatorTypes.SUM));
                }

                if (isAverageChecked) {
                    columnName.AverageIsVisible = true;
                    exportAggregatorInfo.push(new DataListAggregatorInfo(columnInfo.name, AggregatorTypes.AVERAGE));
                }

                if (istCountChecked) {
                    columnName.CountIsVisible = true;
                    exportAggregatorInfo.push(new DataListAggregatorInfo(columnInfo.name, AggregatorTypes.COUNT));
                }
            }

            return JSON.stringify(exportAggregatorInfo);
        }

        private prepareRequestParameters(exportOptions) {
            if (typeof (exportOptions) == "undefined") exportOptions = {};
            if (typeof (exportOptions.type) == "undefined") exportOptions.type = "";
            if (typeof (exportOptions.range) == "undefined") exportOptions.exportRange = "";
            if (typeof (exportOptions.onlyGroups) == "undefined") exportOptions.exportOnlyGroups = "";
            if (typeof (exportOptions.filename) == "undefined") exportOptions.filename = "";
            if (typeof (exportOptions.includeGridLines) == "undefined") exportOptions.includeGridLines = "";
            if (typeof (exportOptions.portraitOrientation) == "undefined") exportOptions.portraitOrientation = "False";
            if (typeof (exportOptions.visibleColumns) == "undefined") exportOptions.visibleColumns = [];
            if (typeof (exportOptions.groupColor) == "undefined") exportOptions.groupColor = null;
            if (typeof (exportOptions.headerColor) == "undefined") exportOptions.headerColor = null;
            if (typeof (exportOptions.evenColor) == "undefined") exportOptions.evenColor = null;
            if (typeof (exportOptions.oddColor) == "undefined") exportOptions.oddColor = null;
            if (typeof (exportOptions.aggregateColor) == "undefined") exportOptions.aggregateColor = null;
            if (typeof (exportOptions.nonGroupCount) == "undefined") exportOptions.includeGridLines = "";

            
            return {
                StartRow: this.listReference.status.startRow,
                RowSize: this.listReference.status.pageSize,
                Filters: this.listReference.status.filters,
                OrderBy: this.listReference.status.orderBy,
                GroupBy: this.listReference.status.groupBy,
                Aggregators: false // this.listReference.status.getGroupsClosed || exportOptions.type !== ""
                    ? this.listReference.status.aggregators
                    : null,
                GetGroupsClosed: false, //this.listReference.status.getGroupsClosed, TODO
                handler: this.listReference.serversideElementId,
                exportOptions: exportOptions
            }
        }

        private export(opts) {

            const requestParameters = this.prepareRequestParameters({
                type: opts.type,
                range: opts.range,
                onlyGroups: opts.onlyGroups,
                filename: opts.fileName,
                includeGridLines: opts.includeGridLines,
                portraitOrientation: opts.portraitOrientation,
                columnOptions: opts.visibleColumnsCollection,
                groupColor: opts.groupColor,
                headerColor: opts.headerColor,
                evenColor: opts.evenColor,
                oddColor: opts.oddColor,
                aggregateColor: opts.aggregateColor,
                aggregatorsRequest: opts.aggregatorsRequest,
                nonGroupCount: opts.nonGroupCount
            });

            Joove.Core.executeControllerActionNew({
                action: this.listReference.serversideElementId + "_Export",
                controller: window._context.currentController,
                postData: {
                    model: window.$form.model,
                    exportData: requestParameters,
                    datasourceRequest: this.listReference.prepareDatasourceRequestInfo()
                },
                verb: "POST",
                cb: (downloadInfo) => {
                    if (downloadInfo == null || downloadInfo.Data == null) {
                        window._popUpManager.error("Could not prepare list export file for download!");
                        return;
                    }

                    CLMS.Framework.Utilities.OpenWindow(`${window._context.siteRoot}/${window._context.currentController}/DownloadFile?id=${downloadInfo.Data}`);
                }
            });
        }
    }
}
