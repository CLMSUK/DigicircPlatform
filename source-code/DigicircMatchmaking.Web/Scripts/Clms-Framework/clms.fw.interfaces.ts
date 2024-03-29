﻿declare namespace Joove {
    interface IContext {
        appName: string,
        mode: string,
        isDirty: boolean,                       
        siteRoot: string,
        currentAction: string,
        currentController: string,
        currentMasterPageController: string,
		currentMasterPageObject: any,
        currentUsername: string,
        currentUserRoles: Array<string>,
        currentUserPermissions: Array<string>,
        currentUser: any,
        isModal: boolean,
        language: string,
        languageId: string,
        languageName: string,
        locale: string,
        localeId: string,
        localeName: string,
        longDatePattern: string,
        shortDatePattern: string,
        longTimePattern: string,
        yearMonthPattern: string,
        RFC1123Pattern: string,
        monthDayPattern: string,
        shortTimePattern: string,
        decimalSeparator:string,
        groupSeparator: string,
        currentVersion: string,
		urlQuery: string,
        zipRequests: boolean,
        routeData: string,
        ajaxContentType: string,
        adminCanSetPasswords: boolean,
        sessionTimeOutMins: number
    }
}


interface Window {
    _popUpManager?: Joove.PopUpManager;
    _context: Joove.IContext;
    _ruleEngine: Joove.RuleEngine;
    _resourcesManager: Joove.ResourcesManager;
    _commander: Joove.ClientCommander;    
    _themeManager: Joove.ThemeManager;
    _historyManager: Joove.HistoryManager;
    _scriptLoader: Joove.ScriptLoaderManager;
    _recorder: Joove.Recorder;
    _validationPanel: Joove.Widgets.ValidationPanelAngular;
	_performanceManager: Joove.PerformanceManager;
    viewDTO;    
	_backEndInfoAggregator: Joove.BackEndInformationAggregator;
    resourcesXmlSerialized;
    _forceListRefresh;
    _listSelectionClear;
    _listApplyPredefinedFilters;
    _listClearPredefinedFilters;
    _dataListSelectionClear;    
    momentJsInitialized: boolean;
    _treeNodesConfiguration;
    InstallTrigger;
    opera;
    HTMLElement: HTMLElement;
    chrome;
    moment;
    partialViewResources: any;
    currentVersion: string;
    _appVersion: string;
    $entryContainerTemplate;
    escape: Function;
    unescape: Function;
    maxLeftMenuWidthRatio: number;
    maxRightMenuWidthRatio: number;
}

interface JQueryStatic {
    datetimepicker;
}

interface JQuery {
    combobox;
}

interface Document {
    documentMode: boolean;
}

interface Error {
    stack?: string;
}

interface Math {
    round10: (value: number, exp: number) => number;
    floor10: (value: number, exp: number) => number;
    ceil10:  (value: number, exp: number) => number;
    sign: (x: number) => number;
}

declare const jsPDF: any;
declare const html2pdf: any;
declare const pdfMake: any;