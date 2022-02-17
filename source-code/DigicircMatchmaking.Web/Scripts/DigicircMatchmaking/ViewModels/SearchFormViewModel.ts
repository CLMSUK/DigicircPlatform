// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
namespace DigicircMatchmaking.ViewModels.SearchForm {
export class SearchFormViewModel extends DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.SelectedActor != null)
            instance.SelectedActor = SelectedActor_ActorViewModel._lightCast(instance.SelectedActor);
        if(instance.Query != null)
            instance.Query = Query_SearchQueryViewModel._lightCast(instance.Query);
        return instance;
    }

    public static _initializeFrom(original: SearchFormViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): SearchFormViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        SearchFormViewModel = new SearchFormViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateSearchFormViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateSearchFormViewModel(original: SearchFormViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;

        this._hydrateMasterPageViewModel(original, ignoreReadOnlyProperties, context);

        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if(original.SelectedMode !== undefined) this.SelectedMode = original.SelectedMode;

        if(original.SelectedActor !== undefined) this.SelectedActor = SelectedActor_ActorViewModel._initializeFrom(original.SelectedActor, ignoreReadOnlyProperties, context);

        if(original.Query !== undefined) this.Query = Query_SearchQueryViewModel._initializeFrom(original.Query, ignoreReadOnlyProperties, context);
        if (original.DropdownCountryDataSet__InitialSelection !== undefined) this.DropdownCountryDataSet__InitialSelection = original.DropdownCountryDataSet__InitialSelection;
        if (original.DropdownBox__InitialSelection !== undefined) this.DropdownBox__InitialSelection = original.DropdownBox__InitialSelection;
        if (original.TextBox1__InitialSelection !== undefined) this.TextBox1__InitialSelection = original.TextBox1__InitialSelection;
        this.DropdownCountryDataSetSelectedItemKeys = original.DropdownCountryDataSetSelectedItemKeys;
        this.DropdownBoxSelectedItemKeys = original.DropdownBoxSelectedItemKeys;
        this.SelectedModeOptionButtonSelectedItemKeys = original.SelectedModeOptionButtonSelectedItemKeys;
        this.TextBox1SelectedItemKeys = original.TextBox1SelectedItemKeys;
        this.OptionButtonSelectedItemKeys = original.OptionButtonSelectedItemKeys;
        this.NewMapSelectedItemKeys = original.NewMapSelectedItemKeys;
        this.TableSelectedItemKeys = original.TableSelectedItemKeys;
        this.Table1SelectedItemKeys = original.Table1SelectedItemKeys;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = SearchFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
            SearchFormViewModel._deleteDropDownInitialValues(reduced);
            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): SearchFormViewModel {
        var reduced = SearchFormViewModel._initializeFrom(this, ignoreReadOnlyProperties);
        SearchFormViewModel._deleteDropDownInitialValues(reduced);
        return reduced;
    }

    public static _deleteDropDownInitialValues(reduced: SearchFormViewModel) {
        if (reduced == null) return;

        delete reduced.DropdownCountryDataSet__InitialSelection;
        delete reduced.DropdownBox__InitialSelection;
        delete reduced.TextBox1__InitialSelection;

        DigicircMatchmaking.ViewModels.MasterPage.MasterPageViewModel._deleteDropDownInitialValues(reduced);
    }
public SelectedMode:
    any;
public SelectedActor:
    any;
public Query:
    any;
public DropdownCountryDataSet__InitialSelection:
    any;
public DropdownBox__InitialSelection:
    any;
public TextBox1__InitialSelection:
    any;
public DropdownCountryDataSetSelectedItemKeys:
    any[];
public DropdownBoxSelectedItemKeys:
    any[];
public SelectedModeOptionButtonSelectedItemKeys:
    any[];
public TextBox1SelectedItemKeys:
    any[];
public OptionButtonSelectedItemKeys:
    any[];
public NewMapSelectedItemKeys:
    any[];
public TableSelectedItemKeys:
    any[];
public Table1SelectedItemKeys:
    any[];
}

export class SelectedActor_ActorViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: SelectedActor_ActorViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): SelectedActor_ActorViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        SelectedActor_ActorViewModel = new SelectedActor_ActorViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateSelectedActor_ActorViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateSelectedActor_ActorViewModel(original: SelectedActor_ActorViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if (original._versionTimestamp !== undefined) this._versionTimestamp = original._versionTimestamp;
        if(original.Description !== undefined) this.Description = original.Description;
        if(original.Email !== undefined) this.Email = original.Email;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Name !== undefined) this.Name = original.Name;
        if(original.Url !== undefined) this.Url = original.Url;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = SelectedActor_ActorViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): SelectedActor_ActorViewModel {
        var reduced = SelectedActor_ActorViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Description:
    any;
public Email:
    any;
public Id:
    any;
public Name:
    any;
public Url:
    any;
    public _versionTimestamp?: string;
}

