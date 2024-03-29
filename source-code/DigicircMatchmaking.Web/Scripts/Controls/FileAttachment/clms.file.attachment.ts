﻿namespace Joove.Widgets {

    class JbTabs extends BaseAngularProvider {
    }

    interface IJbTabsScope extends IJooveScope {
        chartHelper: ChartHelper;
        selectedItem: any;
        selectedDataSetIndex: number;
        $uploadButton: any;
        download: ($anchor: JQuery) => void;
        upload: (files, withProgressBar) => void;
        remove: ($anchor: JQuery) => void;
        createUploadButton: () => void;
        canUpload;
        isMultiple: boolean;
        isDragAndDropBox: boolean;
        getDataToSend:() => any;
        attachmentType: string;
        accept: string;
        maxSize: number;
		previousModelFileNames: Array<string>;
        deletingFile: boolean;
    }

    function ToJavaScriptDate(value) {
        var parsed = Date.parse(value);
        var date = new Date(parsed);
        return date.toUTCString();
    }

    function jbAttachment($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            priority: 1001,
            restrict: "AE",
            require: "ngModel",
            scope: {
                model: "=ngModel",
                canUpload: "=?jbUpload",
                isMultiple: "=?jbMultiple",
                isDragAndDropBox: "=?jbDrag",
                hideSuccessMessage: "=?jbHideSuccess",
                attachmentType: "=?jbAttachmentType",
                accept: "=jbAccept",
                maxSize: "=jbMaxSize",
            },
            link($scope: IJbTabsScope, $element: JQuery, $attrs, ngModelCtrl) {
                if (Common.directiveScopeIsReady($element)) return;

                Common.setDirectiveScope($element, $scope);

                var name = Core.getElementName($element);

                var model;
                try {
                    model = Common.getModel();
                } catch (e) {
                    console.error(e);
                    model = {};
                }

                $scope.$uploadButton = null;

                $scope.getDataToSend = (): any => {
                    var model = Common.getModel();
                    return Core.prepareDataForFileAction($element, model);
                }

                $scope.download = ($anchor: JQuery) => {
                    const postData = {
                        model: $scope.getDataToSend(),
                        indexes: Common.getIndexesOfControl($anchor).key
                    };

                    Core.executeControllerAction(Core.getControllerForElement($element, false),
                        `${name}_Download`,
                        "POST",
                        [],
                        postData,
                        null,
                        data => {
                            if (data == null || data.trim().length === 0) {
                                window._popUpManager.error(window._resourcesManager.getFileNotFound());
                            } else {
                                CLMS.Framework.Utilities.OpenWindow(`${window._context.siteRoot}/${Core.getControllerForElement($element, false)}/DownloadFile?id=${data}`);
                            }
                        });
                };

                $scope.upload = (files, withProgressBar) => {
                    var files = files || $scope.$uploadButton.get(0).files;

                    if (files.length === 0) return;
                    
                    if ($scope.maxSize != null && $scope.maxSize > 0) {
                        for (let i = 0; i < files.length; i++) {
                            const file = files[0];

                            if (file.size > $scope.maxSize) {                               
                                const msg = window._resourcesManager.getTooLargeFileMessage(file.name, file.size, $scope.maxSize);                                
                                window._popUpManager.error("", msg);                                
                                return;
                            }
                        }
                    }

                    changeState("has-uploading");
                    $scope.$labelContent.html(window._resourcesManager.getFileUploadLoading());
                    
                    const postData = $scope.getDataToSend();
                    
                    Core.uploadFile({
                        withProgressBar: withProgressBar,
                        $progressBar: $scope.progressBar,
                        files: files,
                        model: postData,
                        indexesKey: Common.getIndexesOfControl($element).key,
                        $element: $element,
                        onSuccess(data) {
                            changeState("has-success");
                            setName(files);

                            Core.onChange($element.get(0), undefined);
                            window._context.isDirty = true;
                                            
                            //if ($scope.isMultiple !== true) {                                
                            //    if (data.Legacy == true) {
                            //        $scope.model = data.Data.FileName;
                            //    }
                            //    else {
                            //        $scope.model = data.Data;
                            //        $scope.model.UploadDateTime = ToJavaScriptDate(data.Data.UploadDateTime);
                            //    }

                            //    $scope.$apply();                                
                            //}

                            
                            if ($scope.isMultiple !== true && data.Legacy == true) {
                                $scope.model = data.Data.FileName;
                            }
                            else {
                                $scope.model = data.Data;

                                if ($scope.isMultiple !== true) {
                                    $scope.model.UploadDateTime = ToJavaScriptDate(data.Data.UploadDateTime);
                                }
                                else {
                                    for (let i = 0; i < $scope.model.length; i++) {
                                        $scope.model[i].UploadDateTime = ToJavaScriptDate(data.Data[i].UploadDateTime);
                                    }
                                }
                                
                            }

                            $scope.$apply();
                            
                            
                            if (!$scope.hideSuccessMessage) {
                                window._popUpManager.success(window._resourcesManager.getFileUploadTitle(),
                                    window._resourcesManager.getFileUploadSuccess());
                            }
                        },
                        onError(jqXhr, textStatus, errorThrown) {
                            changeState("has-error");
                            $scope.$labelContent.text(window._resourcesManager.getFileUploadError());
                            window._popUpManager.error(window._resourcesManager.getFileUploadTitle(),
                                window._resourcesManager.getFileUploadError() + "<br/><br/>" + errorThrown);
                        }
                    });
                }

                $scope.remove = ($anchor: JQuery) => {
                    $scope.deletingFile = true;

                    var indexes = Common.getIndexesOfControl($anchor);

                    Core.executeControllerAction(Core.getControllerForElement($element, false),
                        `${name}_Remove`,
                        "POST",
                        [],
                        { model: Common.getModel(), indexes: indexes.key },
                        null,
                        data => {
                            //Handle removal
                            changeState(null);
                            $scope.$labelContent.text(window._resourcesManager.getFileUploadTitle());
                            window._context.isDirty = true;
                            $scope.deletingFile = false;
                            if ($scope.isMultiple) {
                                let deletedFile = $scope.previousModelFileNames[indexes.indexes[0]];
                                $scope.previousModelFileNames.remove(deletedFile);
                            }
                        });
                }

                function changeState(state: string) {
                    $scope.$label.removeClass("has-uploading");
                    $scope.$label.removeClass("has-error");
                    $scope.$label.removeClass("has-success");

                    if (state != null) $scope.$label.addClass(state);
                }

                function createUploadButton(isAdvancedUpload) {
                    const uniqTempId = Joove.Common.createRandomId(25);

                    $scope.$uploadButton = $(`<input type='file' jb-id='${name}UploadButton' id='${uniqTempId}'/>`);

                    if ($scope.accept != null && $scope.accept.trim() != "") {
                        $scope.$uploadButton.attr("accept", $scope.accept);
                    }

                    $scope.$label = $(`<label for="${uniqTempId}">
<span class="fileattachment_progress"><span class="fileattachment_progress_inner"></span></span></label>`);
                    $scope.$labelContent = $(`<span class="fileattachment_content">${window._resourcesManager.getFileUploadTitle()}</span>`);

                    $scope.$label.prepend($scope.$labelContent);

                    if ($scope.isMultiple === true) {
                        $scope.$uploadButton.attr("multiple", "true");
                    }

                    if (isAdvancedUpload && $scope.isDragAndDropBox) {
                        $scope.$dndBox = $(`<div class="box">
    <div class="box__input">
        <svg id="Layer_1" class="box__icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>upload</title><g><polygon points="68.84 28.32 66.35 26.2 63.97 28.16 47.78 44.06 52.71 49.08 62.84 39.02 62.43 89.19 69.24 89.25 69.65 39.08 79.61 49.3 84.62 44.37 68.84 28.32"/><path class="cls-1" d="M69.29,27.83l-2.93-2.5-2.84,2.33L46.84,44.06l5.87,6,9.45-9.39-.41,49.22,8.15.06.41-49.21,9.29,9.54,6-5.87ZM70,39.89l-.41,49.7-7.48-.06.41-49.7-9.79,9.72-5.4-5.49L63.75,27.9l2.6-2.13,2.73,2.32,16,16.28-5.49,5.4Z"/><path class="cls-1" d="M69.08,28.09l-2.73-2.32-2.6,2.13L47.31,44.06l5.4,5.49,9.79-9.72-.41,49.7,7.48.06L70,39.89l9.63,9.88,5.49-5.4Zm.57,11-.41,50.17-6.81-.06L62.84,39,52.71,49.08l-4.93-5L64,28.16l2.39-2,2.49,2.12,15.78,16-5,4.93Z"/></g><polygon points="21.73 89.3 15.41 89.3 15.41 115.39 117 115.39 117 89.3 110.67 89.3 110.67 109.06 21.73 109.06 21.73 89.3"/></svg>

    </div>
</div>`);
                        $element.append($scope.$dndBox);

                        const input_container = $(".box__input", $scope.$dndBox);
                        $scope.$uploadButton.addClass("box__file");
                        input_container.append($scope.$uploadButton);                        
                        input_container.append($scope.$label);

                        $scope.progressBar = new ProgressBar(
                            window._resourcesManager.getFileUploadLoading(),
                            '.fileattachment_content',
                            '',
                            $scope.$label
                        );
                    } else {                        
                        $element.after($scope.$uploadButton);
                        
                        $scope.$uploadButton.addClass("fileattachment-inputfile");
                        $scope.$uploadButton.after($scope.$label);
                        // Firefox bug fix

                        $scope.progressBar = new ProgressBar(
                            window._resourcesManager.getFileUploadLoading(),
                            '.fileattachment_content',
                            '.fileattachment_progress_inner',
                            $scope.$label
                        );
                       
                    }

                    $scope.$uploadButton
                        .on('focus', () => { $scope.$uploadButton.addClass('has-focus'); })
                        .on('blur', () => { $scope.$uploadButton.removeClass('has-focus'); });

                    $scope.$uploadButton.on("change", () => $scope.upload(null, true));                    
                }

                function setName(files: Array<any>) {
                    if (files.length > 1) {
                        $scope.$labelContent.text(files.length + " files");
                    } else {
                        $scope.$labelContent.text(files[0].name);
                    }
                }

                function init(isAdvancedUpload) {
                    if ($scope.canUpload === true) {
                        createUploadButton(isAdvancedUpload);
                    }

                    $element.on("click", "a.link",
                        (event) => {
                            $scope.download($(event.target));
                        });

                    $element.on("click", "a.remove",
                        (event) => {
                            $scope.remove($(event.target));
                        });

                    if (isAdvancedUpload && $scope.isDragAndDropBox) {
                        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((event) => {
                            $scope.$dndBox.on(event,
                                (e) => {
                                    // preventing the unwanted behaviours
                                    e.preventDefault();
                                    e.stopPropagation();
                                });
                        });
                        ['dragover', 'dragenter'].forEach((event) => {
                            $scope.$dndBox.on(event, () => {
                                $scope.$dndBox.addClass("is-dragover");
                            });
                        });
                        ['dragleave', 'dragend', 'drop'].forEach((event) => {
                            $scope.$dndBox.on(event, () => {
                                $scope.$dndBox.removeClass("is-dragover");
                            });
                        });
                        $scope.$dndBox.on('drop', (e) => {
                            if (!e.originalEvent.dataTransfer) {
                                return;
                            }
                            const droppedFiles = e.originalEvent.dataTransfer.files; // the files that were dropped



                            $scope.upload(droppedFiles, !(isAdvancedUpload && $scope.isDragAndDropBox));
                        });
                    }

                    if ($scope.isMultiple === true) {
                        $scope.$watchCollection("model", value => {

                            if (($scope.previousModelFileNames != null && $scope.previousModelFileNames.length) && ($scope.previousModelFileNames.length > (<any>value).length)) {
                                if ($scope.deletingFile === true) return; 

                                for (let i = 0; i < $scope.previousModelFileNames.length; i++) {
                                    let item = $scope.previousModelFileNames[i];
                                    let foundItem = false;
                                    for (let x = 0; x < (<any>value).length; x++) {
                                        if (item == value[x].FileName) {
                                            foundItem = true;
                                            break;
                                        }
                                    }
                                    if (foundItem == false) {
                                        $scope.deletingFile = true;
                                        var indexes = Common.getIndexesOfControl($element);
                                        let indexesString = i.toString();
                                        if (indexes != null && indexes.key != null && indexes.key.trim() != "") {
                                            indexesString = `${i}_${indexes.key}`
                                        }

                                        $scope.previousModelFileNames.remove(item);
                                        let controller = window._context.currentController;
                                        $.ajax({
                                            url: `${window._context.siteRoot}${controller}/${name}_Clear/${indexesString}`,
                                            type: "GET",
                                            cache: false,
                                            success: (data: any, textStatus: string, jqXhr: JQueryXHR) => {

                                            },
                                            error: (jqXhr: JQueryXHR, textStatus: string, errorThrown: string) => {

                                            },
                                            complete: (jqXhr: JQueryXHR, textStatus: string) => {
                                                $scope.deletingFile = false;
                                            }
                                        });
                                    }
                                }
                            }

                            $scope.previousModelFileNames = new Array<string>();
                            if (value != null) {
                                for (let x = 0; x < (<any>value).length; x++) {
                                    $scope.previousModelFileNames.push(value[x].FileName);
                                }
                            }
                        });
                    }
                    else {
                        $scope.$watch("model", value => {
                            if (value != null) {
                                if (typeof value === "string") {
                                    setName([{ name: value }]);
                                }
                            }
                            else if ($scope.$labelContent != null) {
                                $scope.$labelContent.text(window._resourcesManager.getFileUploadTitle());
                            }
                        });
                    }    
                }

                const isAdvancedUpload = (() => {
                    const div = document.createElement('div');
                    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && ('FormData' in window) && 'FileReader' in window;
                })();

                var $form = $('.box');

                if (isAdvancedUpload) {
                    $form.addClass('has-advanced-upload');
                }

                init(isAdvancedUpload);

                Common.markDirectiveScopeAsReady($element);
            }
        };
    }

    angular
        .module("jbAttachment", [])
        .provider("jbAttachment", new JbTabs())
        .directive("jbAttachment",
        [
            "$timeout", "$interval", "jbAttachment", jbAttachment
        ]);

    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((event) => {
        window.addEventListener(event, (e: any) => {
            e = e || event;
            e.preventDefault();
        }, false);
    });
}