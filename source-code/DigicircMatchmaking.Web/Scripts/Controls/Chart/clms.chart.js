var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var PieLabelType;
        (function (PieLabelType) {
            PieLabelType[PieLabelType["none"] = 0] = "none";
            PieLabelType[PieLabelType["label"] = 1] = "label";
            PieLabelType[PieLabelType["percentage"] = 2] = "percentage";
            PieLabelType[PieLabelType["value"] = 3] = "value";
        })(PieLabelType = Widgets.PieLabelType || (Widgets.PieLabelType = {}));
        var ChartHelper = /** @class */ (function () {
            function ChartHelper($element, $scope) {
                this._data = null;
                this.minX = null;
                this.minY = null;
                this.maxX = null;
                this.maxY = null;
                this._$element = $element;
                this._$scope = $scope;
                this._chart = null;
                this._type = null;
                this._options = null;
                this._data = null;
                this._usedColorPositions = [];
                this._nextColorPosition = -1;
                this._totalDataSets = 0;
                this._fromMasterPage = false; // TODO!!!
                this._preferences = {
                    filterBy: []
                };
                // Crawled from http://flatcolors.net/
                this._pallette = [
                    "#a694ff", "#a59891",
                    "#98a7ad", "#ea7d7d",
                    "#80d27a", "#99b4f4",
                    "#fed444", "#3f3f3f",
                    "#b6696c", "#417d83",
                    "#ff9750"
                ];
                this._resources = window._resourcesManager.getChartResources();
            }
            Object.defineProperty(ChartHelper.prototype, "FillParentSize", {
                get: function () {
                    return this._options.fillParentSize;
                },
                enumerable: false,
                configurable: true
            });
            ChartHelper.prototype.Init = function () {
                this._type = this.getChartType();
                this._datasetColumnInfo = this.getDatasetColumnInfo();
                this._options = this.getOptions();
                this._options.legendTextOverflow = {
                    maxLabelWidth: 200
                };
                this.InitChartToolbar();
                this.enhanceOptions();
                this.updateChart();
                this.UpdateInstanceDisc();
            };
            ChartHelper.prototype.enhanceOptions = function () {
                this.InitChartPieceLabel();
                this.InitChartTooltipMode();
                this.InitCustomTickFormats();
                if (this._options.ignoreThemeDefinedColors == false) {
                    this.setColorsBasedOnTheme();
                }
                else {
                    this._pallette = this._options.pallette;
                }
            };
            ChartHelper.prototype.bubbleFitContent = function () {
                if (this._options.scales == null)
                    return;
                if (this._options.scales.xAxes != null) {
                    var notch = (Math.abs(this.minX) + Math.abs(this.maxX)) / 2;
                    console.log(this.minX, this.maxX, notch);
                    if (this._options.scales.xAxes[0].ticks != null) {
                        this._options.scales.xAxes[0].ticks.min = this._options.scales.xAxes[0].ticks.min || this.minX - notch;
                        this._options.scales.xAxes[0].ticks.max = this._options.scales.xAxes[0].ticks.max || this.maxX + notch;
                        this._options.scales.xAxes[0].ticks.stepSize = this._options.scales.xAxes[0].ticks.stepSize || notch;
                    }
                }
                if (this._options.scales.yAxes != null) {
                    var notch = (Math.abs(this.minY) + Math.abs(this.maxY)) / 2;
                    console.log(this.minY, this.maxY, notch);
                    if (this._options.scales.yAxes[0].ticks != null) {
                        this._options.scales.yAxes[0].ticks.min = this._options.scales.yAxes[0].ticks.min || this.minY - notch;
                        this._options.scales.yAxes[0].ticks.max = this._options.scales.yAxes[0].ticks.max || this.maxY + notch;
                        this._options.scales.yAxes[0].ticks.stepSize = this._options.scales.yAxes[0].ticks.stepSize || notch;
                    }
                }
            };
            ChartHelper.prototype.setColorsBasedOnTheme = function () {
                var chartVariables = window._themeManager.getAllControlVariablesByElement(this._$element);
                if (chartVariables == null || chartVariables.length == 0)
                    return;
                // pallette
                this._pallette = [];
                for (var i = 0; i < chartVariables.length; i++) {
                    var current = chartVariables[i];
                    if (current.name.indexOf("@Pallette") == -1)
                        continue;
                    this._pallette.push(current.value);
                }
                // Axes colors
                this.applyAxesColorsBasedOnTheme();
            };
            ChartHelper.prototype.applyAxesColorsBasedOnTheme = function () {
                var legendFontColor = window._themeManager.getControlVariableByElement("@LegendLabelsColor", this._$element);
                var titleColor = window._themeManager.getControlVariableByElement("@TitleColor", this._$element);
                var gridLinesColor = window._themeManager.getControlVariableByElement("@ScaleGridLineColor", this._$element);
                var zeroGridLinesColor = window._themeManager.getControlVariableByElement("@ScaleZeroGridLineColor", this._$element);
                var ticksColor = window._themeManager.getControlVariableByElement("@ScaleTickColor", this._$element);
                var labelColor = window._themeManager.getControlVariableByElement("@ScaleLabelColor", this._$element);
                if (legendFontColor != null) {
                    this.nullSafeValueAssignToPath(legendFontColor.value, 'legend.labels.fontColor', this._options);
                    this.nullSafeValueAssignToPath(titleColor.value, 'title.fontColor', this._options);
                }
                var chartType = this.getChartType();
                if (chartType == "pie" || chartType == "doughnut")
                    return; // no more customization is needed
                if (gridLinesColor != null || zeroGridLinesColor != null || ticksColor != null || labelColor != null) {
                    this.instantiateScales();
                }
                if (gridLinesColor != null) {
                    this.applyValueToAxes(gridLinesColor.value, "gridLines.color");
                }
                if (zeroGridLinesColor != null) {
                    this.applyValueToAxes(zeroGridLinesColor.value, "gridLines.zeroLineColor");
                }
                if (labelColor != null) {
                    this.applyValueToAxes(labelColor.value, "scaleLabel.fontColor");
                }
                if (ticksColor != null) {
                    this.applyValueToAxes(ticksColor.value, "ticks.fontColor");
                }
            };
            ChartHelper.prototype.instantiateScales = function () {
                if (this._options.scales == null) {
                    this._options.scales = {};
                }
                if (this._options.scales.xAxes == null) {
                    this._options.scales.xAxes = [{}];
                }
                if (this._options.scales.yAxes == null) {
                    this._options.scales.yAxes = [{}];
                }
            };
            ChartHelper.prototype.applyValueToAxes = function (color, path) {
                for (var i = 0; i < this._options.scales.xAxes.length; i++) {
                    var ax = this._options.scales.xAxes[i];
                    this.nullSafeValueAssignToPath(color, path, ax);
                }
                for (var i = 0; i < this._options.scales.yAxes.length; i++) {
                    var ax = this._options.scales.yAxes[i];
                    this.nullSafeValueAssignToPath(color, path, ax);
                }
            };
            ChartHelper.prototype.nullSafeValueAssignToPath = function (value, path, parent) {
                var parts = path.split(".");
                for (var i = 0; i < parts.length; i++) {
                    var current = parts[i];
                    if (parent[current] == null) {
                        parent[current] = {};
                    }
                    if (i == parts.length - 1) {
                        parent[current] = value;
                    }
                    else {
                        parent = parent[current];
                    }
                }
            };
            ChartHelper.prototype.InitChartTooltipMode = function () {
                if (this._options.tooltipMode == null)
                    return;
                this._options.tooltips = {
                    cornerRadius: 0
                };
                switch (this._options.tooltipMode) {
                    case 0:
                        this._options.tooltips.mode = 'index';
                        this._options.tooltips.intersect = false;
                        this._options.tooltips.position = 'nearest';
                        break;
                    case 1:
                        this._options.tooltips.mode = 'nearest';
                        this._options.tooltips.intersect = true;
                        this._options.tooltips.position = 'nearest';
                        break;
                    default:
                        break;
                }
            };
            ChartHelper.prototype.InitChartPieceLabel = function () {
                var _this = this;
                if (this._options.pieLabelConfig == null)
                    return;
                var pieLabelConfig = this._options.pieLabelConfig;
                if (pieLabelConfig.format != null) {
                    pieLabelConfig.format = new Joove.ValueFormat(pieLabelConfig.format);
                }
                if (this._options.plugins != null
                    && this._options.plugins.percentPie != null
                    && this._options.plugins.percentPie.enable) {
                    this._options.plugins.percentPie.format = new Joove.ValueFormat(this._options.tooltipValueFormat);
                    pieLabelConfig.format = new Joove.ValueFormat({ postfix: "%" });
                }
                this._options.pieLabelFontSize = (this._options.pieLabelFontSize == 0) ? 14 : this._options.pieLabelFontSize;
                this._options.pieceLabel = {
                    // render: 'percentage', //  'label', 'value', 'percentage'
                    render: function (args) {
                        var type = PieLabelType[pieLabelConfig.type];
                        if (pieLabelConfig.type == PieLabelType.value) {
                            return (pieLabelConfig.format != null) ?
                                pieLabelConfig.format.formatNumber(args[type]) : args[type];
                        }
                        if (pieLabelConfig.type == PieLabelType.label) {
                            return args[type];
                        }
                        else {
                            var format = new Joove.ValueFormat({ postfix: "%" });
                            if (pieLabelConfig.format != null) {
                                format.postfix = "%";
                            }
                            return format.format(args[type]);
                        }
                    },
                    textShadow: false,
                    // arc: true,
                    //position: 'border',
                    precision: 2,
                    fontSize: this._options.pieLabelFontSize,
                    fontColor: function (data) {
                        if (typeof (data.dataset.backgroundColor) == "string") {
                            data.dataset.backgroundColor = [data.dataset.backgroundColor];
                        }
                        if (data.dataset.backgroundColor.length <= data.index) {
                            data.index = data.dataset.backgroundColor.length - 1;
                        }
                        var rgb = _this.ToRgb(data.dataset.backgroundColor[data.index]);
                        if (rgb == null) {
                            rgb = _this.ToRgb(_this.hexToRgb(data.dataset.backgroundColor[data.index], 1));
                        }
                        var threshold = 140;
                        var luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
                        return luminance > threshold ? 'black' : 'white';
                    }
                };
            };
            ChartHelper.prototype.InitCustomTickFormats = function () {
                if (this._options.scales == null)
                    return;
                if (this._options.scales.xAxes != null) {
                    this._options.scales.xAxes = this.ParseScaleOptions(this._options.scales.xAxes);
                }
                if (this._options.scales.yAxes != null) {
                    this._options.scales.yAxes = this.ParseScaleOptions(this._options.scales.yAxes);
                }
            };
            ChartHelper.prototype.ParseScaleOptions = function (scales) {
                var parsedScales = [];
                var _loop_1 = function (i) {
                    var scale = scales[i];
                    var format = scale.format;
                    if (format != null) {
                        format = new Joove.ValueFormat(format);
                        delete scale.format;
                        scale.ticks = scale.ticks || {};
                        scale.formatNumber = format;
                        scale.ticks.callback = function (value, index, values) {
                            return format.format(value);
                        };
                    }
                    parsedScales.push(scale);
                    if (scale.type === "time") {
                        var dateFormat_1 = Joove.GlobalizationManager.GetCurrentLocaleManager().DateTimeFormat;
                        scale.time = scale.time || {};
                        var tooltipFormat = scale.time.tooltipFormat;
                        if (tooltipFormat != null) {
                            delete scale.time.tooltipFormat;
                            scale.time.tooltipFormat = Joove.Common.changeDateTimeFormat(tooltipFormat.backEndFormatting);
                        }
                        scale.time.parser = function (value) {
                            if (typeof value === 'number' || (typeof value === 'object' && value.addDays != null)) {
                                return moment(value);
                            }
                            var date = CLMS.Framework.DateTime.ParseExact(value, Joove.Core.ApplicationLocale(), dateFormat_1.GeneralLongTimePattern());
                            if (date.isValid() != true)
                                return moment(value);
                            return date;
                        };
                    }
                };
                for (var i = 0; i < scales.length; i++) {
                    _loop_1(i);
                }
                return parsedScales;
            };
            ChartHelper.GetChartName = function (name) {
                return "" + Joove.Core.GetElementNameFromId(name);
            };
            ChartHelper.prototype.UpdateInstanceDisc = function () {
                var name = Joove.Widgets.ChartHelper.GetChartName(this._$element.attr("jb-id"));
                if (Joove.Widgets.ChartHelper.instancesDic[name] == null) {
                    Joove.Widgets.ChartHelper.instancesDic[name] = {};
                }
                Joove.Widgets.ChartHelper.instancesDic[name][Joove.Common.getIndexKeyOfControl(this._$element)] = this;
            };
            ChartHelper.prototype.ToRgb = function (hex) {
                var result = /^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([0-9\.]{1,4}))?\)$/i.exec(hex.replace(/ /g, ""));
                return result ? {
                    r: parseInt(result[1], 10),
                    g: parseInt(result[2], 10),
                    b: parseInt(result[3], 10),
                    o: parseFloat(result[4])
                } : null;
            };
            ChartHelper.prototype.hexToRgb = function (hex, opacity) {
                if (hex == null || hex.toLowerCase().indexOf("rgb") == 0)
                    return hex;
                // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function (m, r, g, b) { return (r + r + g + g + b + b); });
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                var obj = result
                    ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    }
                    : null;
                if (obj == null)
                    return hex;
                return "rgba(" + obj.r + "," + obj.g + "," + obj.b + "," + opacity + ")";
            };
            ChartHelper.prototype.getChartType = function () {
                var attribute = this._$element.attr("jb-chart");
                switch (attribute) {
                    case "Pie":
                        return "pie";
                    case "Doughnut":
                        return "doughnut";
                    case "Line":
                        return "line";
                    case "Area":
                        return "line";
                    case "Bar":
                        return "bar";
                    case "HorizontalBar":
                        return "horizontalBar";
                    case "Radar":
                        return "radar";
                    case "Polar":
                        return "polarArea";
                    case "Bubble":
                        return "bubble";
                    case "Scatter":
                        return "scatter";
                    //return "bubble";
                    default:
                        console.error("Could not understand chart type: " + attribute);
                        return "pie";
                }
            };
            ChartHelper.prototype.getOptions = function () {
                return Joove.Core.GetOptions(this._$element, "jb-options");
            };
            ChartHelper.prototype.prepareRequest = function () {
                if (this._options.groupBy == null)
                    return null;
                var groupColumn = new Joove.ColumnInfo(this._options.groupBy.member, this._options.groupBy.dataType);
                var groupInfo = new Joove.GroupByInfo(groupColumn, Joove.GroupState.EXPANDED, false, true);
                var request = new Joove.DatasourceRequest(this._$element, 0, 99999);
                request.filters = this._preferences.filterBy;
                request.groupBy = [groupInfo];
                request.aggregators = [];
                for (var i = 0; i < this._options.values.length; i++) {
                    var current = this._options.values[i];
                    request.aggregators.push({
                        column: current.member,
                        type: current.type
                    });
                }
                return request;
            };
            ChartHelper.prototype.getChartData = function (cb) {
                var _this = this;
                var requestInfo = this.prepareRequest();
                Joove.DatasourceManager.fetch(this._$element, Joove.Core.getElementName(this._$element), requestInfo, {
                    success: function (response) {
                        var data = _this.prepareChartData(response);
                        cb && cb(data);
                    },
                    error: function () {
                        console.error("Error fetching chart datasource");
                    }
                }, [], this._fromMasterPage);
            };
            ChartHelper.prototype.getNextColor = function () {
                this._nextColorPosition++;
                if (this._nextColorPosition > this._pallette.length - 1) {
                    this._nextColorPosition = 0;
                }
                return this._pallette[this._nextColorPosition];
            };
            ChartHelper.prototype.getRandomColor = function () {
                var randomPosition = Math.floor(Math.random() * this._pallette.length);
                if (this._usedColorPositions.indexOf(randomPosition) > -1) {
                    return this.getRandomColor();
                }
                else {
                    this._usedColorPositions.push(randomPosition);
                    return this._pallette[randomPosition];
                }
            };
            ChartHelper.prototype.prepareChartData = function (response) {
                var data = {
                    labels: [],
                    datasets: []
                };
                if (response.Data == null || response.Data.length === 0)
                    return data;
                this._usedColorPositions = [];
                var first = response.Data[0];
                this._totalDataSets = first.Values.length;
                // Create DataSets
                for (var j = 0; j < this._totalDataSets; j++) {
                    var dataSet = void 0;
                    dataSet = null;
                    switch (this._type) {
                        case "doughnut":
                        case "pie":
                            dataSet = this.preparePieChartDataSet(response.Data, j);
                            break;
                        case "horizontalBar":
                        case "bar":
                            dataSet = this.prepareBarChartDataSet(response.Data, j);
                            break;
                        case "line":
                            dataSet = this.prepareLineChartDataSet(response.Data, j);
                            break;
                        case "polarArea":
                            dataSet = this.preparePolarChartDataSet(response.Data, j);
                            break;
                        case "radar":
                            dataSet = this.prepareRadarChartDataSet(response.Data, j);
                            break;
                        case "bubble":
                        case "scatter":
                            break;
                        default:
                            console.error("Chart type not implemented fully: " + this._type, this._$element[0]);
                            return null;
                    }
                    if (this._type === "bubble") {
                        data = this.prepareBubbleChartDataSet(response.Data);
                    }
                    else if (this._type === "scatter") {
                        data = this.prepareScatterChartDataSet(response.Data);
                    }
                    else {
                        if (first.ValueLabels != null) {
                            dataSet.label = first.ValueLabels[j] || "DataSet " + (j + 1);
                        }
                        data.datasets.push(dataSet);
                    }
                }
                // Set Labels for each data item
                for (var i = 0; i < response.Data.length; i++) {
                    var current = response.Data[i];
                    // hack for fixing js bug when items share labels...
                    while (data.labels.indexOf(current.Label) > -1) {
                        current.Label += " ";
                    }
                    data.labels.push(current.Label);
                }
                if (this._type === "bubble") {
                    this.bubbleFitContent();
                }
                this._data = data;
                return data;
            };
            ChartHelper.prototype.prepareLineChartDataSet = function (data, dataSetIndex) {
                var attribute = this._$element.attr("jb-chart");
                var dataSet = this.prepareDefaultDataSet(data, dataSetIndex, false);
                if (attribute === "Area") {
                    dataSet.fill = "origin";
                }
                return dataSet;
            };
            ChartHelper.prototype.prepareBarChartDataSet = function (data, dataSetIndex) {
                var set = this.prepareDefaultDataSet(data, dataSetIndex);
                return set;
            };
            ChartHelper.prototype.prepareRadarChartDataSet = function (data, dataSetIndex) {
                return this.prepareDefaultDataSet(data, dataSetIndex, false);
            };
            ChartHelper.prototype.preparePolarChartDataSet = function (data, dataSetIndex) {
                return this.prepareDefaultDataSet(data, dataSetIndex);
            };
            ChartHelper.prototype.preparePieChartDataSet = function (data, dataSetIndex) {
                return this.prepareDefaultDataSet(data, dataSetIndex);
            };
            ChartHelper.prototype.prepareScatterChartDataSet = function (data) {
                return this.prepareBubbleChartDataSet(data);
            };
            ChartHelper.prototype.prepareBubbleChartDataSet = function (data) {
                var set = {
                    labels: [],
                    datasets: []
                };
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    for (var j = 0; j < item.Values.length; j++) {
                        if (i === 0) {
                            set.labels.push(item.ValueLabels[j]);
                            set.datasets[j] = {
                                borderWidth: this._options.dataSetBorderWidth,
                                label: [item.ValueLabels[j]],
                                data: []
                            };
                        }
                        if (set.datasets[j] == null) {
                            set.labels.push(item.ValueLabels[j]);
                            set.datasets[j] = {
                                borderWidth: this._options.dataSetBorderWidth,
                                label: [item.ValueLabels[j]],
                                data: []
                            };
                        }
                        var y = parseFloat(item.Values[j]);
                        var r = parseFloat(item.Radius[j]);
                        var rnotch = Math.floor((r || 0) / 5);
                        var x = parseFloat(item.Label);
                        if (this.minX == null && x != null) {
                            this.minX = x - rnotch;
                        }
                        if (this.minY == null && y != null) {
                            this.minY = y - rnotch;
                        }
                        if (this.maxX == null && x != null) {
                            this.maxX = x + rnotch;
                        }
                        if (this.maxY == null && y != null) {
                            this.maxY = y + rnotch;
                        }
                        if (this.minX > x - rnotch) {
                            this.minX = x - rnotch;
                        }
                        if (this.minY > y - rnotch) {
                            this.minY = y - rnotch;
                        }
                        if (this.maxX < x + rnotch) {
                            this.maxX = x + rnotch;
                        }
                        if (this.maxY < y + rnotch) {
                            this.maxY = y + rnotch;
                        }
                        set.datasets[j].data.push({
                            x: x,
                            y: y,
                            r: r
                        });
                        this.applyColorsToDataSet(data, set.datasets[j], false, j);
                    }
                }
                return set;
            };
            ChartHelper.prototype.prepareDefaultDataSet = function (data, dataSetIndex, colorsAsArray) {
                var set = this.initializeDataSet(data, dataSetIndex);
                set.borderWidth = this._options.dataSetBorderWidth;
                this.applyColorsToDataSet(data, set, colorsAsArray, dataSetIndex);
                return set;
            };
            ChartHelper.prototype.applyColorsToDataSet = function (data, set, asArray, dataSetIndex) {
                var usedColors = JSON.parse(localStorage.getItem('usedColors') || '{}');
                var uniqueColor = 0;
                var label = "";
                if (asArray !== false) {
                    set.backgroundColor = [];
                    set.hoverBackgroundColor = [];
                    set.borderColor = [];
                    for (var i = 0; i < data.length; i++) {
                        var color = void 0;
                        if (this._options.ignoreThemeDefinedColors == true) {
                            if (this._type !== "pie" && this._type !== "doughnut" && this._type !== "polarArea") {
                                color = this._pallette[dataSetIndex % this._pallette.length];
                            }
                            else {
                                color = this.getNextColor();
                            }
                        }
                        else {
                            if (this._type !== "pie" && this._type !== "doughnut" && this._type !== "polarArea") {
                                label = data[i].ValueLabels[dataSetIndex];
                                uniqueColor = this.setColor(usedColors, label);
                            }
                            else {
                                label = data[i].Label;
                                uniqueColor = this.setColor(usedColors, label);
                            }
                            color = this._pallette[uniqueColor];
                        }
                        var toRgb = this.hexToRgb(color, 0.75);
                        set.backgroundColor.push(this._options.transparencyEffects ? toRgb : color);
                        set.borderColor.push(color);
                        set.hoverBackgroundColor.push(color);
                        if (this._options.ignoreThemeDefinedColors == false) {
                            this.saveUsedColor(usedColors, uniqueColor, label);
                        }
                    }
                }
                else {
                    var color = void 0;
                    if (this._options.ignoreThemeDefinedColors == false) {
                        label = data[0].ValueLabels[dataSetIndex];
                        uniqueColor = this.setColor(usedColors, label);
                        color = this._pallette[uniqueColor];
                        this.saveUsedColor(usedColors, uniqueColor, label);
                    }
                    else {
                        color = this._pallette[dataSetIndex % this._pallette.length];
                    }
                    var toRgb = this.hexToRgb(color, 0.75);
                    set.backgroundColor = this._options.transparencyEffects ? toRgb : color;
                    set.hoverBackgroundColor = color;
                    set.borderColor = color;
                }
            };
            ChartHelper.prototype.setColor = function (usedColors, label) {
                var uniqueColor = 0;
                if (usedColors[label] == null) {
                    uniqueColor = this.getColorWithLessUses(usedColors);
                }
                else {
                    uniqueColor = usedColors[label];
                }
                return uniqueColor;
            };
            ChartHelper.prototype.getColorWithLessUses = function (usedColors) {
                var minIndex = 0;
                var min = usedColors[0];
                if (min == null) {
                    return minIndex;
                }
                for (var i = 1; i < this._pallette.length; i++) {
                    var countOfColors = usedColors[i];
                    if (countOfColors == null) {
                        return i;
                    }
                    if (usedColors[i] < min) {
                        min = usedColors[i];
                        minIndex = i;
                    }
                }
                return minIndex;
            };
            ChartHelper.prototype.saveUsedColor = function (usedColors, uniqueColor, label) {
                usedColors[uniqueColor] = usedColors[uniqueColor] || 0;
                if (usedColors[label] == null) {
                    usedColors[uniqueColor]++;
                    usedColors[label] = uniqueColor;
                }
                localStorage.setItem('usedColors', JSON.stringify(usedColors));
            };
            ChartHelper.prototype.initializeDataSet = function (data, dataSetIndex) {
                var set = {
                    label: "",
                    data: [],
                    items: data,
                    borderWidth: 0
                };
                for (var i = 0; i < data.length; i++) {
                    set.data.push(data[i].Values[dataSetIndex] || 0);
                }
                return set;
            };
            ChartHelper.prototype.setSelectedItem = function (evt) {
                var activePoint = this._chart.getElementAtEvent(evt);
                if (activePoint.length === 0)
                    return;
                var datasetIndex = activePoint[0]._datasetIndex;
                var itemIndex = activePoint[0]._index;
                var dataset = this._data.datasets[datasetIndex];
                var entry = dataset.items[itemIndex];
                this._$scope.selectedItem = entry.Item;
                this._$scope.selectedItems = [entry.Item];
                this._$scope.selectedDataSetIndex = datasetIndex;
            };
            ChartHelper.prototype.registerFilterBasePopUp = function ($contents, widget, title, name) {
                var self = this;
                window._popUpManager.destroyPopUp(name);
                window._popUpManager.registerPopUp({
                    name: name,
                    width: "80%",
                    height: "60%",
                    cancelButton: true,
                    okButton: true,
                    okCallback: function (e) {
                        var filter = widget.getDataSourceTerms();
                        if (filter == null) {
                            return 1;
                        }
                        self.applyPrerencesPopup(e, filter);
                        if (widget instanceof Widgets.QuickFilterDatasourceWidget) {
                            self._filterWidget.redraw(self._preferences.filterBy);
                        }
                        else if (widget instanceof Widgets.FilterDatasourceWidget) {
                            self._quickFilterWidget.redraw(self._preferences.filterBy);
                        }
                    },
                    title: title,
                    $elementContent: $contents
                });
            };
            ChartHelper.prototype.preparePreferencesPopUp = function () {
                this._filterWidget = new Widgets.FilterDatasourceWidget({
                    columns: this._datasetColumnInfo,
                    filters: [],
                    resources: this._resources,
                    controlName: Joove.Core.getElementName(this._$element)
                });
                var popUpId = "chart-preferences";
                var $contents = $("<div class='chart-preferences-pop-up'><div id=\"chart-preferences-popup-container\"></div><br /><div class='chart-preferences-pop-up-footer list-pop-up-chart-preferences'><button class='btn btn-primary filters-pop-up-btn-clear'>" + this._resources.ClearAll + "</button></div></div>");
                this._filterWidget.draw($("#chart-preferences-popup-container", $contents));
                this.registerFilterBasePopUp($contents, this._filterWidget, this._resources.PreferencesPopUpTitle, popUpId);
            };
            ChartHelper.prototype.prepareQuickFilterPopUp = function () {
                this._quickFilterWidget = new Widgets.QuickFilterDatasourceWidget({
                    columns: this._datasetColumnInfo,
                    filters: [],
                    resources: this._resources,
                    controlName: Joove.Core.getElementName(this._$element)
                });
                var $contents = $("<div class=\"filters-pop-up\"><div id=\"chart-quick-filter-popup-container\"></div></div>");
                this._quickFilterWidget.draw($("#chart-quick-filter-popup-container", $contents));
                this.registerFilterBasePopUp($contents, this._quickFilterWidget, this._resources.QuickFilters, "chart-quick-filter");
            };
            ChartHelper.prototype.InitChartToolbar = function () {
                var _this = this;
                this._$element.before("\n<div class=\"chart-toolbar\">\n    <span class=\"glyphicon glyphicon-cog\" id=\"chart-preferences-button\" title=\"" + this._resources.PreferencesPopUpTitle + "\"></span>\n    <span class=\"glyphicon glyphicon-filter\" id=\"chart-quick-filter-button\"  title=\"" + this._resources.QuickFilters + "\"></span>\n</div><h1 class=\"no-records\">" + this._resources.NoRecords + "</h1>");
                $(".no-records").hide();
                this.preparePreferencesPopUp();
                this.prepareQuickFilterPopUp();
                $("#chart-preferences-button", this._$element.parent())
                    .click(function (e) {
                    _this.showPreferencesPopUp(e);
                });
                $("#chart-quick-filter-button", this._$element.parent())
                    .click(function (e) {
                    _this.showQuickFilterPopUp(e);
                });
            };
            ChartHelper.prototype.showPreferencesPopUp = function (jQueryEventObject) {
                var _this = this;
                window._popUpManager.showPopUp("chart-preferences");
                $(".filters-pop-up-btn-clear")
                    .click(function (e) {
                    _this.clearAllPrerencesPopup(e, _this._filterWidget.getDataSourceTerms());
                });
            };
            ChartHelper.prototype.showQuickFilterPopUp = function (jQueryEventObject) {
                window._popUpManager.showPopUp("chart-quick-filter");
            };
            ChartHelper.prototype.applyPrerencesPopup = function (jQueryEventObject, dataSourceTerms) {
                this._preferences.filterBy = dataSourceTerms;
                this.updateChart();
            };
            ChartHelper.prototype.clearAllPrerencesPopup = function (jQueryEventObject, object) {
                this._preferences.filterBy = [];
                this._filterWidget.clear();
                this._quickFilterWidget.clear();
                window._popUpManager.hidePopUp("chart-preferences");
                this.updateChart();
            };
            ChartHelper.prototype.redraw = function (data, tries) {
                if (tries === void 0) { tries = 0; }
                if (this._options.fillParentSize) {
                    var parent_1 = this._$element.parent();
                    this._$element.width(parent_1.width());
                    this._$element.height(parent_1.height());
                    if (parent_1.width() == 0 || parent_1.height() == 0) {
                        if (tries > 20) {
                            setTimeout(function () {
                                this.redraw(this._data, tries++);
                            }, 20);
                        }
                        return;
                    }
                }
                this._chart.destroy();
                this._chart = new window["Chart"](this._$element, {
                    type: this._type,
                    options: this._options,
                    data: data
                });
                this._chart.resize();
            };
            ChartHelper.prototype.updateChart = function (internal) {
                var _this = this;
                if (internal === void 0) { internal = false; }
                clearTimeout(this.loadingTm);
                if (internal != true) {
                    $(".no-records", parent).hide();
                    this._$element.show();
                }
                if (this._$element.is(":visible") == false) {
                    this.loadingTm = setTimeout(function () {
                        _this.updateChart(true);
                    }, 300);
                    return;
                }
                this.getChartData(function (data) {
                    var parent = _this._$element.parent();
                    data = _this.downsampleChart(data);
                    $(".no-records", parent).hide();
                    _this._$element.show();
                    _this._nextColorPosition = 0;
                    if (_this._options.fillParentSize) {
                        _this._$element.width(parent.width());
                        _this._$element.height(parent.height());
                    }
                    var newOptions = _this.getOptions();
                    _this._options.title = newOptions['title'] || _this._options.title;
                    _this._options.annotation = newOptions['annotation'] || _this._options.annotation;
                    _this._options.scales = newOptions['scales'] || _this._options.scales;
                    _this.enhanceOptions();
                    if (_this._chart == null) {
                        _this._chart = new window["Chart"](_this._$element, {
                            type: _this._type,
                            options: _this._options,
                            data: data
                        });
                        _this._$element.on("mousedown", function (e) {
                            _this.setSelectedItem(e);
                        });
                        if (_this._options.fillParentSize) {
                            _this.resizeCallback = function () {
                                clearTimeout(_this.resizeTimeout);
                                _this.resizeTimeout = setTimeout(function () {
                                    _this.redraw(_this._data);
                                }, 100);
                            };
                            window.addEventListener("resize", _this.resizeCallback);
                        }
                    }
                    else {
                        _this.redraw(data);
                    }
                    if (data.datasets.length === 0) {
                        $(".no-records", _this._$element.parent()).show();
                        $(".no-records", _this._$element.parent()).css({
                            "height": _this._$element.height() + "px",
                            "width": _this._$element.width() + "px",
                        });
                        _this._$element.hide();
                    }
                });
            };
            ChartHelper.prototype.getDatasetColumnInfo = function () {
                return Joove.DatasourceManager.getDataSetColumnInfoFromControl(this._$element);
            };
            ChartHelper.prototype.getDownsampleOptions = function () {
                return this._options.downsample;
            };
            ChartHelper.prototype.downsample = function (data, threshold) {
                // this function is from flot-downsample (MIT), with modifications
                var dataLength = data.length;
                if (threshold >= dataLength || threshold <= 0) {
                    return data; // nothing to do
                }
                var sampled = [], sampledIndex = 0;
                // bucket size, leave room for start and end data points
                var every = (dataLength - 2) / (threshold - 2);
                var a = 0, // initially a is the first point in the triangle
                maxAreaPoint, maxArea, area, nextA;
                // always add the first point
                sampled[sampledIndex++] = data[a];
                for (var i = 0; i < threshold - 2; i++) {
                    // Calculate point average for next bucket (containing c)
                    var avgX = 0, avgY = 0, avgRangeStart = Math.floor((i + 1) * every) + 1, avgRangeEnd = Math.floor((i + 2) * every) + 1;
                    avgRangeEnd = avgRangeEnd < dataLength ? avgRangeEnd : dataLength;
                    var avgRangeLength = avgRangeEnd - avgRangeStart;
                    for (; avgRangeStart < avgRangeEnd; avgRangeStart++) {
                        avgX += data[avgRangeStart].x * 1; // * 1 enforces Number (value may be Date)
                        avgY += data[avgRangeStart].y * 1;
                    }
                    avgX /= avgRangeLength;
                    avgY /= avgRangeLength;
                    // Get the range for this bucket
                    var rangeOffs = Math.floor((i + 0) * every) + 1, rangeTo = Math.floor((i + 1) * every) + 1;
                    // Point a
                    var pointAX = data[a].x * 1, // enforce Number (value may be Date)
                    pointAY = data[a].y * 1;
                    maxArea = area = -1;
                    for (; rangeOffs < rangeTo; rangeOffs++) {
                        // Calculate triangle area over three buckets
                        area = Math.abs((pointAX - avgX) * (data[rangeOffs].y - pointAY) -
                            (pointAX - data[rangeOffs].x) * (avgY - pointAY)) * 0.5;
                        if (area > maxArea) {
                            maxArea = area;
                            maxAreaPoint = data[rangeOffs];
                            nextA = rangeOffs; // Next a is this b
                        }
                    }
                    sampled[sampledIndex++] = maxAreaPoint; // Pick this point from the bucket
                    a = nextA; // This a is the next a (chosen b)
                }
                sampled[sampledIndex] = data[dataLength - 1]; // Always add last
                return sampled;
            };
            ChartHelper.prototype.downsampleChart = function (originalData) {
                var options = this.getDownsampleOptions();
                if (options == null || !options.enabled) {
                    return originalData;
                }
                var threshold = options.threshold;
                var datasets = originalData.datasets;
                var labels = originalData.labels.map(function (value) {
                    var date = new Date(value).getTime();
                    if (isNaN(date)) {
                        var dateFormat = Joove.GlobalizationManager.GetCurrentLocaleManager().DateTimeFormat;
                        date = CLMS.Framework.DateTime.ParseExact(value, Joove.Core.ApplicationLocale(), dateFormat.GeneralLongTimePattern());
                        return (date.isValid() ? date : moment(value)).toDate().getTime();
                    }
                    else {
                        return date;
                    }
                });
                for (var i = 0; i < datasets.length; i++) {
                    var dataset = datasets[i];
                    var dataToDownsample = null;
                    if (options.preferOriginalData) {
                        dataToDownsample = dataset.originalData;
                    }
                    dataToDownsample = dataToDownsample || dataset.data;
                    dataset.originalData = dataToDownsample;
                    dataToDownsample = dataToDownsample.map(function (value, i) {
                        return {
                            x: labels[i],
                            y: value
                        };
                    });
                    var downsampledData = this.downsample(dataToDownsample, threshold)
                        .linq.orderBy(function (x) { return x.x; }).toArray();
                    var dataParsed = [], dataLabels = [];
                    for (var i_1 = 0; i_1 < downsampledData.length; i_1++) {
                        var dateFormat = Joove.GlobalizationManager.GetCurrentLocaleManager().DateTimeFormat;
                        dataLabels.push(downsampledData[i_1].x);
                        dataParsed.push(downsampledData[i_1].y);
                    }
                    dataset.data = dataParsed;
                    dataset.labels = dataLabels;
                }
                return {
                    labels: (datasets[0] || { labels: [] }).labels,
                    datasets: datasets
                };
            };
            ChartHelper.MAX_LEBEL_LENGTH = 20;
            ChartHelper.instancesDic = {};
            return ChartHelper;
        }());
        Widgets.ChartHelper = ChartHelper;
        ;
        var JbChart = /** @class */ (function (_super) {
            __extends(JbChart, _super);
            function JbChart() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JbChart;
        }(Joove.BaseAngularProvider));
        function jbChart($timeout) {
            return {
                restrict: "AE",
                scope: true,
                link: function ($scope, $element) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    Joove.Common.setDirectiveScope($element, $scope);
                    $scope.chartHelper = new ChartHelper($element, $scope);
                    $timeout(function () {
                        $scope.chartHelper.Init();
                        $scope.selectedItem = null;
                        $scope.selectedDataSetIndex = null;
                        Joove.Common.markDirectiveScopeAsReady($element);
                    });
                    $scope.$on("$destroy", function () {
                        if ($scope.chartHelper.FillParentSize) {
                            window.removeEventListener('resize', $scope.chartHelper.resizeCallback);
                        }
                    });
                }
            };
        }
        angular
            .module("jbChart", [])
            .provider("jbChart", new JbChart())
            .directive("jbChart", ["$timeout", "$interval", "jbChart", jbChart]);
        moment.locale(Joove.Core.ApplicationLanguage());
        window["Chart"].defaults.global.elements.line.fill = false;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