export class Query_SearchQueryViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
        this.ActorNames = new Array<any>();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        if(instance.SelectedCountry != null)
            instance.SelectedCountry = Query_SearchQuery_SelectedCountry_CountryViewModel._lightCast(instance.SelectedCountry);
        if(instance.SelectedSector != null)
            instance.SelectedSector = Query_SearchQuery_SelectedSector_SectorTypeViewModel._lightCast(instance.SelectedSector);

        if(instance.ActorNames != null) {
            for(let i = 0; i < instance.ActorNames.length; i++) {
                instance.ActorNames[i] = Query_SearchQuery_ActorNames_ActorNamesViewModel._lightCast(instance.ActorNames[i]);

            }
        }
        if(instance.SelectedMaterial != null)
            instance.SelectedMaterial = Query_SearchQuery_SelectedMaterial_MaterialViewModel._lightCast(instance.SelectedMaterial);
        return instance;
    }

    public static _initializeFrom(original: Query_SearchQueryViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): Query_SearchQueryViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        Query_SearchQueryViewModel = new Query_SearchQueryViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateQuery_SearchQueryViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateQuery_SearchQueryViewModel(original: Query_SearchQueryViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if(original.AdvanceSearch !== undefined) this.AdvanceSearch = original.AdvanceSearch;
        if(original.GetSearchTerm !== undefined) this.GetSearchTerm = original.GetSearchTerm;
        if(original.MaterialSearchMode !== undefined) this.MaterialSearchMode = original.MaterialSearchMode;
        if(original.SearchTerm !== undefined) this.SearchTerm = original.SearchTerm;
        if(original.SelectedMode !== undefined) this.SelectedMode = original.SelectedMode;
        if(original.ShowAllData !== undefined) this.ShowAllData = original.ShowAllData;
        if(original.ShowSavedPage !== undefined) this.ShowSavedPage = original.ShowSavedPage;

        if(original.SelectedCountry !== undefined) this.SelectedCountry = Query_SearchQuery_SelectedCountry_CountryViewModel._initializeFrom(original.SelectedCountry, ignoreReadOnlyProperties, context);

        if(original.SelectedSector !== undefined) this.SelectedSector = Query_SearchQuery_SelectedSector_SectorTypeViewModel._initializeFrom(original.SelectedSector, ignoreReadOnlyProperties, context);

        if(original.ActorNames != null) {
            for(let i = 0; i < original.ActorNames.length; i++) {
                this.ActorNames.push(Query_SearchQuery_ActorNames_ActorNamesViewModel._initializeFrom(original.ActorNames[i], ignoreReadOnlyProperties, context));
            }
        }

        if(original.SelectedMaterial !== undefined) this.SelectedMaterial = Query_SearchQuery_SelectedMaterial_MaterialViewModel._initializeFrom(original.SelectedMaterial, ignoreReadOnlyProperties, context);

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = Query_SearchQueryViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): Query_SearchQueryViewModel {
        var reduced = Query_SearchQueryViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public AdvanceSearch:
    any;
public GetSearchTerm:
    any;
public MaterialSearchMode:
    any;
public SearchTerm:
    any;
public SelectedMode:
    any;
public ShowAllData:
    any;
public ShowSavedPage:
    any;
public SelectedCountry:
    any;
public SelectedSector:
    any;
public ActorNames:
    Array<any>;
public SelectedMaterial:
    any;
}

export class Query_SearchQuery_SelectedCountry_CountryViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: Query_SearchQuery_SelectedCountry_CountryViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): Query_SearchQuery_SelectedCountry_CountryViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        Query_SearchQuery_SelectedCountry_CountryViewModel = new Query_SearchQuery_SelectedCountry_CountryViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateQuery_SearchQuery_SelectedCountry_CountryViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateQuery_SearchQuery_SelectedCountry_CountryViewModel(original: Query_SearchQuery_SelectedCountry_CountryViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if (original._versionTimestamp !== undefined) this._versionTimestamp = original._versionTimestamp;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Name !== undefined) this.Name = original.Name;
        if(original.ShortName !== undefined) this.ShortName = original.ShortName;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = Query_SearchQuery_SelectedCountry_CountryViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): Query_SearchQuery_SelectedCountry_CountryViewModel {
        var reduced = Query_SearchQuery_SelectedCountry_CountryViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Id:
    any;
public Name:
    any;
public ShortName:
    any;
    public _versionTimestamp?: string;
}

