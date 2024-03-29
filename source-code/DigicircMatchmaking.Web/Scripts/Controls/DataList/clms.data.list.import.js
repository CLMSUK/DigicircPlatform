var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var ListImportResult = /** @class */ (function () {
            function ListImportResult() {
            }
            return ListImportResult;
        }());
        Widgets.ListImportResult = ListImportResult;
        var ImportError = /** @class */ (function () {
            function ImportError() {
            }
            return ImportError;
        }());
        Widgets.ImportError = ImportError;
        var ImportHelper = /** @class */ (function () {
            function ImportHelper(listRef) {
                this.listRef = listRef;
            }
            ImportHelper.prototype.getPopUpContent = function () {
                var _this = this;
                var self = this;
                var downloadCsvRes = this.listRef.resources.textResources.ImportDownload;
                var uploadCsvRes = this.listRef.resources.textResources.ImportUpload;
                var encodingRes = this.listRef.resources.textResources.ImportEncoding;
                var btnStyle = "style='display: block; width: 50%; margin: 0px auto; margin-top: 15px;'";
                var contents = "<div class='import-pop-up'>                           \n                        <div>\n                            <a jb-type=\"Button\" class='jb-control jb-link-btn btn btn-primary btn-csv-download' ui-role-color=\"primary\">\n                                <label jb-type=\"Label\" class=\"jb-control\">\n                                    " + downloadCsvRes + "\n                                </label>\n                            </a>\n                            <ul jb-type=\"FileAttachment\" jb-attachment=\"\" class=\"jb-control list-group file-attachment\">\n                                <div class=\"box has-advanced-upload\">\n                                    <div class=\"box__input\">\n                                        <svg id=\"Layer_1\" class=\"box__icon\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\">\n                                            <title>upload</title>\n                                            <g>\n                                                <polygon points=\"68.84 28.32 66.35 26.2 63.97 28.16 47.78 44.06 52.71 49.08 62.84 39.02 62.43 89.19 69.24 89.25 69.65 39.08 79.61 49.3 84.62 44.37 68.84 28.32\"></polygon>\n                                                <path class=\"cls-1\" d=\"M69.29,27.83l-2.93-2.5-2.84,2.33L46.84,44.06l5.87,6,9.45-9.39-.41,49.22,8.15.06.41-49.21,9.29,9.54,6-5.87ZM70,39.89l-.41,49.7-7.48-.06.41-49.7-9.79,9.72-5.4-5.49L63.75,27.9l2.6-2.13,2.73,2.32,16,16.28-5.49,5.4Z\"></path>\n                                                <path class=\"cls-1\" d=\"M69.08,28.09l-2.73-2.32-2.6,2.13L47.31,44.06l5.4,5.49,9.79-9.72-.41,49.7,7.48.06L70,39.89l9.63,9.88,5.49-5.4Zm.57,11-.41,50.17-6.81-.06L62.84,39,52.71,49.08l-4.93-5L64,28.16l2.39-2,2.49,2.12,15.78,16-5,4.93Z\"></path>\n                                            </g>\n                                            <polygon points=\"21.73 89.3 15.41 89.3 15.41 115.39 117 115.39 117 89.3 110.67 89.3 110.67 109.06 21.73 109.06 21.73 89.3\"></polygon>\n                                        </svg>\n                                        <input type=\"file\" jb-id=\"FileUploadUploadButton\" id=\"csv_file\" class=\"box__file\">\n                                        <label for=\"csv_file\"><span class=\"fileattachment_content\">" + uploadCsvRes + "</span>\n                                            <span class=\"fileattachment_progress\">\n                                                <span class=\"fileattachment_progress_inner\"></span>\n                                            </span>\n                                        </label>\n                                    </div>\n                                </div>\n                                <span class=\"encoding-notice\">" + encodingRes + "</span> \n                            </ul>\n                        </div>\n                        <div class='import-results-table'>\n                            <label jb-type=\"Label\" ui-role-color=\"success status-heading\">\n                                " + this.listRef.resources.textResources.ImportResult + "\n                            </label>                             \n                            <table jb-type=\"Table\" class=\"jb-control status-table\" style=\"width: 100%;\">\n                                <tr>\n                                    <th>\n                                        <i jb-type=\"Iconism\" class='glyphicon glyphicon-ok jb-control' ui-role-color=\"success\"></i>\n                                        <span>" + this.listRef.resources.textResources.ImportSuccess + ": </span>\n                                        <span class='import-success-value' jb-type=\"Label\" ui-role-color=\"success\">-</span>\n                                    </th>\n                                    <th>\n                                        <i jb-type=\"Iconism\" class='glyphicon glyphicon-remove jb-control' ui-role-color=\"danger\"></i>\n                                        <span>" + this.listRef.resources.textResources.ImportError + ": </span>\n                                        <span class='import-error-value' jb-type=\"Label\" ui-role-color=\"danger\">-</span>\n                                    </th>\n                                </tr>\n                                <tr class='on-error error-list-row'>\n                                    <td colspan='2'>\n                                        <a style='cursor: pointer; display: block; margin-top: 20px;' class='toggle-error-list'>\n                                            " + this.listRef.resources.textResources.ImportErrorList + "...\n                                        </a>\n                                    <td>                            \n                                </tr>\n                                    <tr class='on-error error-details-row'>\n                                        <td colspan='2'>ERROR CONTENTS HERE!!!!<td>                            \n                                </tr>\n                            </table>\n                        </div>\n                    </div>\n                </div>";
                var $contents = $(contents);
                this.$dndBox = $('.box', $contents);
                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
                    _this.$dndBox.on(event, function (e) {
                        // preventing the unwanted behaviours
                        e.preventDefault();
                        e.stopPropagation();
                    });
                });
                ['dragover', 'dragenter'].forEach(function (event) {
                    _this.$dndBox.on(event, function () {
                        _this.$dndBox.addClass("is-dragover");
                    });
                });
                ['dragleave', 'dragend', 'drop'].forEach(function (event) {
                    _this.$dndBox.on(event, function () {
                        _this.$dndBox.removeClass("is-dragover");
                    });
                });
                this.$dndBox.on('drop', function (e) {
                    if (!e.originalEvent.dataTransfer) {
                        return;
                    }
                    var droppedFiles = e.originalEvent.dataTransfer.files; // the files that were dropped
                    _this.uploadCsvForImport(droppedFiles, $contents);
                });
                this.$labelContent = $('.fileattachment_content', $contents);
                $contents.find(".btn-csv-download").on("click", function () {
                    _this.downloadCsvTemplate();
                });
                $contents.find("#csv_file").eq(0).on("change", function () {
                    var files = this.files;
                    self.uploadCsvForImport(files, $contents);
                });
                $contents.find(".toggle-error-list").on("click", function () {
                    var $target = $contents.find(".error-details-row");
                    var hide = $target.data("state") == "visible";
                    if (hide === true) {
                        $target.hide();
                        $target.data("state", "hidden");
                    }
                    else {
                        $target.show();
                        $target.data("state", "visible");
                    }
                });
                return $contents;
            };
            ImportHelper.prototype.downloadCsvTemplate = function () {
                window.location.href = window._context.siteRoot + "/" + window._context.currentController + "/" + this.listRef.serversideElementId + "_ImportTemplate";
            };
            ImportHelper.prototype.uploadCsvForImport = function (files, $content) {
                var _this = this;
                if (files == null || files.length == 0)
                    return;
                this.$labelContent.html(window._resourcesManager.getFileUploadLoading());
                Joove.Core.uploadFile({
                    $element: null,
                    files: files,
                    indexesKey: null,
                    withProgressBar: false,
                    model: null,
                    targetUrl: window._context.siteRoot + "/" + window._context.currentController + "/" + this.listRef.serversideElementId + "_ImportData",
                    onSuccess: function (data) {
                        _this.showImportResults(data, $content);
                        _this.listRef.dataTableInstance.draw();
                        _this.$labelContent.html(_this.listRef.resources.textResources.ImportUpload);
                    }
                });
            };
            ImportHelper.prototype.showImportResults = function (results, $content) {
                this.resetResults($content);
                $content.find(".import-results-table").show();
                $content.find(".import-success-value").text(results.NumberImported);
                $content.find(".import-error-value").text(results.NumberFailled);
                var hasErrors = results.Errors != null && results.Errors.length > 0;
                if (hasErrors === false)
                    return;
                $content.find(".error-list-row").show();
                var $target = $content.find(".error-details-row > td").eq(0);
                for (var i = 0; i < results.Errors.length; i++) {
                    var current = results.Errors[i];
                    var row = "<span class='error-row'>" + (i + 1) + ". " + current.ErrorMessage + " (row #" + current.RowNumber + ")</span></br>";
                    $target.append(row);
                }
            };
            ImportHelper.prototype.resetResults = function ($contents) {
                $contents.find(".import-results-table").hide();
                $contents.find(".on-error").hide();
                $contents.find(".error-details-row > td").eq(0).empty();
            };
            return ImportHelper;
        }());
        Widgets.ImportHelper = ImportHelper;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
