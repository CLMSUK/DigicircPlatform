﻿namespace Joove.Widgets {
    export enum PieLabelType {
        none,
        label,
        percentage,
        value
    }

    export interface IChartResource extends IFilterDatasourceWidgetResource {
        Cancel: string;
        Ok: string;
        QuickFilters: string;
        PreferencesPopUpTitle: string;
        NoRecords: string;
    }

    interface IChartPreferences {
        filterBy: typeof FilterInfo[];
    }

    export class ChartHelper {
        constructor($element, $scope) {
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

        private _filterWidget: Widgets.FilterDatasourceWidget;
        private _quickFilterWidget: Widgets.QuickFilterDatasourceWidget;
        private _preferences: IChartPreferences;

        private _$element: JQuery;
        private _resources: IChartResource;
        private _$scope;
        private _chart;
        private _type;
        private _datasetColumnInfo: Array<ColumnInfo>;
        private _options: any;
        private _data = null;
        private _usedColorPositions: Array<number>;
        private _nextColorPosition: number;
        private _totalDataSets: number;
        private _pallette: Array<string>;
        private _fromMasterPage: boolean;
        private static MAX_LEBEL_LENGTH = 20;
        public static instancesDic: { [name: string]: { [index: string]: ChartHelper } } = {};

        private minX = null;
        private minY = null;
        private maxX = null;
        private maxY = null;

        get FillParentSize() {
            return this._options.fillParentSize;
        }

        Init() {
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
        }

        private enhanceOptions() {
            this.InitChartPieceLabel();
            this.InitChartTooltipMode();
            this.InitCustomTickFormats();

            if (this._options.ignoreThemeDefinedColors == false) {
                this.setColorsBasedOnTheme();
            }
            else {
                this._pallette = this._options.pallette;
            }
        }

        private bubbleFitContent() {
            if (this._options.scales == null) return;

            if (this._options.scales.xAxes != null) {
                const notch = (Math.abs(this.minX) + Math.abs(this.maxX)) / 2;
                console.log(this.minX, this.maxX, notch);
                if (this._options.scales.xAxes[0].ticks != null) {
                    this._options.scales.xAxes[0].ticks.min = this._options.scales.xAxes[0].ticks.min || this.minX - notch;
                    this._options.scales.xAxes[0].ticks.max = this._options.scales.xAxes[0].ticks.max || this.maxX + notch;
                    this._options.scales.xAxes[0].ticks.stepSize = this._options.scales.xAxes[0].ticks.stepSize || notch;
                }
            }
            if (this._options.scales.yAxes != null) {
                const notch = (Math.abs(this.minY) + Math.abs(this.maxY)) / 2;
                console.log(this.minY, this.maxY, notch);
                if (this._options.scales.yAxes[0].ticks != null) {
                    this._options.scales.yAxes[0].ticks.min = this._options.scales.yAxes[0].ticks.min || this.minY - notch;
                    this._options.scales.yAxes[0].ticks.max = this._options.scales.yAxes[0].ticks.max || this.maxY + notch;
                    this._options.scales.yAxes[0].ticks.stepSize = this._options.scales.yAxes[0].ticks.stepSize || notch;
                }
            }            
        }

        private setColorsBasedOnTheme(): void {
            var chartVariables = window._themeManager.getAllControlVariablesByElement(this._$element);

            if (chartVariables == null || chartVariables.length == 0) return;

            // pallette
            this._pallette = [];

            for (let i = 0; i < chartVariables.length; i++) {
                var current = chartVariables[i];

                if (current.name.indexOf("@Pallette") == -1) continue;

                this._pallette.push(current.value);
            }

            // Axes colors
            this.applyAxesColorsBasedOnTheme();

        }

        private applyAxesColorsBasedOnTheme() {
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
            if (chartType == "pie" || chartType == "doughnut") return; // no more customization is needed

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
        }

        private instantiateScales() {
            if (this._options.scales == null) {
                this._options.scales = {};
            }

            if (this._options.scales.xAxes == null) {
                this._options.scales.xAxes = [{}];
            }

            if (this._options.scales.yAxes == null) {
                this._options.scales.yAxes = [{}];
            }
        }

        private applyValueToAxes(color: any, path: string) {
            for (let i = 0; i < this._options.scales.xAxes.length; i++) {
                var ax = this._options.scales.xAxes[i];
                this.nullSafeValueAssignToPath(color, path, ax);
            }

            for (let i = 0; i < this._options.scales.yAxes.length; i++) {
                var ax = this._options.scales.yAxes[i];
                this.nullSafeValueAssignToPath(color, path, ax);
            }
        }

        private nullSafeValueAssignToPath(value: any, path: string, parent: any) {
            var parts = path.split(".");

            for (let i = 0; i < parts.length; i++) {
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
        }

        InitChartTooltipMode(): void {
            if (this._options.tooltipMode == null) return;

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
        }

        InitChartPieceLabel(): void {
            if (this._options.pieLabelConfig == null) return;

            const pieLabelConfig = this._options.pieLabelConfig;

            if (pieLabelConfig.format != null) {
                pieLabelConfig.format = new ValueFormat(pieLabelConfig.format);
            }

            if (this._options.plugins != null
                && this._options.plugins.percentPie != null
                && this._options.plugins.percentPie.enable) {
                this._options.plugins.percentPie.format = new ValueFormat(this._options.tooltipValueFormat);
                pieLabelConfig.format = new ValueFormat({ postfix: "%" });
            }

            this._options.pieLabelFontSize = (this._options.pieLabelFontSize == 0) ? 14 : this._options.pieLabelFontSize;

            this._options.pieceLabel = {
                // render: 'percentage', //  'label', 'value', 'percentage'
                render: function (args) {
                    const type = PieLabelType[pieLabelConfig.type];

                    if (pieLabelConfig.type == PieLabelType.value) {
                        return (pieLabelConfig.format != null) ?
                            pieLabelConfig.format.formatNumber(args[type]) : args[type];
                    }
                    if (pieLabelConfig.type == PieLabelType.label) {
                        return args[type];
                    }
                    else {
                        let format = new ValueFormat({ postfix: "%" });
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
                fontColor: (data) => {
                    if (typeof (data.dataset.backgroundColor) == "string") {
                        data.dataset.backgroundColor = [data.dataset.backgroundColor];
                    }
                    if (data.dataset.backgroundColor.length <= data.index) {
                       data.index = data.dataset.backgroundColor.length - 1;
                    }

                    var rgb = this.ToRgb(data.dataset.backgroundColor[data.index]);

                    if (rgb == null) {
                        rgb = this.ToRgb(this.hexToRgb(data.dataset.backgroundColor[data.index], 1));
                    }

                    var threshold = 140;
                    var luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
                    return luminance > threshold ? 'black' : 'white';
                }
            };
        }

        public InitCustomTickFormats(): void {
            if (this._options.scales == null) return;

            if (this._options.scales.xAxes != null) {
                this._options.scales.xAxes = this.ParseScaleOptions(this._options.scales.xAxes);
            }
            if (this._options.scales.yAxes != null) {
                this._options.scales.yAxes = this.ParseScaleOptions(this._options.scales.yAxes);
            }
        }

        public ParseScaleOptions(scales: Array<any>): Array<any> {
            var parsedScales: Array<any> = [];

            for (let i = 0; i < scales.length; i++) {
                const scale = scales[i];
                let format = scale.format;
                if (format != null) {
                    format = new ValueFormat(format);
                    delete scale.format;
                    scale.ticks = scale.ticks || {};
                    scale.formatNumber = format;
                    scale.ticks.callback = (value, index, values) => {
                        return format.format(value);
                    }
                }
                parsedScales.push(scale);

                if (scale.type === "time") {
                    const dateFormat = Joove.GlobalizationManager.GetCurrentLocaleManager().DateTimeFormat;

                    scale.time = scale.time || {};

                    const tooltipFormat = scale.time.tooltipFormat;

                    if (tooltipFormat != null) {
                        delete scale.time.tooltipFormat;
                        scale.time.tooltipFormat = Joove.Common.changeDateTimeFormat(tooltipFormat.backEndFormatting);
                    }

                    scale.time.parser = (value) => {
                        if (typeof value === 'number' || (typeof value === 'object' && value.addDays != null)) {
                            return moment(value);
                        }

                        const date = CLMS.Framework.DateTime.ParseExact(value, Joove.Core.ApplicationLocale(), dateFormat.GeneralLongTimePattern());
                        if (date.isValid() != true) return moment(value);
                        return date;
                    }
                }
            }

            return parsedScales;
        }

        public static GetChartName(name: string): string {
            return `${Core.GetElementNameFromId(name)}`;
        }

        private UpdateInstanceDisc(): void {
            const name = Joove.Widgets.ChartHelper.GetChartName(this._$element.attr("jb-id"));
            if (Joove.Widgets.ChartHelper.instancesDic[name] == null) {
                Joove.Widgets.ChartHelper.instancesDic[name] = {};
            }
            Joove.Widgets.ChartHelper.instancesDic[name][Joove.Common.getIndexKeyOfControl(this._$element)] = this;
        }

        private ToRgb(hex): any {
            var result = /^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([0-9\.]{1,4}))?\)$/i.exec(hex.replace(/ /g, ""));
            return result ? {
                r: parseInt(result[1], 10),
                g: parseInt(result[2], 10),
                b: parseInt(result[3], 10),
                o: parseFloat(result[4])
            } : null;
        }

        private hexToRgb(hex: string, opacity: number): string {
            if (hex == null || hex.toLowerCase().indexOf("rgb") == 0) return hex;

            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex,
                (m, r, g, b) => (r + r + g + g + b + b));

            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            const obj = result
                ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                }
                : null;

            if (obj == null) return hex;

            return `rgba(${obj.r},${obj.g},${obj.b},${opacity})`;
        }

        private getChartType(): string {
            const attribute = this._$element.attr("jb-chart");

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
                    console.error(`Could not understand chart type: ${attribute}`);
                    return "pie";
            }
        }

        private getOptions(): Object {
            return Joove.Core.GetOptions(this._$element, "jb-options");
        }

        private prepareRequest(): DatasourceRequest {
            if (this._options.groupBy == null) return null;

            const groupColumn = new ColumnInfo(this._options.groupBy.member, this._options.groupBy.dataType);
            const groupInfo = new GroupByInfo(groupColumn, GroupState.EXPANDED, false, true);

            const request = new DatasourceRequest(this._$element, 0, 99999);

            request.filters = this._preferences.filterBy;
            request.groupBy = [groupInfo];
            request.aggregators = [];

            for (let i = 0; i < this._options.values.length; i++) {
                const current = this._options.values[i];

                request.aggregators.push({
                    column: current.member,
                    type: current.type
                });
            }

            return request;
        }

        private getChartData(cb: Function) {
            const requestInfo = this.prepareRequest();

            DatasourceManager.fetch(this._$element,
                Core.getElementName(this._$element),
                requestInfo,
                {
                    success: (response) => {
                        var data = this.prepareChartData(response);

                        cb && cb(data);
                    },
                    error: () => {
                        console.error("Error fetching chart datasource");
                    }
                },
                [],
                this._fromMasterPage);
        }

        private getNextColor(): string {
            this._nextColorPosition++;

            if (this._nextColorPosition > this._pallette.length - 1) {
                this._nextColorPosition = 0;
            }

            return this._pallette[this._nextColorPosition];
        }

        private getRandomColor(): string {
            const randomPosition = Math.floor(Math.random() * this._pallette.length);

            if (this._usedColorPositions.indexOf(randomPosition) > -1) {
                return this.getRandomColor();
            } else {
                this._usedColorPositions.push(randomPosition);

                return this._pallette[randomPosition];
            }
        }

        private prepareChartData(response) {
            let data = {
                labels: [],
                datasets: []
            };

            if (response.Data == null || response.Data.length === 0) return data;

            this._usedColorPositions = [];

            const first = response.Data[0];
            this._totalDataSets = first.Values.length;

            // Create DataSets
            for (let j = 0; j < this._totalDataSets; j++) {
                let dataSet: any;
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
                        console.error(`Chart type not implemented fully: ${this._type}`, this._$element[0]);
                        return null;
                }
                if (this._type === "bubble") {
                    data = this.prepareBubbleChartDataSet(response.Data);
                } else if (this._type === "scatter") {
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
            for (let i = 0; i < response.Data.length; i++) {
                const current = response.Data[i];

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
        }

        private prepareLineChartDataSet(data, dataSetIndex: number) {
            const attribute = this._$element.attr("jb-chart");
            const dataSet = this.prepareDefaultDataSet(data, dataSetIndex, false) as any;
            if (attribute === "Area") {
                dataSet.fill = "origin";
            }
            return dataSet;
        }

        private prepareBarChartDataSet(data, dataSetIndex: number) {
            const set = this.prepareDefaultDataSet(data, dataSetIndex);

            return set;
        }

        private prepareRadarChartDataSet(data, dataSetIndex: number) {
            return this.prepareDefaultDataSet(data, dataSetIndex, false);
        }

        private preparePolarChartDataSet(data, dataSetIndex: number) {
            return this.prepareDefaultDataSet(data, dataSetIndex);
        }

        private preparePieChartDataSet(data, dataSetIndex: number) {
            return this.prepareDefaultDataSet(data, dataSetIndex);
        }

        private prepareScatterChartDataSet(data) {
            return this.prepareBubbleChartDataSet(data);
        }

        private prepareBubbleChartDataSet(data) {
            const set = {
                labels: [],
                datasets: []
            };
            
            for (let i = 0; i < data.length; i++) {
                const item = data[i];

                for (let j = 0; j < item.Values.length; j++) {
                    if (i === 0) {
                        set.labels.push(item.ValueLabels[j]);
                        set.datasets[j] = {
                            borderWidth: this._options.dataSetBorderWidth,
                            label: [item.ValueLabels[j]],
                            data: []
                        }
                    }
                    if (set.datasets[j] == null) {
                        set.labels.push(item.ValueLabels[j]);
                        set.datasets[j] = {
                            borderWidth: this._options.dataSetBorderWidth,
                            label: [item.ValueLabels[j]],
                            data: []
                        }
                    } 

                    const y = parseFloat(item.Values[j]);
                    const r = parseFloat(item.Radius[j]);
                    const rnotch = Math.floor((r || 0) / 5);
                    const x = parseFloat(item.Label);

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
        }

        private prepareDefaultDataSet(data, dataSetIndex: number, colorsAsArray?: boolean) {
            const set = this.initializeDataSet(data, dataSetIndex);

            set.borderWidth = this._options.dataSetBorderWidth;

            this.applyColorsToDataSet(data, set, colorsAsArray, dataSetIndex);

            return set;
        }

        private applyColorsToDataSet(data, set, asArray: boolean, dataSetIndex: number) {
            const usedColors = JSON.parse(localStorage.getItem('usedColors') || '{}');
            let uniqueColor = 0;
            let label = "";

            if (asArray !== false) {
                set.backgroundColor = [];
                set.hoverBackgroundColor = [];
                set.borderColor = [];

                for (let i = 0; i < data.length; i++) {
                    let color: string;

                    if (this._options.ignoreThemeDefinedColors == true) {
                        if (this._type !== "pie" && this._type !== "doughnut" && this._type !== "polarArea") {
                            color = this._pallette[dataSetIndex % this._pallette.length];
                        } else {
                            color = this.getNextColor();
                        }
                    } else {
                        if (this._type !== "pie" && this._type !== "doughnut" && this._type !== "polarArea") {
                            label = data[i].ValueLabels[dataSetIndex];
                            uniqueColor = this.setColor(usedColors, label);
                        } else {
                            label = data[i].Label;
                            uniqueColor = this.setColor(usedColors, label);
                        }

                        color = this._pallette[uniqueColor];
                    }
                    
                    const toRgb = this.hexToRgb(color, 0.75);

                    set.backgroundColor.push(this._options.transparencyEffects ? toRgb : color);
                    set.borderColor.push(color);
                    set.hoverBackgroundColor.push(color);

                    if (this._options.ignoreThemeDefinedColors == false) {
                        this.saveUsedColor(usedColors, uniqueColor, label);
                    }
                }
            } else {
                let color: string;
                if (this._options.ignoreThemeDefinedColors == false) {
                    label = data[0].ValueLabels[dataSetIndex];
                    uniqueColor = this.setColor(usedColors, label);
                    color = this._pallette[uniqueColor];
                    this.saveUsedColor(usedColors, uniqueColor, label);
                } else {
                    color = this._pallette[dataSetIndex % this._pallette.length];
                }

                const toRgb = this.hexToRgb(color, 0.75);

                set.backgroundColor = this._options.transparencyEffects ? toRgb : color;
                set.hoverBackgroundColor = color;
                set.borderColor = color;
            }
        }

        private setColor(usedColors: any, label: string) {
            let uniqueColor = 0;
            if (usedColors[label] == null) {
                uniqueColor = this.getColorWithLessUses(usedColors);
            } else {
                uniqueColor = usedColors[label];
            }
            return uniqueColor;
        }

        private getColorWithLessUses(usedColors: any) {
            let minIndex = 0;

            let min = usedColors[0];

            if (min == null) {
                return minIndex;
            }


            for (let i = 1; i < this._pallette.length; i++) {
                const countOfColors = usedColors[i];

                if (countOfColors == null) {
                    return i;
                }

                if (usedColors[i] < min) {
                    min = usedColors[i];
                    minIndex = i;
                }
            }

            return minIndex;
        }

        private saveUsedColor(usedColors: any, uniqueColor: number, label: string) {
            usedColors[uniqueColor] = usedColors[uniqueColor] || 0;

            if (usedColors[label] == null) {
                usedColors[uniqueColor]++;
                usedColors[label] = uniqueColor;
            }

            localStorage.setItem('usedColors', JSON.stringify(usedColors));
        }

        private initializeDataSet(data, dataSetIndex) {
            const set = {
                label: "",
                data: [],
                items: data,
                borderWidth: 0
            };

            for (let i = 0; i < data.length; i++) {
                set.data.push(data[i].Values[dataSetIndex] || 0);
            }

            return set;
        }

        public setSelectedItem(evt: Event) {
            const activePoint = this._chart.getElementAtEvent(evt);

            if (activePoint.length === 0) return;

            const datasetIndex = activePoint[0]._datasetIndex;
            const itemIndex = activePoint[0]._index;

            const dataset = this._data.datasets[datasetIndex];
            const entry = dataset.items[itemIndex];

            this._$scope.selectedItem = entry.Item;
            this._$scope.selectedItems = [entry.Item];
            this._$scope.selectedDataSetIndex = datasetIndex;
        }

        private registerFilterBasePopUp($contents: JQuery,
            widget: FilterDatasourceWidget,
            title: string,
            name:
                string) {
            const self = this;

            window._popUpManager.destroyPopUp(name);
            window._popUpManager.registerPopUp({
                name: name,
                width: "80%",
                height: "60%",
                cancelButton: true,
                okButton: true,
                okCallback(e: JQueryEventObject) {
                    const filter = widget.getDataSourceTerms() as any;
                    if (filter == null) {
                        return 1;
                    }
                    self.applyPrerencesPopup(e, filter);

                    if (widget instanceof QuickFilterDatasourceWidget) {
                        self._filterWidget.redraw(self._preferences.filterBy as any);
                    } else if (widget instanceof FilterDatasourceWidget) {
                        self._quickFilterWidget.redraw(self._preferences.filterBy as any);
                    }
                },
                title: title,
                $elementContent: $contents
            });
        }

        private preparePreferencesPopUp() {
            this._filterWidget = new FilterDatasourceWidget({
                columns: this._datasetColumnInfo,
                filters: [],
                resources: this._resources,
                controlName: Core.getElementName(this._$element)
            });
            const popUpId = "chart-preferences";
            const $contents =
                $(`<div class='chart-preferences-pop-up'><div id="chart-preferences-popup-container"></div><br /><div class='chart-preferences-pop-up-footer list-pop-up-chart-preferences'><button class='btn btn-primary filters-pop-up-btn-clear'>${this._resources.ClearAll}</button></div></div>`);

            this._filterWidget.draw($("#chart-preferences-popup-container", $contents));
            this.registerFilterBasePopUp($contents, this._filterWidget, this._resources.PreferencesPopUpTitle, popUpId);
        }

        private prepareQuickFilterPopUp() {
            this._quickFilterWidget = new QuickFilterDatasourceWidget({
                columns: this._datasetColumnInfo,
                filters: [],
                resources: this._resources,
                controlName: Core.getElementName(this._$element)
            });
            const $contents =
                $(`<div class="filters-pop-up"><div id="chart-quick-filter-popup-container"></div></div>`);
            this._quickFilterWidget.draw($("#chart-quick-filter-popup-container", $contents));
            this.registerFilterBasePopUp($contents,
                this._quickFilterWidget,
                this._resources.QuickFilters,
                "chart-quick-filter");
        }

        private InitChartToolbar() {
            this._$element.before(`
<div class="chart-toolbar">
    <span class="glyphicon glyphicon-cog" id="chart-preferences-button" title="${this._resources.PreferencesPopUpTitle
                }"></span>
    <span class="glyphicon glyphicon-filter" id="chart-quick-filter-button"  title="${this._resources.QuickFilters
                }"></span>
</div><h1 class="no-records">${this._resources.NoRecords}</h1>`);
            $(".no-records").hide();

            this.preparePreferencesPopUp();
            this.prepareQuickFilterPopUp();

            $("#chart-preferences-button", this._$element.parent())
                .click((e: JQueryEventObject) => {
                    this.showPreferencesPopUp(e);
                });

            $("#chart-quick-filter-button", this._$element.parent())
                .click((e: JQueryEventObject) => {
                    this.showQuickFilterPopUp(e);
                });
        }

        private showPreferencesPopUp(jQueryEventObject: JQueryEventObject) {
            window._popUpManager.showPopUp("chart-preferences");

            $(".filters-pop-up-btn-clear")
                .click((e: JQueryEventObject) => {
                    this.clearAllPrerencesPopup(e, this._filterWidget.getDataSourceTerms() as any);
                });
        }

        private showQuickFilterPopUp(jQueryEventObject: JQueryEventObject) {
            window._popUpManager.showPopUp("chart-quick-filter");
        }

        private applyPrerencesPopup(jQueryEventObject: JQueryEventObject, dataSourceTerms: Array<FilterInfo>) {
            this._preferences.filterBy = dataSourceTerms as any;
            this.updateChart();
        }

        private clearAllPrerencesPopup(jQueryEventObject: JQueryEventObject, object) {
            this._preferences.filterBy = [];
            this._filterWidget.clear();
            this._quickFilterWidget.clear();
            window._popUpManager.hidePopUp("chart-preferences");
            this.updateChart();
        }

        resizeTimeout: any;
        loadingTm: any;
        resizeCallback: any;

        public redraw(data: any, tries = 0) {
            if (this._options.fillParentSize) {
                const parent = this._$element.parent();

                this._$element.width(parent.width());
                this._$element.height(parent.height());

                if (parent.width() == 0 || parent.height() == 0) {
                    if (tries > 20) {
                        setTimeout(function () {
                            this.redraw(this._data, tries++);
                        }, 20);
                    }
                    return;
                }
            }

            this._chart.destroy();

            this._chart = new window["Chart"](this._$element,
                {
                    type: this._type,
                    options: this._options,
                    data: data
                });

            this._chart.resize();
        }

        public updateChart(internal = false) {
            clearTimeout(this.loadingTm);

            if (internal != true) {
                $(".no-records", parent).hide();
                this._$element.show();
            }

            if (this._$element.is(":visible") == false) {
                this.loadingTm = setTimeout(() => {
                    this.updateChart(true);
                }, 300);
                return;
            }

            this.getChartData((data) => {
                const parent = this._$element.parent();
                data = this.downsampleChart(data);

                $(".no-records", parent).hide();
                this._$element.show();
                this._nextColorPosition = 0;

                if (this._options.fillParentSize) {
                    this._$element.width(parent.width());
                    this._$element.height(parent.height());
                }

                const newOptions = this.getOptions();
                this._options.title = newOptions['title'] || this._options.title;
                this._options.annotation = newOptions['annotation'] || this._options.annotation;
                this._options.scales = newOptions['scales'] || this._options.scales;

                this.enhanceOptions();

                if (this._chart == null) {

                    this._chart = new window["Chart"](this._$element,
                        {
                            type: this._type,
                            options: this._options,
                            data: data
                        });

                    this._$element.on("mousedown", (e: Event) => {
                        this.setSelectedItem(e);
                    });

                    if (this._options.fillParentSize) {
                        this.resizeCallback = () => {
                            clearTimeout(this.resizeTimeout);
                            this.resizeTimeout = setTimeout(() => {
                                this.redraw(this._data);
                            }, 100);
                        };

                        window.addEventListener("resize", this.resizeCallback);
                    }
                }
                else {
                    this.redraw(data);
                }

                if (data.datasets.length === 0) {
                    $(".no-records", this._$element.parent()).show();

                    $(".no-records", this._$element.parent()).css({
                        "height": `${this._$element.height()}px`,
                        "width": `${this._$element.width()}px`,
                    });

                    this._$element.hide();
                }
            });
        }

        getDatasetColumnInfo(): Array<ColumnInfo> {
            return DatasourceManager.getDataSetColumnInfoFromControl(this._$element);
        }

        getDownsampleOptions() {
            return this._options.downsample;
        }

        downsample(data, threshold) {
            // this function is from flot-downsample (MIT), with modifications

            let dataLength = data.length;
            if (threshold >= dataLength || threshold <= 0) {
                return data; // nothing to do
            }

            let sampled = [],
                sampledIndex = 0;

            // bucket size, leave room for start and end data points
            let every = (dataLength - 2) / (threshold - 2);

            let a = 0,  // initially a is the first point in the triangle
                maxAreaPoint,
                maxArea,
                area,
                nextA;

            // always add the first point
            sampled[sampledIndex++] = data[a];

            for (let i = 0; i < threshold - 2; i++) {
                // Calculate point average for next bucket (containing c)
                let avgX = 0,
                    avgY = 0,
                    avgRangeStart = Math.floor((i + 1) * every) + 1,
                    avgRangeEnd = Math.floor((i + 2) * every) + 1;
                avgRangeEnd = avgRangeEnd < dataLength ? avgRangeEnd : dataLength;

                let avgRangeLength = avgRangeEnd - avgRangeStart;

                for (; avgRangeStart < avgRangeEnd; avgRangeStart++) {
                    avgX += data[avgRangeStart].x * 1; // * 1 enforces Number (value may be Date)
                    avgY += data[avgRangeStart].y * 1;
                }
                avgX /= avgRangeLength;
                avgY /= avgRangeLength;

                // Get the range for this bucket
                let rangeOffs = Math.floor((i + 0) * every) + 1,
                    rangeTo = Math.floor((i + 1) * every) + 1;

                // Point a
                let pointAX = data[a].x * 1, // enforce Number (value may be Date)
                    pointAY = data[a].y * 1;

                maxArea = area = -1;

                for (; rangeOffs < rangeTo; rangeOffs++) {
                    // Calculate triangle area over three buckets
                    area = Math.abs((pointAX - avgX) * (data[rangeOffs].y - pointAY) -
                        (pointAX - data[rangeOffs].x) * (avgY - pointAY)
                    ) * 0.5;
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
        }


        downsampleChart(originalData) {
            const options = this.getDownsampleOptions();
            if (options == null || !options.enabled) {
                return originalData;
            }
            const threshold = options.threshold;

            let datasets = originalData.datasets;

            let labels = originalData.labels.map((value) => {
                let date = new Date(value).getTime() as any;

                if (isNaN(date)) {
                    const dateFormat = Joove.GlobalizationManager.GetCurrentLocaleManager().DateTimeFormat;
                    date = CLMS.Framework.DateTime.ParseExact(value, Joove.Core.ApplicationLocale(), dateFormat.GeneralLongTimePattern());
                    return (date.isValid() ? date : moment(value)).toDate().getTime()
                } else {
                    return date;
                }

            });
            for (let i = 0; i < datasets.length; i++) {
                let dataset = datasets[i];

                let dataToDownsample = null;
                if (options.preferOriginalData) {
                    dataToDownsample = dataset.originalData;
                }
                dataToDownsample = dataToDownsample || dataset.data;

                dataset.originalData = dataToDownsample;

                dataToDownsample = dataToDownsample.map((value, i) => {
                    return {
                        x: labels[i],
                        y: value
                    }
                });

                let downsampledData = this.downsample(dataToDownsample, threshold)
                    .linq.orderBy(x => x.x).toArray();
                let dataParsed = [], dataLabels = [];

                

                for (let i = 0; i < downsampledData.length; i++) {
                    const dateFormat = Joove.GlobalizationManager.GetCurrentLocaleManager().DateTimeFormat;
                    dataLabels.push(downsampledData[i].x);
                    dataParsed.push(downsampledData[i].y);
                }
                dataset.data = dataParsed;
                dataset.labels = dataLabels;
            }

            return {
                labels: (datasets[0] || {labels: []} ).labels,
                datasets
            };
        }
    };

    class JbChart extends BaseAngularProvider {
    }

    interface IChartHelperScope extends IJooveScope {
        chartHelper: ChartHelper;
        selectedItem: any;
        selectedItems: Array<any>;
        selectedDataSetIndex: number;
    }

    function jbChart($timeout: ng.ITimeoutService): ng.IDirective {
        return {
            restrict: "AE",
            scope: true,
            link: ($scope: IChartHelperScope, $element) => {
                if (Common.directiveScopeIsReady($element)) return;

                Common.setDirectiveScope($element, $scope);

                $scope.chartHelper = new ChartHelper($element, $scope);
                $timeout(() => {
                    $scope.chartHelper.Init();
                    $scope.selectedItem = null;
                    $scope.selectedDataSetIndex = null;
                    Common.markDirectiveScopeAsReady($element);
                });

                $scope.$on("$destroy",
                    () => {
                        if ($scope.chartHelper.FillParentSize) {
                            window.removeEventListener('resize', $scope.chartHelper.resizeCallback);
                        }
                    });
            }
        }
    }

    angular
        .module("jbChart", [])
        .provider("jbChart", new JbChart())
        .directive("jbChart", ["$timeout", "$interval", "jbChart", jbChart]);

    moment.locale(Joove.Core.ApplicationLanguage());
    window["Chart"].defaults.global.elements.line.fill = false;

}