export class Query_SearchQuery_SelectedSector_SectorTypeViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: Query_SearchQuery_SelectedSector_SectorTypeViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): Query_SearchQuery_SelectedSector_SectorTypeViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        Query_SearchQuery_SelectedSector_SectorTypeViewModel = new Query_SearchQuery_SelectedSector_SectorTypeViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateQuery_SearchQuery_SelectedSector_SectorTypeViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateQuery_SearchQuery_SelectedSector_SectorTypeViewModel(original: Query_SearchQuery_SelectedSector_SectorTypeViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if(original.Code !== undefined) this.Code = original.Code;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Value !== undefined) this.Value = original.Value;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = Query_SearchQuery_SelectedSector_SectorTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): Query_SearchQuery_SelectedSector_SectorTypeViewModel {
        var reduced = Query_SearchQuery_SelectedSector_SectorTypeViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Code:
    any;
public Id:
    any;
public Value:
    any;
}

export class Query_SearchQuery_ActorNames_ActorNamesViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: Query_SearchQuery_ActorNames_ActorNamesViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): Query_SearchQuery_ActorNames_ActorNamesViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        Query_SearchQuery_ActorNames_ActorNamesViewModel = new Query_SearchQuery_ActorNames_ActorNamesViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateQuery_SearchQuery_ActorNames_ActorNamesViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateQuery_SearchQuery_ActorNames_ActorNamesViewModel(original: Query_SearchQuery_ActorNames_ActorNamesViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if(original.Id !== undefined) this.Id = original.Id;
        if(original.Name !== undefined) this.Name = original.Name;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = Query_SearchQuery_ActorNames_ActorNamesViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): Query_SearchQuery_ActorNames_ActorNamesViewModel {
        var reduced = Query_SearchQuery_ActorNames_ActorNamesViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Id:
    any;
public Name:
    any;
}

export class Query_SearchQuery_SelectedMaterial_MaterialViewModel extends BaseClass.ViewModel  {
    public constructor() {
        super();
    }


    public static _lightCast(instance: any): any {
        if (instance == null) return;

        return instance;
    }

    public static _initializeFrom(original: Query_SearchQuery_SelectedMaterial_MaterialViewModel, ignoreReadOnlyProperties: boolean = false, context = new Joove.DTOHelper()): Query_SearchQuery_SelectedMaterial_MaterialViewModel {
        if(original == null) return null;
        // if (context.Has(original)) {
        //    return context.Get(original);
        // }
var result:
        Query_SearchQuery_SelectedMaterial_MaterialViewModel = new Query_SearchQuery_SelectedMaterial_MaterialViewModel();
        if (context != null && context.fillDb == true) {
            context.addToDb(original);
        }
        result._hydrateQuery_SearchQuery_SelectedMaterial_MaterialViewModel(original, ignoreReadOnlyProperties, context);
        // context.Add(original, result);
        return result;
    }


    public _hydrateQuery_SearchQuery_SelectedMaterial_MaterialViewModel(original: Query_SearchQuery_SelectedMaterial_MaterialViewModel, ignoreReadOnlyProperties: boolean, context = new Joove.DTOHelper()): void {
        if(original == null) return;


        if(original._key !== undefined) this._key = original._key;
        if(original._clientKey !== undefined) this._clientKey = original._clientKey;
        if(original._originalTypeClassName !== undefined) this._originalTypeClassName = original._originalTypeClassName;
        if(original._typeHash !== undefined) this._typeHash = original._typeHash;

        if (original._versionTimestamp !== undefined) this._versionTimestamp = original._versionTimestamp;
        if(original.Description !== undefined) this.Description = original.Description;
        if(original.HsSpecific !== undefined) this.HsSpecific = original.HsSpecific;
        if(original.Id !== undefined) this.Id = original.Id;
        if(original.IsHazardous !== undefined) this.IsHazardous = original.IsHazardous;
        if(original.Name !== undefined) this.Name = original.Name;
        if(original.PendingGraph !== undefined) this.PendingGraph = original.PendingGraph;

        this._reduceData = function(ignoreReadOnlyProperties: boolean) {
            var reduced = Query_SearchQuery_SelectedMaterial_MaterialViewModel._initializeFrom(this, ignoreReadOnlyProperties);

            return reduced;
        };
    } /* end _initializeFrom() */


    public _reduceData(ignoreReadOnlyProperties: boolean): Query_SearchQuery_SelectedMaterial_MaterialViewModel {
        var reduced = Query_SearchQuery_SelectedMaterial_MaterialViewModel._initializeFrom(this, ignoreReadOnlyProperties);

        return reduced;
    }
public Description:
    any;
public HsSpecific:
    any;
public Id:
    any;
public IsHazardous:
    any;
public Name:
    any;
public PendingGraph:
    any;
    public _versionTimestamp?: string;
}

}
