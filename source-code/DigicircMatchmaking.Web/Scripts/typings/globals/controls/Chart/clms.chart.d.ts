declare namespace Joove.Widgets {
    enum PieLabelType {
        none = 0,
        label = 1,
        percentage = 2,
        value = 3
    }
    interface IChartResource extends IFilterDatasourceWidgetResource {
        Cancel: string;
        Ok: string;
        QuickFilters: string;
        PreferencesPopUpTitle: string;
        NoRecords: string;
    }
    class ChartHelper {
        constructor($element: any, $scope: any);
        private _filterWidget;
        private _quickFilterWidget;
        private _preferences;
        private _$element;
        private _resources;
        private _$scope;
        private _chart;
        private _type;
        private _datasetColumnInfo;
        private _options;
        private _data;
        private _usedColorPositions;
        private _nextColorPosition;
        private _totalDataSets;
        private _pallette;
        private _fromMasterPage;
        private static MAX_LEBEL_LENGTH;
        static instancesDic: {
            [name: string]: {
                [index: string]: ChartHelper;
            };
        };
        private minX;
        private minY;
        private maxX;
        private maxY;
        get FillParentSize(): any;
        Init(): void;
        private enhanceOptions;
        private bubbleFitContent;
        private setColorsBasedOnTheme;
        private applyAxesColorsBasedOnTheme;
        private instantiateScales;
        private applyValueToAxes;
        private nullSafeValueAssignToPath;
        InitChartTooltipMode(): void;
        InitChartPieceLabel(): void;
        InitCustomTickFormats(): void;
        ParseScaleOptions(scales: Array<any>): Array<any>;
        static GetChartName(name: string): string;
        private UpdateInstanceDisc;
        private ToRgb;
        private hexToRgb;
        private getChartType;
        private getOptions;
        private prepareRequest;
        private getChartData;
        private getNextColor;
        private getRandomColor;
        private prepareChartData;
        private prepareLineChartDataSet;
        private prepareBarChartDataSet;
        private prepareRadarChartDataSet;
        private preparePolarChartDataSet;
        private preparePieChartDataSet;
        private prepareScatterChartDataSet;
        private prepareBubbleChartDataSet;
        private prepareDefaultDataSet;
        private applyColorsToDataSet;
        private setColor;
        private getColorWithLessUses;
        private saveUsedColor;
        private initializeDataSet;
        setSelectedItem(evt: Event): void;
        private registerFilterBasePopUp;
        private preparePreferencesPopUp;
        private prepareQuickFilterPopUp;
        private InitChartToolbar;
        private showPreferencesPopUp;
        private showQuickFilterPopUp;
        private applyPrerencesPopup;
        private clearAllPrerencesPopup;
        resizeTimeout: any;
        loadingTm: any;
        resizeCallback: any;
        redraw(data: any, tries?: number): void;
        updateChart(internal?: boolean): void;
        getDatasetColumnInfo(): Array<ColumnInfo>;
        getDownsampleOptions(): any;
        downsample(data: any, threshold: any): any;
        downsampleChart(originalData: any): any;
    }
}
