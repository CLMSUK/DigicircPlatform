var Joove;
(function (Joove) {
    var MessageType = /** @class */ (function () {
        function MessageType() {
        }
        MessageType.Error = "Error";
        MessageType.Success = "Success";
        MessageType.Info = "Info";
        MessageType.Warning = "Warning";
        MessageType.Alert = "Alert";
        return MessageType;
    }());
    Joove.MessageType = MessageType;
    var PopupTypes = {
        INFO: "info",
        WARNING: "warning",
        ERROR: "error",
        SUCCESS: "success",
        ALERT: "alert",
        CUSTOM: null
    };
    var OpenPopUpTypes;
    (function (OpenPopUpTypes) {
        OpenPopUpTypes[OpenPopUpTypes["PopUp"] = 1] = "PopUp";
        OpenPopUpTypes[OpenPopUpTypes["Modal"] = 2] = "Modal";
    })(OpenPopUpTypes = Joove.OpenPopUpTypes || (Joove.OpenPopUpTypes = {}));
    var PopUpManager = /** @class */ (function () {
        function PopUpManager() {
            this.spinnerId = "JbLoadingSpinner";
            this.showLoadingTimeout = null;
            this.hideLoadingTimeout = null;
            this.popUpVisible = false;
            this.confirmationVisible = false;
            this.openPopUpStack = [];
            this.isIE = Joove.Core.isIE();
            this.previouslyFocusedElement = null;
            this.popUps = [];
        }
        PopUpManager.prototype.resetFocus = function () {
            if (this.previouslyFocusedElement == null)
                return;
            $(this.previouslyFocusedElement).focus();
            this.previouslyFocusedElement = null;
        };
        Object.defineProperty(PopUpManager.prototype, "isLoading", {
            get: function () {
                var exists = $("#" + this.spinnerId).length > 0;
                var isVisible = $("#" + this.spinnerId).is(":visible");
                return exists && isVisible;
            },
            enumerable: false,
            configurable: true
        });
        PopUpManager.prototype.registerPopUp = function (options) {
            if (options.name == null || options.name.trim() === "") {
                console.error("Please provide a pop up name");
                return;
            }
            if (this.popUps[options.name] != null) {
                console.warn("A pop up is already registered and will be overwritten. Name: " + options.name);
            }
            this.popUps[options.name] = options;
        };
        PopUpManager.prototype.showPopUp = function (name) {
            var options = this.popUps[name];
            if (options == null) {
                console.error("Not found registered pop up with name: " + name);
                return;
            }
            this.showCustomPopUp(options);
            this.hideScrollbars();
            this.disableKeyboardEvents();
            this.disableMouseWheelScroll();
            this.popUpVisible = true;
        };
        /**
         * Returns the Parent of the element, if it is a Modal
         * @param element The element that might be inside a Modal
         */
        PopUpManager.prototype.getModalParent = function (element) {
            if (element == null)
                return null;
            var modal = element.closest("[jb-type='Modal']");
            if (modal != null && modal.length > 0 && modal[0] != null) {
                return modal[0];
            }
            return null;
        };
        PopUpManager.prototype.hidePopUp = function (name, dontCallCloseCb) {
            if (dontCallCloseCb === void 0) { dontCallCloseCb = false; }
            var $existing = $("[jb-type='Modal'][data-name='" + name + "'], [jb-type='Slide'][data-name='" + name + "']");
            this.popUpVisible = false;
            if ($existing.length === 0) {
                console.error("Not found pop up with name: " + name);
                return;
            }
            var options = this.popUps[name];
            if (options != null) {
                var parentModal = options.parentModal;
                if (parentModal != null) {
                    $(parentModal).show();
                    this.popUpVisible = true;
                }
            }
            if ($existing.hasClass("slide-popup")) {
                $existing.css("right", "-" + $existing.width() + "px");
            }
            else {
                if (this.isIE) {
                    $existing.hide();
                }
                else {
                    $existing.fadeOut();
                }
            }
            $existing.removeClass("popup-visible");
            if (dontCallCloseCb !== true && options != null) {
                options.closeCallback && options.closeCallback();
            }
            this.removeFromOpenPopUpStack(name, OpenPopUpTypes.PopUp);
            this.handleOpenPopUpStack();
            //this.popUpVisible = this.popUpVisible || false;
            this.popUpVisible = this.openPopUpStack.length > 0;
            if (this.popUpVisible === false) {
                this.showScrollbars();
                this.enableKeyboardEvents();
                this.enableMouseWheelScroll();
                $(".jb-modal-overlay").hide();
            }
        };
        PopUpManager.prototype.addToOpenPopUpStack = function (name, type) {
            if (!this.openPopUpStack.some(function (popup) { return popup.name === name && popup.type === type; })) {
                this.openPopUpStack.push({ "name": name, "type": type });
            }
        };
        PopUpManager.prototype.removeFromOpenPopUpStack = function (name, type) {
            for (var i = this.openPopUpStack.length - 1; i >= 0; i--) {
                if (this.openPopUpStack[i].name === name && this.openPopUpStack[i].type === type) {
                    this.openPopUpStack.splice(i, 1);
                    break;
                }
            }
        };
        PopUpManager.prototype.handleOpenPopUpStack = function () {
            if (this.openPopUpStack.length === 0)
                return;
            var $popUpElement;
            var lastOpenedPopUp = this.openPopUpStack[this.openPopUpStack.length - 1];
            switch (lastOpenedPopUp.type) {
                case OpenPopUpTypes.PopUp:
                    $popUpElement = $("[jb-type='Modal'][data-name='" + lastOpenedPopUp.name + "'], [jb-type='Slide'][data-name='" + lastOpenedPopUp.name + "']");
                    break;
                case OpenPopUpTypes.Modal:
                    $popUpElement = $("[jb-type='Modal'][data-name^='" + lastOpenedPopUp.name + "'], [jb-type='Slide'][data-name^='" + lastOpenedPopUp.name + "'], [jb-id='" + lastOpenedPopUp.name + "']");
                    break;
            }
            $popUpElement.show();
        };
        PopUpManager.prototype.hideAllPopUps = function () {
            $("[jb-type='Modal']").hide();
            $(".jb-modal-overlay").hide();
            var $slides = $("[jb-type='Slide']");
            for (var i = 0; i < $slides.length; i++) {
                var $current = $slides.eq(i);
                $current.removeClass("popup-visible");
                $current.css("right", "-" + $current.width() + "px");
            }
            this.popUpVisible = false;
            this.showScrollbars();
            this.enableKeyboardEvents();
            this.enableMouseWheelScroll();
        };
        PopUpManager.prototype.destroyPopUp = function (name) {
            var $existing = $("[jb-type='Modal'][data-name='" + name + "']");
            $existing.remove();
            delete this.popUps[name];
        };
        PopUpManager.prototype.error = function (title, message, cb) {
            this.showSimplePopUp(PopupTypes.ERROR, title, message, cb);
        };
        PopUpManager.prototype.success = function (title, message, cb) {
            this.showSimplePopUp(PopupTypes.SUCCESS, title, message, cb);
        };
        PopUpManager.prototype.warning = function (title, message, cb) {
            this.showSimplePopUp(PopupTypes.WARNING, title, message, cb);
        };
        PopUpManager.prototype.info = function (title, message, cb) {
            this.showSimplePopUp(PopupTypes.INFO, title, message, cb);
        };
        PopUpManager.prototype.question = function (title, message, cb) {
            this.popUpVisible = true;
            this.confirmationVisible = true;
            var self = this;
            swal({
                title: title,
                text: message,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: window._resourcesManager.getGlobalResource("RES_SITE_PREFS_OKButtonText"),
                cancelButtonText: window._resourcesManager.getGlobalResource("RES_SITE_PREFS_CancelButtonText"),
                closeOnConfirm: true
            }, function (isConfirm) {
                self.popUpVisible = false;
                self.confirmationVisible = false;
                self.hideLoadingPopUp(0);
                cb && cb(isConfirm);
            });
        };
        PopUpManager.prototype.alert = function (title, message) {
            this.popUpVisible = true;
            var self = this;
            swal({
                title: title,
                text: message,
                type: "warning",
                html: true,
                showCancelButton: false,
                showConfirmButton: false,
                allowEscapeKey: false,
                allowOutsideClick: false
            });
        };
        PopUpManager.prototype.showModalControl = function (modalName, options) {
            var _this = this;
            options = options || {};
            //options.draggable = false;
            this.hideAllPopUps();
            //The overlay cannot exist in a different DOM path with that of the modal popup and reflect the
            //z-index configuration. So a similar div is generated and accordingly removed during the show/hide events
            //of the modal dialog
            //$(".jb-modal-overlay").show();
            var $popUp = $("[jb-type='Modal'][jb-id='" + modalName + "']");
            //$("<div class='jb-modal-overlay modal-control-overlay' style='display: block;' />").insertBefore($popUp);
            $popUp.parent().append($("<div class='jb-modal-overlay modal-control-overlay' style='display: block;' />"));
            var $popUpBody = $popUp.find("[jb-type='ModalBody']");
            var popupHeight = $popUpBody.height();
            var windowHeight = window.innerHeight;
            var popupWidth = $popUp.width();
            var windowWidth = window.innerWidth;
            if (popupHeight > windowHeight) {
                popupHeight = Math.floor(windowHeight * 0.8);
            }
            if (popupWidth > windowWidth) {
                popupWidth = Math.floor(windowWidth * 0.8);
            }
            if (!(options.draggable === false || $popUp.attr("jb-draggable") == "false")) {
                var containmentRight = windowWidth - popupWidth;
                var containmentBottom = windowHeight - popupHeight;
                var containmentMargin = 50;
                $popUp.draggable({
                    handle: "[jb-type='ModalHeader']",
                });
                $popUp.find("[jb-type='ModalHeader']").css({ "cursor": "move" });
            }
            //Let's respect the overflow of the PopUP, if it has already been set outside this scope
            var overflowX = "auto";
            var overflowY = "auto";
            if ($popUp.length > 0 && $popUp[0].style) {
                if ($popUp[0].style["overflowX"] != null && $popUp[0].style["overflowX"].trim() != "") {
                    overflowX = $popUp[0].style["overflowX"];
                }
                if ($popUp[0].style["overflowY"] != null && $popUp[0].style["overflowY"].trim() != "") {
                    overflowY = $popUp[0].style["overflowY"];
                }
            }
            var horizontalOffset = options.draggable === false
                ? (document.documentElement.scrollLeft || document.body.scrollLeft)
                : 0;
            var verticalOffset = options.draggable === false
                ? (document.documentElement.scrollTop || document.body.scrollTop)
                : 0;
            var cssPosition = options.draggable === true
                ? "absolute"
                : "fixed";
            var headerHeight = $popUp.find("[jb-type='ModalHeader']").height();
            var footerHeight = $popUp.find("[jb-type='ModalFooter']").height();
            $popUpBody.css({
                "min-height": popupHeight + "px",
                "overflow-x": overflowX,
                "overflow-y": overflowY,
                "max-height": "calc(100vh - 300px)",
                "max-width": popupWidth + "px",
            });
            $popUp.css({
                left: ((windowWidth / 2) - (popupWidth / 2) + horizontalOffset) + "px",
                top: "100px",
                position: cssPosition,
            });
            if (this.isIE) {
                $popUp.show();
                this.popUpVisible = true;
            }
            else {
                $popUp.fadeIn();
                setTimeout(function () {
                    _this.popUpVisible = true;
                }, 1000);
            }
            $popUp.find("[jb-id='_modalCancelButton']").on("click", function () {
                _this.hideModalControl(modalName, options);
            });
            this.hideScrollbars();
            this.disableKeyboardEvents();
            this.popUpVisible = true;
            this.addToOpenPopUpStack(modalName, OpenPopUpTypes.Modal);
        };
        PopUpManager.prototype.hideModalControl = function (modalName, options) {
            var $popUp = $("[jb-type='Modal'][data-name^='" + modalName + "'].popup-visible, [jb-type='Slide'][data-name^='" + modalName + "'].popup-visible, [jb-id='" + modalName + "']:visible");
            //Remove the generated modal control overlay
            $popUp.siblings(".modal-control-overlay").remove();
            if (modalName == "ControllerActionModal") {
                var jbType = $popUp.attr("jb-type");
                if (jbType == "Modal") { //My god, oh god...
                    jbType = "PopUp"; //My god, oh god...
                }
                this.hidePopUp(modalName + jbType, true);
            }
            $(".jb-modal-overlay").hide();
            if ($popUp.length === 0) {
                console.error("PopUp Manager: uncaught selector case during hideModalControl");
                return;
            }
            if ($popUp.length > 1) {
                console.error("PopUp Manager: selector case during hideModalControl found " + $popUp.length + " PopUps!");
                //Don't return. Do what you can...
            }
            $popUp.removeClass("popup-visible");
            $popUp.hide();
            this.removeFromOpenPopUpStack(modalName, OpenPopUpTypes.Modal);
            this.handleOpenPopUpStack();
            this.popUpVisible = this.openPopUpStack.length > 0;
            if (this.popUpVisible === false) {
                this.showScrollbars();
                this.enableKeyboardEvents();
                this.enableMouseWheelScroll();
            }
            var modalOptions = this.popUps[modalName];
            // Search it as a slide.
            // OMG: This is dirty. We need to refactor the whole class...
            if (modalOptions == null && modalName == "ControllerActionModal") {
                var jbType = $popUp.attr("jb-type");
                if (jbType == "Modal") { //My god, oh god...
                    jbType = "PopUp"; //My god, oh god...
                }
                modalOptions = modalOptions || this.popUps["ControllerActionModal" + jbType];
            }
            if (modalOptions != null) {
                modalOptions.closeCallback && modalOptions.closeCallback();
                if (modalOptions.destroyOnHide) {
                    this.destroyPopUp(modalOptions.name);
                }
            }
        };
        /**
         * Attempts to check whether the input is in an HTML format or not.
         * If not, converts it to HTML. Otherwise, returns its value as is.
         * Example I: "&lt;b&gt;This is bold.&lt;/b&gt;" will be returned as "<b>This is bold</b>" (as it's not HTML)
         * Example II: "<b>This is bold</b>" will be returned as is (as it's an HTML string)
         * Important: Suppressess all exceptions. On exception, returns the input string in its initial form
         * @param message The message to be converted into an HTML format
         */
        PopUpManager.prototype.toHTML = function (message) {
            try {
                var doc = new DOMParser().parseFromString(message, "text/html");
                if (doc && doc.body && doc.body.childNodes && doc.body.childNodes.length != 0) {
                    if ([].slice.call(doc.body.childNodes).some(function (node) { return node.nodeType === 1; }) == false) {
                        message = $("<div />", { html: message }).text();
                    }
                }
            }
            catch (e) {
                //Hush.....
            }
            return message;
        };
        PopUpManager.prototype.showSimplePopUp = function (type, title, message, cb) {
            title = this.toHTML(title);
            message = this.toHTML(message);
            this.popUpVisible = true;
            var self = this;
            swal({
                type: type,
                title: title,
                text: message,
                html: true
            }, function () {
                setTimeout(function () {
                    self.popUpVisible = false;
                    self.hideLoadingPopUp(0);
                    cb && cb();
                    self.resetFocus();
                }, 200);
            });
        };
        PopUpManager.prototype.showConfirmPopUp = function (type, title, message, okCb, cancelCb) {
            console.error("Confirm not implemented yet");
        };
        PopUpManager.prototype.showLoadingPopUp = function (timeoutOverride) {
            var _this = this;
            if (this.isLoading)
                return;
            var timeout = timeoutOverride || 1500;
            var self = this;
            this.showLoadingTimeout = setTimeout(function () {
                if (Joove.Ajax.pendingRequestsWithOverlay() === 0)
                    return;
                if (self.confirmationVisible || self.popUpVisible)
                    return;
                var $spinner = $("#" + _this.spinnerId);
                if ($spinner.length === 0) {
                    $spinner = $('<div id="' + _this.spinnerId + '">\
                                    <div class="spinner">\
                                      <div class="rect1"></div>\
                                      <div class="rect2"></div>\
                                      <div class="rect3"></div>\
                                      <div class="rect4"></div>\
                                      <div class="rect5"></div>\
                                    </div>\
                                  </div>');
                    $spinner.css({
                        position: "fixed",
                        "right": "20px",
                        "bottom": "50px",
                        "z-index": "99999999",
                        "background-color": "rgba(255, 255, 255, 0.89)",
                        "padding": "5px",
                        "border": "1px solid #ccc",
                        "border-radius": "5px"
                    });
                    $spinner.find(".spinner")
                        .css({
                        height: "40px",
                        width: "40px"
                    });
                    $spinner.appendTo("body");
                }
                $spinner.show();
                //swal({
                //    title: _resourcesManager.getLoadingMessage(),
                //    text: '<div class="spinner">\
                //          <div class="rect1"></div>\
                //          <div class="rect2"></div>\
                //          <div class="rect3"></div>\
                //          <div class="rect4"></div>\
                //          <div class="rect5"></div>\
                //        </div>',
                //    html: true,
                //    showConfirmButton: false
                //});
            }, timeout);
        };
        PopUpManager.prototype.hideLoadingPopUp = function (timeoutOverride) {
            var _this = this;
            if (this.isLoading === false)
                return;
            var timeout = timeoutOverride || 1000;
            var self = this;
            this.hideLoadingTimeout = setTimeout(function () {
                if (Joove.Ajax.pendingRequestsWithOverlay() > 0)
                    return;
                if (self.confirmationVisible || self.popUpVisible)
                    return;
                var $spinner = $("#" + _this.spinnerId);
                $spinner.hide();
                //swal.close();
            }, timeout);
        };
        PopUpManager.prototype.showCustomPopUp = function (options) {
            var _this = this;
            this.hideAllPopUps();
            var $existing = $("[jb-type='Modal'][data-name='" + options.name + "'], [jb-type='Slide'][data-name='" + options.name + "']");
            var self = this;
            if ($existing.length > 0) {
                if (options.overlay !== false) {
                    $(".jb-modal-overlay").show();
                }
                if (options.cancelButton === true) {
                    $existing.find(".modal-header .popup-close-button").hide();
                }
                this.resizePopUp(options, $existing, true);
                this.reloadContent(options, $existing, true);
                if (this.isIE) {
                    $existing.show();
                }
                else {
                    $existing.fadeIn();
                }
                this.addToOpenPopUpStack(options.name, OpenPopUpTypes.PopUp);
                return;
            }
            var $popUp = options.mode == "Slide"
                ? $("#JooveBoxControlTemplates > [jb-type='Slide']").clone()
                : $("#JooveBoxControlTemplates > [jb-type='Modal']").clone();
            $popUp.attr("data-name", options.name);
            $popUp.addClass(options.cssClass);
            if (options.overlay !== false || options.mode == "Slide") {
                $(".jb-modal-overlay").show();
            }
            $(window).on("resize", function () {
                //Without this check the pop-up is showing after every resize if it's initialized
                if ($popUp.hasClass("popup-visible")) {
                    _this.resizePopUp(options, $popUp, false);
                    //this.reloadContent(options, $popUp, true);
                }
            });
            if (options.cancelButton === true) {
                $popUp.find(".modal-header .popup-close-button").hide();
            }
            this.resizePopUp(options, $popUp, true);
            this.reloadContent(options, $popUp, false);
            $popUp.find("[jb-id='_modalTitle']").text(options.title);
            $popUp.find("[jb-id='_modalCancelButton']")
                .on("click", function () {
                self.hidePopUp(options.name);
                if (options.destroyOnHide) {
                    self.destroyPopUp(options.name);
                }
            });
            var $btnOk = $popUp.find("[jb-id='_modalOKButton']");
            var $btnCancel = $popUp.find("[jb-id='_modalCancelButton']:not('.popup-close-button')");
            $btnOk.toggle(options.okButton);
            $btnCancel.toggle(options.cancelButton);
            if (options.okButton) {
                $btnOk.html(options.okText || window._resourcesManager.getDefaultOkText());
                $btnOk.on("click", function () {
                    if (options.okCallback != null) {
                        var exitCode = options.okCallback($popUp);
                        if (!exitCode) {
                            $popUp.find("[jb-id='_modalCancelButton']").click();
                        }
                    }
                    else {
                        $popUp.find("[jb-id='_modalCancelButton']").click();
                    }
                });
            }
            if (options.cancelButton) {
                $btnCancel.html(options.cancelText || window._resourcesManager.getDefaultCancelText());
            }
            if (options.onShowCallback != null) {
                options.onShowCallback($popUp);
            }
            if (options.dismissible === true && options.mode != "Slide") {
                var modalHeader = $("[jb-type='ModalHeader']");
                if (modalHeader.length > 0) {
                    var closeLabel = "_CloseLabel";
                    var closeIcon = $("[jb-type='ModalHeader']").find("[jb-id='" + closeLabel + "']");
                    if (closeIcon.length > 0 == false) {
                        closeIcon = $("<i jb-id=\"" + closeLabel + "\" jb-type=\"Iconism\" class=\"glyphicon glyphicon-remove jb-control\" style=\"float: right; cursor: pointer\" ui-role-font-size=\"lg\"></i>");
                        closeIcon.appendTo(modalHeader);
                    } //end if close icon not added
                    closeIcon.on("click", function () {
                        if (options.closeCallback != null) {
                            options.closeCallback($popUp);
                        }
                        self.hidePopUp(options.name);
                        if (options.destroyOnHide) {
                            self.destroyPopUp(options.name);
                        }
                    });
                } //end if header exists
            } //end of dismissible modal
            this.addToOpenPopUpStack(options.name, OpenPopUpTypes.PopUp);
        };
        PopUpManager.prototype.reloadContent = function (options, popup, runOnShowCallback) {
            if (options == null || popup == null)
                return;
            if (options.url != null) {
                var iframe = "<iframe class='jb-modal-iframe' src='" + options.url + "'></iframe";
                if (options.mode == "Slide") {
                    popup.append(iframe);
                }
                else {
                    var modalBody = popup.find("[jb-type='ModalBody']");
                    modalBody.empty();
                    modalBody.append(iframe);
                }
            }
            if (options.$elementContent != null) {
                if (options.mode == "Slide") {
                    options.$elementContent.appendTo(popup);
                }
                else {
                    var modalBody = popup.find("[jb-type='ModalBody']");
                    //NOTE: If we empty the modal body every attached event in its content is disabled
                    //modalBody.empty();
                    options.$elementContent.appendTo(modalBody);
                }
            }
            if (runOnShowCallback === true && options.onShowCallback != null) {
                options.onShowCallback(popup);
            }
        }; //end reloadContent()
        PopUpManager.prototype.resizePopUp = function (options, popup, append) {
            var width = 500;
            var height = 500;
            var units = "px";
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            if (options.startMaximized) {
                options.draggable = false;
                width = 100;
                height = 100;
                units = "%";
            }
            else {
                if (options.width != null && isNaN(options.width) && options.width.indexOf("%") > -1) {
                    width = Math.round(windowWidth * (options.width.replace("%", "") / 100));
                }
                else if (options.width != null && isNaN(options.width) === false) {
                    width = options.width;
                }
                if (options.height != null && isNaN(options.height) && options.height.indexOf("%") > -1) {
                    height = Math.round(windowHeight * (options.height.replace("%", "") / 100));
                }
                else if (options.height != null && isNaN(options.height) === false) {
                    height = options.height;
                }
            }
            // Calculate width in pixels
            if (options.mode == "Slide") {
                popup.css({ "width": width + "px", "right": "-" + width + "px" });
                if (append) {
                    popup.appendTo("body");
                }
            }
            else {
                // No footer. Calculate Footer Height and remove
                if (!options.okButton && !options.cancelButton) {
                    var $footer = popup.find("[jb-type='ModalFooter']");
                    if ($footer.length > 0) {
                        $footer.remove();
                    }
                }
                popup.find("[jb-type='ModalContent']")
                    .css({
                    "width": width + units,
                    "height": height + units
                });
                if (append) {
                    popup.appendTo("body");
                }
                /* IMPORTANT: The draggable option is not exposed as a semantic in the meta-model and it's treated differently
                 *            for modal and popup cases. Popups are draggable only if the draggable option explicitly defined and the modals
                 *            are draggable if this option is undefined or explicitly disabled. This is confusing and should be
                 *            addressed.
                 */
                if (options.draggable) {
                    var scrollLeft = (document.documentElement.scrollLeft || document.body.scrollLeft);
                    var scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
                    var containmentTopLeftX = 50 + scrollLeft;
                    var containmentTopLeftY = 50 + scrollTop;
                    var containmentBottomRightX = windowWidth - width + scrollLeft;
                    var containmentBottomRightY = windowHeight - height + scrollTop;
                    popup.draggable({
                        handle: "[jb-type='ModalHeader']",
                        containment: [
                            containmentTopLeftX,
                            containmentTopLeftY,
                            containmentBottomRightX,
                            containmentBottomRightY
                        ]
                    });
                    popup.find("[jb-type='ModalHeader']").css({ "cursor": "move" });
                }
                if (options.resizable) {
                    // Todo: not working
                    popup.resizable({
                        minHeight: options.minHeight || 250,
                        minWidth: options.minHeight || 250
                    });
                }
            }
            var self = this;
            if (options.mode != "Slide") {
                if (options.startMaximized === true) {
                    popup.css({
                        "left": "0",
                        "right": "0",
                        "top": document.documentElement.scrollTop + "px",
                        "bottom": "0",
                        "margin": "0",
                        "z-index": "999999999",
                        "width": "100vw",
                        "height": "100vh",
                        "position": "absolute"
                    });
                }
                else {
                    popup.css({
                        left: ((windowWidth / 2) - (width / 2) + (options.draggable !== false ? (document.documentElement.scrollLeft || document.body.scrollLeft) : 0)) + "px",
                        top: ((windowHeight / 2) - (height / 2) + (options.draggable !== false ? (document.documentElement.scrollTop || document.body.scrollTop) : 0)) + "px",
                        position: options.draggable !== false ? "absolute" : "fixed"
                    });
                }
                if (this.isIE) {
                    popup.show();
                    popup.addClass("popup-visible");
                    self.popUpVisible = true;
                }
                else {
                    popup.fadeIn(function () {
                        setTimeout(function () {
                            popup.addClass("popup-visible");
                            self.popUpVisible = true;
                        }, 500);
                    });
                }
            }
            else {
                setTimeout(function () {
                    popup.addClass("popup-visible");
                    popup.css("right", "0px");
                    popup.css("top", "0px");
                }, 500);
            }
        };
        PopUpManager.prototype.hideScrollbars = function () {
            // todo: disable scrolling via buttons etc
            $("html").css({ overflow: "hidden" });
        };
        PopUpManager.prototype.showScrollbars = function () {
            // todo: disable scrolling via buttons etc
            $("html").css({ overflow: Joove.Common.detectBrowser() == "IE" ? "visible" : "initial" });
        };
        PopUpManager.prototype.disableMouseWheelScroll = function () {
            jQuery("html")
                .eq(0)
                .on("mousewheel", function (event) {
                return $(event.target).parents().toArray().some(function (p) { return $(p).hasClass("data-list"); });
            });
        };
        PopUpManager.prototype.enableMouseWheelScroll = function () {
            jQuery("html").eq(0).unbind("mousewheel");
        };
        PopUpManager.prototype.disableKeyboardEvents = function () {
            jQuery("html")
                .eq(0)
                .on("keydown", function (e) {
                // We need left and right (37, 39) for textfield filename navigation
                // tab, enter, space, page up, page down, end, home, left, up, right, down
                // NOTE: Removed space(32) and enter(13) because it's applied on the search input of the picklist
                // Leave "TAB" be. No need to block it.
                var keyCodesToBlock = [/*9, 13, 32,*/ 33, 34, 35, 36, 38, 40];
                if (keyCodesToBlock.indexOf(e.keyCode) > -1) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });
        };
        PopUpManager.prototype.enableKeyboardEvents = function () {
            jQuery("html").eq(0).unbind("keydown");
        };
        return PopUpManager;
    }());
    Joove.PopUpManager = PopUpManager;
})(Joove || (Joove = {}));
