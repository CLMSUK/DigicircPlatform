var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var DebugConsole = /** @class */ (function () {
            function DebugConsole(debugConsoleID, iFrameController, saveStatus) {
                if (saveStatus === void 0) { saveStatus = true; }
                this.consoleDrawn = false;
                var self = this;
                self.debugConsoleID = debugConsoleID;
                self.drawDebugConsole();
                if (self.consoleDrawn == false) {
                    return;
                }
                self.$modal = $(debugConsoleID);
                self.saveStatus = saveStatus;
                self.iFrameController = iFrameController;
                self.initDebugConsole();
            }
            DebugConsole.prototype.drawDebugConsole = function () {
                var self = this;
                if (self.consoleDrawn == true)
                    return;
                try {
                    var $bodyContainer = $('[jb-type="BodyContainer"]');
                    if ($bodyContainer.length == 0) {
                        console.warn("Cannot find the BodyContainer element to which the " + self.debugConsoleID + " would be appended");
                        return;
                    }
                    var $debugConsole = $bodyContainer.find(self.debugConsoleID);
                    if ($debugConsole.length > 0) {
                        self.consoleDrawn = true;
                        return;
                    }
                    var debugConsoleID = self.debugConsoleID.substring(1);
                    var $debugConsoleHTML = "<div id='" + debugConsoleID + "' class='modal-dialog display-none popup-dialog' style='z-index:102'> \t<div class='modal-content'> \t\t<div class='modal-header' style='height:40px; border-bottom: 0px !important;'> \t\t\t<button type='button' class='close modalClose'><span class='glyphicon glyphicon-remove' style='font-size: smaller' aria-hidden='true'></span></button> \t\t\t<button type='button' class='close modalMinimize'><span class='glyphicon glyphicon-minus' style='font-size: smaller' aria-hidden='true'></span></button> \t\t\t<h4 class='modal-title'>Debug Console</h4> \t\t</div> \t\t<div class='modal-body'> \t\t\t<iframe id='DebugWindowIFrame' src='' width='100%' height='250' frameborder='0'></iframe> \t\t</div> \t\t<div class='modal-footer'> \t\t\t<div class='col-lg-12 col-md-12 col-sm-12 resizible-overflow'> \t\t\t\t<div class='col-lg-6 col-md-6 col-sm-6 text-left'> \t\t\t\t\t<span>Page Model</span> \t\t\t\t\t<hr /> \t\t\t\t\t<json-formatter id='modelJsonFormatter' json='getModelForDebugConsole()' open='1'></json-formatter> \t\t\t\t</div> \t\t\t\t<div class='col-lg-6 col-md-6 col-sm-6 text-left'> \t\t\t\t\t<span>Rules Info</span> \t\t\t\t\t<hr /> \t\t\t\t\t<json-formatter  id='modelJsonFormatter' json='getRules()' open='1'></json-formatter> \t\t\t\t</div> \t\t\t</div> \t\t</div> \t</div> </div>";
                    $bodyContainer.append($debugConsoleHTML);
                    setTimeout(function () {
                        // Wait a bit so that you can use the injector
                        angular.element('*[ng-app]').injector().invoke(function ($compile) {
                            var scope = angular.element($bodyContainer).scope();
                            $compile($(self.debugConsoleID))(scope);
                        });
                    }, 100);
                    self.consoleDrawn = true;
                }
                catch (err) {
                    self.consoleDrawn = false;
                    console.warn("The " + self.debugConsoleID + " will not be used, as an error occured during its addition and/or compilation");
                }
            };
            DebugConsole.prototype.initDebugConsole = function () {
                var self = this;
                if (self.consoleDrawn == false) {
                    return;
                }
                self.$modal.find(".modalClose").on("click", function () {
                    $(".modal-dialog").addClass("display-none");
                    if (self.saveStatus === true) {
                        window._debugConsoleManager.saveVisibility(false, false);
                    }
                });
                self.$modal.find(".modalMinimize").on("click", function () {
                    self.minmaxModal(true, null);
                });
                self.$modal.draggable({
                    stop: function (event, ui) {
                        var pos = ui.helper.position();
                        window._debugConsoleManager.savePosition(pos.top, pos.left);
                    }
                });
                var resizeTimeout;
                /* Content Resizing (horizontal) */
                self.$modal.find('.modal-content').resizable({
                    handles: 'e, w',
                    minWidth: 320
                });
                /* Body Resizing (vertical) */
                self.$modal.find('.modal-body').resizable({
                    handles: 's'
                });
                /* Footer Resizing (vertical) */
                self.$modal.find('.modal-footer').resizable({
                    handles: 's'
                });
                if (self.saveStatus === true) {
                    /* Content Caching (horizontal) */
                    self.$modal.find('.modal-content').resize(function () {
                        clearTimeout(resizeTimeout);
                        resizeTimeout = setTimeout(window._debugConsoleManager.saveSize($(this).width(), 0, 0), 800);
                    });
                    /* Body Caching (horizontal) */
                    self.$modal.find('.modal-body').resize(function () {
                        $(this).find("iframe").height("100%");
                        clearTimeout(resizeTimeout);
                        resizeTimeout = setTimeout(window._debugConsoleManager.saveSize(0, $(this).height(), 0), 800);
                    });
                    /* Footer Caching (horizontal) */
                    self.$modal.find('.modal-footer').resize(function () {
                        $(this).find("iframe").height("100%");
                        clearTimeout(resizeTimeout);
                        resizeTimeout = setTimeout(window._debugConsoleManager.saveSize(0, 0, $(this).height()), 800);
                    });
                }
                self.$modal.find("iframe").attr('src', "" + window._context.siteRoot + self.iFrameController);
                self.restoreDebugConsole();
            };
            DebugConsole.prototype.restoreDebugConsole = function () {
                var self = this;
                if (self.consoleDrawn == false) {
                    return;
                }
                if (self.saveStatus != true) {
                    return;
                }
                var consoleStatus = window._debugConsoleManager.debugConsoleStatus;
                if (consoleStatus.visible === true) {
                    self.$modal.find(".modal-body").height(window._debugConsoleManager.debugConsoleStatus.bodyHeight);
                    self.$modal.find(".modal-footer").height(window._debugConsoleManager.debugConsoleStatus.footerHeight);
                    self.$modal.find(".modal-content").width(window._debugConsoleManager.debugConsoleStatus.width);
                    self.$modal.offset({ top: window._debugConsoleManager.debugConsoleStatus.top, left: window._debugConsoleManager.debugConsoleStatus.left });
                    self.minmaxModal(false, consoleStatus.minimized);
                }
            };
            DebugConsole.prototype.minmaxModal = function (calledByButton, doMinimize) {
                if (calledByButton === void 0) { calledByButton = false; }
                if (doMinimize === void 0) { doMinimize = null; }
                var self = this;
                if (self.consoleDrawn == false) {
                    return;
                }
                var mustMinimize = false;
                //See if minimization was explicitly stated
                if (doMinimize != null) {
                    mustMinimize = doMinimize;
                }
                //Else, check whether it was called by a button (this the popup was visible) or by any other UI event
                else if (calledByButton === true) {
                    mustMinimize = self.$modal.find(".modal-header").find(".modalMinimize").find("span").hasClass("glyphicon-minus");
                }
                //Else, wether the setting was saved in the cache
                else if (self.saveStatus == true) {
                    mustMinimize = window._debugConsoleManager.debugConsoleStatus.minimized;
                }
                //If nothing applies, just do the opposite of how the modal is now viewed
                else {
                    mustMinimize = self.$modal.find(".modal-header").find(".modalMinimize").find("span").hasClass("glyphicon-minus");
                }
                if (mustMinimize == true) {
                    var $minmaxButton = self.$modal.find(".glyphicon-minus");
                    $minmaxButton.removeClass('glyphicon-minus');
                    $minmaxButton.addClass('glyphicon-new-window');
                    self.$modal.find(".modal-body").addClass("display-none");
                    self.$modal.find(".modal-footer").addClass("display-none");
                    self.$modal.removeClass("display-none");
                }
                else {
                    var $minmaxButton = self.$modal.find(".glyphicon-new-window");
                    $minmaxButton.removeClass('glyphicon-new-window');
                    $minmaxButton.addClass('glyphicon-minus');
                    self.$modal.find(".modal-body").removeClass("display-none");
                    self.$modal.find(".modal-footer").removeClass("display-none");
                    self.$modal.removeClass("display-none");
                }
                if (self.saveStatus === true) {
                    window._debugConsoleManager.saveVisibility(true, mustMinimize);
                }
            };
            return DebugConsole;
        }()); // end DebugConsole class
        Widgets.DebugConsole = DebugConsole;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {})); // end Joove.Widgets
