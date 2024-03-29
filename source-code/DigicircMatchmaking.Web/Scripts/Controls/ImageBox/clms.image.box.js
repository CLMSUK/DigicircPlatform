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
        var JbImage = /** @class */ (function (_super) {
            __extends(JbImage, _super);
            function JbImage() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return JbImage;
        }(Joove.BaseAngularProvider));
        function jbImage($timeout, $interval, ngRadio) {
            return {
                priority: 1001,
                restrict: "AE",
                require: "ngModel",
                scope: {
                    model: "=ngModel",
                    fromServer: "=jbFromServer",
                    canUpload: "=?jbUpload",
                    maximizeOnClick: "=?jbThumbnail",
                    imageType: "=jbImageType",
                    source: "=?ngAttrSrc",
                    imageFolder: "@jbImageFolder",
                    accept: "=?jbAccept",
                    dontMakeFormDirty: "=jbDoesntMakeFormDirty",
                    maxSize: "=?jbMaxSize"
                },
                link: function ($scope, $element, $attrs, ngModelCtrl) {
                    if (Joove.Common.directiveScopeIsReady($element))
                        return;
                    $element.on("load", function () {
                        $element.removeClass("broken-image");
                    });
                    $element.on("load", function () {
                        $element.removeClass("broken-image");
                    });
                    $element.on("error", function () {
                        $element.addClass("broken-image");
                    });
                    Joove.Common.setDirectiveScope($element, $scope);
                    var name = Joove.Core.getElementName($element);
                    $scope.$uploadButton = null;
                    $scope.getDataToSend = function () {
                        var model = Joove.Common.getModel();
                        return Joove.Core.prepareDataForFileAction($element, model);
                    };
                    $scope.download = function (thumbnail, cb) {
                        var postData = {
                            model: $scope.getDataToSend(),
                            indexes: Joove.Common.getIndexesOfControl($element).key,
                            useThumbnail: thumbnail
                        };
                        Joove.Core.executeControllerAction(Joove.Core.getControllerForElement($element, false), name + "_Download", "POST", [], postData, null, function (data) { cb && cb(data); }, null, null, function (data) { console.log("Error loading image!", data); });
                    };
                    $scope.upload = function () {
                        var postData = $scope.getDataToSend();
                        var files = $scope.$uploadButton.get(0).files;
                        if ($scope.maxSize != null && $scope.maxSize > 0) {
                            for (var i = 0; i < files.length; i++) {
                                var file = files[0];
                                if (file.size > $scope.maxSize) {
                                    debugger;
                                    var msg = window._resourcesManager.getTooLargeFileMessage(file.name, file.size, $scope.maxSize);
                                    window._popUpManager.error("", msg);
                                    return;
                                }
                            }
                        }
                        Joove.Core.uploadFile({
                            files: files,
                            withProgressBar: false,
                            model: postData,
                            indexesKey: Joove.Common.getIndexesOfControl($element).key,
                            $element: $element,
                            onSuccess: function (data) {
                                $scope.fullSizeData = null;
                                if (data.Type != "FileUpload")
                                    return;
                                if (data.Legacy == true) {
                                    $scope.model = data.Data.FileName;
                                }
                                else {
                                    $scope.model = data;
                                }
                                $scope.setImage(data.ImageData);
                                $scope.$apply();
                            },
                            onError: function () {
                                $scope.setNotFoundImage();
                            }
                        });
                    };
                    $scope.setImage = function (imageData) {
                        if (imageData == null || imageData.length == null || imageData.length === 0) {
                            $scope.setNotFoundImage();
                        }
                        else {
                            var previousImage = $element.get(0);
                            var previousBroken_1 = $element.hasClass("broken-image");
                            var previousIncomplete_1 = previousImage.complete === false;
                            var previousSrc_1 = previousImage.src;
                            $element.attr("src", "data:image/jpeg;base64," + imageData);
                            setTimeout(function () {
                                if (previousIncomplete_1 == true || previousBroken_1 == true) {
                                    return;
                                }
                                var hadImage = (previousSrc_1 && previousSrc_1.trim && previousSrc_1.trim().length > 0);
                                if (hadImage == false) {
                                    return;
                                }
                                var currentImage = $element.get(0);
                                var currentBroken = $element.hasClass("broken-image");
                                if (currentImage.complete === false || currentBroken == true) {
                                    return;
                                }
                                if (previousSrc_1 != currentImage.src) {
                                    var dontMakeFormDirty = $scope.dontMakeFormDirty;
                                    if (previousSrc_1 == "data:image/jpeg;base64," + getNotFoundImageData()) {
                                        dontMakeFormDirty = true;
                                    }
                                    Joove.Core.onChange(currentImage, null, dontMakeFormDirty);
                                }
                            }, 50);
                        }
                    };
                    $scope.createUploadButton = function () {
                        var uniqTempId = Joove.Common.createRandomId(25);
                        var $container = $("<div class=\"image_upload_button\"></div>");
                        if ($scope.accept == null || $scope.accept.trim() == "") {
                            $scope.accept = "image/*";
                        }
                        $scope.$uploadButton = $("<input type='file' accept=\"" + $scope.accept + "\" jb-id='" + name + "UploadButton' id='" + uniqTempId + "'/>");
                        $scope.$label = $("<label for=\"" + uniqTempId + "\"><span class=\"fileattachment_progress\"><span class=\"fileattachment_progress_inner\"></span></span></label>");
                        $scope.$labelContent = $("<span class=\"fileattachment_content\">" + window._resourcesManager.getImageUploadTitle() + "</span>");
                        $scope.$label.prepend($scope.$labelContent);
                        $container.append($scope.$uploadButton);
                        $container.append($scope.$label);
                        $element.after($container);
                        $scope.$uploadButton.on("change", $scope.upload);
                    };
                    //This will fix those images that have a harcoded source (i.e. filesystem image in the form of src='/Resources/MyImage.png'), 
                    //but the Image itself is missing
                    $element.bind("error", function () {
                        $scope.setNotFoundImage();
                    });
                    //Set the Default image, if its was given
                    $scope.setDefaultFoundImage = function () {
                        var defaultPath = $element.attr("data-default-image") || "";
                        if (defaultPath.trim && defaultPath.trim() != "") {
                            $element.attr("src", defaultPath);
                            return true;
                        }
                        return false;
                    };
                    function getNotFoundImageData() {
                        return "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";
                    }
                    //Set the Default image, if given. Otherwise, set the hardcoded "Not Found" one
                    $scope.setNotFoundImage = function () {
                        if ($scope.setDefaultFoundImage() === false) {
                            $scope.setImage(getNotFoundImageData());
                        }
                    };
                    $scope.showFullSize = function () {
                        var $fullImg;
                        if ($scope.fullSizeData == null) {
                            if ($scope.fromServer) {
                                $scope.download(false, function (data) {
                                    $scope.fullSizeData = data;
                                    $scope.showFullSize();
                                });
                            }
                            else {
                                $fullImg = $("<img src='" + $($element).attr('src') + "' style='max-width: 100%; max-height: 100%; position: relative; top: 50%; transform: translateY(-50%);'/>").appendTo("body");
                            }
                        }
                        else {
                            $fullImg = $("<img src='data:image/jpeg;base64," + $scope.fullSizeData + "' style='max-width: 100%; max-height: 100%; position: relative; top: 50%; transform: translateY(-50%);'/>").appendTo("body");
                        }
                        window._popUpManager.showCustomPopUp({
                            name: $element.attr("jb-id"),
                            title: $element.attr("title"),
                            width: "85%",
                            height: "85%",
                            destroyOnHide: true,
                            $elementContent: $fullImg,
                            cancelButton: true,
                            onShowCallback: function ($popUp) {
                                $popUp.find("[jb-type='ModalBody']").css("text-align", "center");
                            },
                            dismissible: true
                        });
                    };
                    $scope.afterInit = function () {
                        if ($scope.canUpload == true) {
                            $scope.createUploadButton();
                        }
                        if ($scope.maximizeOnClick == true) {
                            $element.on("click", function () {
                                $scope.showFullSize();
                            });
                        }
                    };
                    $scope.init = function () {
                        if ($scope.fromServer == true) {
                            $scope.setNotFoundImage();
                            var hasFolder = $scope.imageFolder != null && $scope.imageFolder.trim() != "";
                            var hasModel = $scope.model != null && $scope.model.trim != null && $scope.model.trim() != "";
                            //If serving from FileSystem, lets get the image's URL and get on with it
                            if ($scope.imageType == "filesystem" && hasModel === true && hasFolder === true) {
                                var folder = $scope.imageFolder;
                                var defaultPath = $element.attr("data-default-image") || "";
                                $element.attr("src", "" + window._context.siteRoot + window._context.currentController + "/DownloadFileByPath?path=" + folder + $scope.model + "&defaultPath=" + defaultPath);
                            }
                            else {
                                var initInterval = setInterval(function () {
                                    if (Joove.Common.parentGridsAreReady($element) === true) {
                                        clearInterval(initInterval);
                                        new Joove.ElementViewPortObserver({
                                            $element: $element,
                                            interval: 1000,
                                            stopWhenEnters: true,
                                            onEnter: function () {
                                                $scope.download(true, function (data) {
                                                    $scope.setImage(data);
                                                });
                                            }
                                        }).start();
                                    }
                                }, 100);
                            }
                        }
                        $scope.afterInit();
                    };
                    $scope.init();
                    Joove.Common.markDirectiveScopeAsReady($element);
                }
            };
        }
        angular
            .module("jbImage", [])
            .provider("jbImage", new JbImage())
            .directive("jbImage", ["$timeout", "$interval", "jbImage", jbImage]);
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
