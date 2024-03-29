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
        var JbTabs = /** @class */ (function (_super) {
            __extends(JbTabs, _super);
            function JbTabs() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JbTabs;
        }(Joove.BaseAngularProvider));
        function ToJavaScriptDate(value) {
            var pattern = /Date\(([^)]+)\)/;
            var results = pattern.exec(value);
            var dt = new Date(parseFloat(results[1]));
            return dt.toUTCString();
        }
        function jbAttachment($timeout, $interval, ngRadio) {
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
                link: function ($scope, $element, $attrs, ngModelCtrl) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    Joove.Common.setDirectiveScope($element, $scope);
                    var name = Joove.Core.getElementName($element);
                    var model;
                    try {
                        model = Joove.Common.getModel();
                    }
                    catch (e) {
                        console.error(e);
                        model = {};
                    }
                    $scope.$uploadButton = null;
                    $scope.getDataToSend = function () {
                        var model = Joove.Common.getModel();
                        return Joove.Core.prepareDataForFileAction($element, model);
                    };
                    $scope.download = function ($anchor) {
                        var postData = {
                            model: $scope.getDataToSend(),
                            indexes: Joove.Common.getIndexesOfControl($anchor).key
                        };
                        Joove.Core.executeControllerAction(Joove.Core.getControllerForElement($element, false), name + "_Download", "POST", [], postData, null, function (data) {
                            if (data == null || data.trim().length === 0) {
                                window._popUpManager.error(window._resourcesManager.getFileNotFound());
                            }
                            else {
                                CLMS.Framework.Utilities.OpenWindow(window._context.siteRoot + "/" + Joove.Core.getControllerForElement($element, false) + "/DownloadFile?id=" + data);
                            }
                        });
                    };
                    $scope.upload = function (files, withProgressBar) {
                        var files = files || $scope.$uploadButton.get(0).files;
                        if (files.length === 0)
                            return;
                        if ($scope.maxSize != null && $scope.maxSize > 0) {
                            for (var i = 0; i < files.length; i++) {
                                var file = files[0];
                                if (file.size > $scope.maxSize) {
                                    var msg = window._resourcesManager.getTooLargeFileMessage(file.name, file.size, $scope.maxSize);
                                    window._popUpManager.error("", msg);
                                    return;
                                }
                            }
                        }
                        changeState("has-uploading");
                        $scope.$labelContent.html(window._resourcesManager.getFileUploadLoading());
                        var postData = $scope.getDataToSend();
                        Joove.Core.uploadFile({
                            withProgressBar: withProgressBar,
                            $progressBar: $scope.progressBar,
                            files: files,
                            model: postData,
                            indexesKey: Joove.Common.getIndexesOfControl($element).key,
                            $element: $element,
                            onSuccess: function (data) {
                                changeState("has-success");
                                setName(files);
                                Joove.Core.onChange($element.get(0), undefined);
                                window._context.isDirty = true;
                                if ($scope.isMultiple !== true) {
                                    if (data.Legacy == true) {
                                        $scope.model = data.Data.FileName;
                                    }
                                    else {
                                        $scope.model = data.Data;
                                        $scope.model.UploadDateTime = ToJavaScriptDate(data.Data.UploadDateTime);
                                    }
                                    $scope.$apply();
                                }
                                if (!$scope.hideSuccessMessage) {
                                    window._popUpManager.success(window._resourcesManager.getFileUploadTitle(), window._resourcesManager.getFileUploadSuccess());
                                }
                            },
                            onError: function (jqXhr, textStatus, errorThrown) {
                                changeState("has-error");
                                $scope.$labelContent.text(window._resourcesManager.getFileUploadError());
                                window._popUpManager.error(window._resourcesManager.getFileUploadTitle(), window._resourcesManager.getFileUploadError() + "<br/><br/>" + errorThrown);
                            }
                        });
                    };
                    $scope.remove = function ($anchor) {
                        var indexes = Joove.Common.getIndexesOfControl($anchor);
                        Joove.Core.executeControllerAction(Joove.Core.getControllerForElement($element, false), name + "_Remove", "POST", [], { model: Joove.Common.getModel(), indexes: indexes.key }, null, function (data) {
                            //Handle removal
                            changeState(null);
                            $scope.$labelContent.text(window._resourcesManager.getFileUploadTitle());
                            window._context.isDirty = true;
                        });
                    };
                    function changeState(state) {
                        $scope.$label.removeClass("has-uploading");
                        $scope.$label.removeClass("has-error");
                        $scope.$label.removeClass("has-success");
                        if (state != null)
                            $scope.$label.addClass(state);
                    }
                    function createUploadButton(isAdvancedUpload) {
                        var uniqTempId = Joove.Common.createRandomId(25);
                        $scope.$uploadButton = $("<input type='file' jb-id='" + name + "UploadButton' id='" + uniqTempId + "'/>");
                        if ($scope.accept != null && $scope.accept.trim() != "") {
                            $scope.$uploadButton.attr("accept", $scope.accept);
                        }
                        $scope.$label = $("<label for=\"" + uniqTempId + "\">\n<span class=\"fileattachment_progress\"><span class=\"fileattachment_progress_inner\"></span></span></label>");
                        $scope.$labelContent = $("<span class=\"fileattachment_content\">" + window._resourcesManager.getFileUploadTitle() + "</span>");
                        $scope.$label.prepend($scope.$labelContent);
                        if ($scope.isMultiple === true) {
                            $scope.$uploadButton.attr("multiple", "true");
                        }
                        if (isAdvancedUpload && $scope.isDragAndDropBox) {
                            $scope.$dndBox = $("<div class=\"box\">\n    <div class=\"box__input\">\n        <svg id=\"Layer_1\" class=\"box__icon\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\"><title>upload</title><g><polygon points=\"68.84 28.32 66.35 26.2 63.97 28.16 47.78 44.06 52.71 49.08 62.84 39.02 62.43 89.19 69.24 89.25 69.65 39.08 79.61 49.3 84.62 44.37 68.84 28.32\"/><path class=\"cls-1\" d=\"M69.29,27.83l-2.93-2.5-2.84,2.33L46.84,44.06l5.87,6,9.45-9.39-.41,49.22,8.15.06.41-49.21,9.29,9.54,6-5.87ZM70,39.89l-.41,49.7-7.48-.06.41-49.7-9.79,9.72-5.4-5.49L63.75,27.9l2.6-2.13,2.73,2.32,16,16.28-5.49,5.4Z\"/><path class=\"cls-1\" d=\"M69.08,28.09l-2.73-2.32-2.6,2.13L47.31,44.06l5.4,5.49,9.79-9.72-.41,49.7,7.48.06L70,39.89l9.63,9.88,5.49-5.4Zm.57,11-.41,50.17-6.81-.06L62.84,39,52.71,49.08l-4.93-5L64,28.16l2.39-2,2.49,2.12,15.78,16-5,4.93Z\"/></g><polygon points=\"21.73 89.3 15.41 89.3 15.41 115.39 117 115.39 117 89.3 110.67 89.3 110.67 109.06 21.73 109.06 21.73 89.3\"/></svg>\n\n    </div>\n</div>");
                            $element.append($scope.$dndBox);
                            var input_container = $(".box__input", $scope.$dndBox);
                            $scope.$uploadButton.addClass("box__file");
                            input_container.append($scope.$uploadButton);
                            input_container.append($scope.$label);
                            $scope.progressBar = new Joove.ProgressBar(window._resourcesManager.getFileUploadLoading(), '.fileattachment_content', '', $scope.$label);
                        }
                        else {
                            $element.after($scope.$uploadButton);
                            $scope.$uploadButton.addClass("fileattachment-inputfile");
                            $scope.$uploadButton.after($scope.$label);
                            // Firefox bug fix
                            $scope.progressBar = new Joove.ProgressBar(window._resourcesManager.getFileUploadLoading(), '.fileattachment_content', '.fileattachment_progress_inner', $scope.$label);
                        }
                        $scope.$uploadButton
                            .on('focus', function () { $scope.$uploadButton.addClass('has-focus'); })
                            .on('blur', function () { $scope.$uploadButton.removeClass('has-focus'); });
                        $scope.$uploadButton.on("change", function () { return $scope.upload(null, true); });
                    }
                    function setName(files) {
                        if (files.length > 1) {
                            $scope.$labelContent.text(files.length + " files");
                        }
                        else {
                            $scope.$labelContent.text(files[0].name);
                        }
                    }
                    function init(isAdvancedUpload) {
                        if ($scope.canUpload === true) {
                            createUploadButton(isAdvancedUpload);
                        }
                        $element.on("click", "a.link", function (event) {
                            $scope.download($(event.target));
                        });
                        $element.on("click", "a.remove", function (event) {
                            $scope.remove($(event.target));
                        });
                        if (isAdvancedUpload && $scope.isDragAndDropBox) {
                            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
                                $scope.$dndBox.on(event, function (e) {
                                    // preventing the unwanted behaviours
                                    e.preventDefault();
                                    e.stopPropagation();
                                });
                            });
                            ['dragover', 'dragenter'].forEach(function (event) {
                                $scope.$dndBox.on(event, function () {
                                    $scope.$dndBox.addClass("is-dragover");
                                });
                            });
                            ['dragleave', 'dragend', 'drop'].forEach(function (event) {
                                $scope.$dndBox.on(event, function () {
                                    $scope.$dndBox.removeClass("is-dragover");
                                });
                            });
                            $scope.$dndBox.on('drop', function (e) {
                                if (!e.originalEvent.dataTransfer) {
                                    return;
                                }
                                var droppedFiles = e.originalEvent.dataTransfer.files; // the files that were dropped
                                $scope.upload(droppedFiles, !(isAdvancedUpload && $scope.isDragAndDropBox));
                            });
                        }
                        $scope.$watch("model", function (value) {
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
                    var isAdvancedUpload = (function () {
                        var div = document.createElement('div');
                        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && ('FormData' in window) && 'FileReader' in window;
                    })();
                    var $form = $('.box');
                    if (isAdvancedUpload) {
                        $form.addClass('has-advanced-upload');
                    }
                    init(isAdvancedUpload);
                    Joove.Common.markDirectiveScopeAsReady($element);
                }
            };
        }
        angular
            .module("jbAttachment", [])
            .provider("jbAttachment", new JbTabs())
            .directive("jbAttachment", [
            "$timeout", "$interval", "jbAttachment", jbAttachment
        ]);
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
            window.addEventListener(event, function (e) {
                e = e || event;
                e.preventDefault();
            }, false);
        });
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
