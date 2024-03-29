var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var MenuVariant;
        (function (MenuVariant) {
            MenuVariant[MenuVariant["NavBar"] = 0] = "NavBar";
            MenuVariant[MenuVariant["SideNav"] = 1] = "SideNav";
        })(MenuVariant = Widgets.MenuVariant || (Widgets.MenuVariant = {}));
        $(document)
            .ready(function () {
            var InitGlobalMenuBar = function () {
                var variant = ($(".sidenav").length === 0)
                    ? MenuVariant.NavBar
                    : MenuVariant.SideNav;
                new MenuControl({
                    menuVariant: variant,
                    ratio: window.maxLeftMenuWidthRatio
                }).Init();
            };
            window._backEndInfoAggregator.registerOnCompleteHook(function () {
                InitGlobalMenuBar();
            });
        });
        var MenuControl = /** @class */ (function () {
            function MenuControl(options) {
                this.maxDrawTries = 0;
                this._responsiveTimeout = null;
                this._ratio = options.ratio || 0.75;
                this._menuVariant = options.menuVariant || MenuVariant.NavBar;
                this._menu = {};
            }
            MenuControl.prototype.Init = function () {
                $("[jb-type='MenuControl'].loading").removeClass("loading");
                this.HideEmptySubMenus();
                this._menu.left = $("[jb-type='MenuControl'] .nav:first");
                this._menu.right = $("[jb-type='MenuControl'] .nav:last");
                if (this._menuVariant === MenuVariant.SideNav) {
                    this.InitSideNav();
                }
                else {
                    this.InitNavBar();
                }
                this.RegisterEventHandlers();
                this.SaveMenuItems();
                // TODO Remove it
                $('[jb-type="MenuItemIcon"]').addClass("glyphicon");
            };
            MenuControl.prototype.SaveMenuItems = function () {
                this._menuItems = {
                    left: $("> li", this._menu.left).clone(true, true),
                    right: $("> li", this._menu.right).clone(true, true)
                };
                this.VisibleMenu(this._menuItems.left);
                this.VisibleMenu(this._menuItems.right);
            };
            MenuControl.prototype.VisibleMenu = function (menu) {
                for (var i = 0; i < menu.length; i++) {
                    var item = menu[i];
                    $(item).css("visibility", "visible");
                    $("li", item).css("visibility", "visible");
                }
            };
            MenuControl.prototype.InitSideNav = function () {
                //const isOpen = localStorage.getItem("sidenavIsOpen") === "true";
                //if (!isOpen) {
                //    $("#sidenav-toogle").toggleClass("pull");
                //    $("[jb-type='MenuControl'].sidenav").toggleClass("pull");
                //} 
                $(".nav [jb-type='MenuItem']").css("visibility", "visible");
                $(".master-page-footer").css("left", $("[jb-type='MenuControl']").width() + "px");
                $("#sidenav-toogle").on("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    MenuControl.ToogleSidenav();
                });
            };
            MenuControl.PreInit = function (counts) {
                if (counts === void 0) { counts = 0; }
                if (counts < 20 && $("[jb-type='MenuControl']").length == 0) {
                    setTimeout(function () {
                        MenuControl.PreInit((counts || 0) + 1);
                    }, 70);
                    return;
                }
                var variant = ($(".sidenav").length === 0)
                    ? MenuVariant.NavBar
                    : MenuVariant.SideNav;
                if (variant == MenuVariant.SideNav) {
                    var alwaysOpen = $(".sidenav").hasClass("always-open");
                    if (alwaysOpen == true) {
                        $("#sidenav-toogle").remove();
                    }
                    var isOpen = alwaysOpen ?
                        true :
                        localStorage.getItem("sidenavIsOpen") === "true";
                    $("body").addClass("open-sidenav");
                    if (!isOpen) {
                        setTimeout(function () {
                            $("#sidenav-toogle").addClass("pull");
                            $("[jb-type='MenuControl'].sidenav").addClass("pull");
                            $(".open-sidenav").addClass("pull");
                        }, 500);
                    }
                }
            };
            MenuControl.prototype.InitNavBar = function () {
                var _this = this;
                this.MakeMenusResponsive();
                var $rootElement = this._menu.left.closest(".form-root-element");
                var existingMargin = parseInt(this._menu.left.closest("[jb-type='MenuControl']").next().css("margin-top"));
                var moveContents = isNaN(existingMargin) || existingMargin < 5;
                if (moveContents) {
                    $rootElement.css("margin-top", "50px");
                }
                setTimeout(function () {
                    _this.HandleDraw();
                    $(".nav [jb-type='MenuItem']").css("visibility", "visible");
                    if (!moveContents) {
                        return;
                    }
                    $rootElement.animate({
                        "margin-top": _this._menu.left.closest("[jb-type='MenuControl']").height() + "px"
                    }, 50);
                }, 500);
            };
            MenuControl.prototype.CalculateMenuSize = function () {
                var menuHeaderWidth = $(".navbar-header").width();
                this._menuWidth = $("[jb-type='MenuControl']").width() - menuHeaderWidth;
                this._menuItemWidth = $("[jb-type='MenuControl'] .nav:first li:first").width();
            };
            MenuControl.ToogleSidenav = function (update) {
                if (update === void 0) { update = true; }
                $("#sidenav-toogle").toggleClass("pull");
                $(".sidenav").toggleClass("pull");
                if (update) {
                    var isOpen = localStorage.getItem("sidenavIsOpen") === "true";
                    localStorage.setItem("sidenavIsOpen", String(!isOpen));
                }
                //Check if any Datalists are displayed and refresh their size
                $("[jb-id][jb-type='DataList']:visible").each(function (index, element) {
                    var datatableInstance = Joove.Widgets.DataListControl.instancesDic[$(element).attr("jb-id")];
                    if (datatableInstance != undefined) {
                        setTimeout(function () { datatableInstance.updateDataTableSize(); }, 500);
                    }
                });
            };
            MenuControl.prototype.RegisterEventHandlers = function () {
                var _this = this;
                $("[jb-type='MenuControl']").on("click", ".jb-submenu", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var $target = $(event.currentTarget);
                    $target.siblings().removeClass("open");
                    $target.toggleClass("open");
                    _this.repositionSubmenu($target.find("[jb-type='MenuItemsContainer']").eq(0), $target);
                });
                var that = this;
                if (this._menuVariant !== MenuVariant.SideNav) {
                    $(window)
                        .resize(function () {
                        that.HandleDraw();
                    });
                }
                $(".jb-direct-link[jb-type='MenuItem']").on("mousedown", function (e) {
                    if (e.which != 2)
                        return;
                    $(this).data("openInNewWindow", true);
                    $(this).click();
                    return false;
                });
            };
            MenuControl.prototype.repositionSubmenu = function ($subMenu, $parent) {
                if (this._menuVariant == MenuVariant.SideNav || window.outerWidth < 768)
                    return;
                var menuWidth = $subMenu.width();
                var isOffScreenToRight = $subMenu.offset().left + menuWidth > window.innerWidth;
                var isOffScreenToLeft = $subMenu.offset().left <= 0;
                var topPosition = $parent.position().top;
                $subMenu.css("margin-top", topPosition + "px");
                $subMenu.toggleClass("offscreen-left", isOffScreenToLeft);
                $subMenu.toggleClass("offscreen-right", isOffScreenToRight === true || $parent.closest("ul").hasClass("offscreen-right") === true);
            };
            MenuControl.prototype.HandleDraw = function () {
                this.CalculateMenuSize();
                if ($("[jb-type='MenuControl']").width() < 760) {
                    this.ResetMenu(this._menu.left, "left");
                }
                this.Draw();
            };
            MenuControl.prototype.Draw = function () {
                if (this.maxDrawTries > MenuControl.MAX_DRAW_TRIES) {
                    this.maxDrawTries = 0;
                    return;
                }
                var leftMenuWidth = this._menuWidth * this._ratio;
                var rightMenuWidth = this._menuWidth * (1 - this._ratio);
                var leftItemsToShow = Math.floor(leftMenuWidth / this._menuItemWidth);
                if (leftItemsToShow > 0) {
                    this.HandleOverflowMenuItems(this._menu.left, "Left", leftItemsToShow);
                }
                //this.handleOverflowMenuItems("[jb-type='MenuControl'] .nav:first", "Right");
                var isReDraw = this.RecalculateMenuRatio(false);
                if (isReDraw) {
                    this.maxDrawTries = this.maxDrawTries + 1;
                    this.Draw();
                }
            };
            MenuControl.prototype.RecalculateMenuRatio = function (reset) {
                var menuHeight = $('[jb-type="MenuControl"] .navbar-collapse').height();
                var menuRightHeight = $('[jb-type="MenuControl"] .navbar-right').height();
                if (menuRightHeight == 0)
                    return false;
                if (menuHeight > menuRightHeight) {
                    this._ratio = this._ratio - 0.05;
                    return true;
                }
                else {
                    if (reset) {
                        this._ratio = window.maxLeftMenuWidthRatio || 0.75;
                    }
                    return false;
                }
            };
            MenuControl.prototype.GetMenuItemSize = function (menuQuery) {
                return $(menuQuery + " > li").length;
            };
            MenuControl.prototype.ResetMenu = function (menuQuery, name) {
                var $menu = $(menuQuery);
                $menu.empty();
                $menu.append(this._menuItems[name.toLowerCase()].clone(true, true));
                $('[jb-type="MenuItemIcon"]').addClass("glyphicon");
            };
            MenuControl.prototype.HandleOverflowMenuItems = function (menuQuery, name, leftItemsToShow) {
                var $menu = $(menuQuery);
                var items = $("> li", menuQuery);
                var lastMenuItem = $("> li", menuQuery).last();
                if (lastMenuItem.hasClass("jb-overflow-menu")) {
                    leftItemsToShow += 1;
                }
                if (items.length === leftItemsToShow) {
                    return;
                }
                if (items.length < leftItemsToShow) {
                    if (lastMenuItem.hasClass("jb-overflow-menu")) {
                        this.ResetMenu($menu, name);
                        this.HandleOverflowMenuItems(menuQuery, name, leftItemsToShow);
                    }
                }
                else {
                    if ($("[jb-id='MasterAdministrationResponsive" + name + "']").length === 0) {
                        var menuItemTemplate = MenuControl.GetJbOverflowMenuItem(name);
                        $menu.append(menuItemTemplate);
                        if ($(".nav [jb-type='MenuItem']").css("visibility") === "visible") {
                            menuItemTemplate.css("visibility", "visible");
                        }
                    }
                    var $leftMenuItems = items.slice(leftItemsToShow - 1, items.length).detach();
                    $leftMenuItems.appendTo("#okeyNav" + name);
                }
            };
            MenuControl.prototype.MarkEmptySubMenus = function () {
                $("[jb-type='MenuItemsContainer']:not(:has(*))").addClass("empty-submenu");
            };
            MenuControl.prototype.HideEmptySubMenus = function () {
                this.MarkEmptySubMenus();
                var failSafe = 9999;
                var counter = 0;
                while ($(".empty-submenu").length > 0) {
                    $(".empty-submenu").parent().remove();
                    this.MarkEmptySubMenus();
                    counter++;
                    if (counter > failSafe) {
                        console.error("Too many recursions for hiding Empty Sub Menus...");
                        break;
                    }
                }
            };
            MenuControl.prototype.GetChildMenu = function ($menuItem) {
                return $menuItem.children("[jb-type='MenuItemsContainer']").eq(0);
            };
            MenuControl.prototype.MakeMenusResponsive = function () {
                var _this = this;
                var $menus = $("[jb-type='MenuControl']");
                clearTimeout(this._responsiveTimeout);
                this._responsiveTimeout = setTimeout(function () {
                    for (var i = 0; i < $menus.length; i++) {
                        _this.AdjustDimensions($menus.eq(i));
                    }
                }, 250);
            };
            ;
            MenuControl.prototype.AdjustDimensions = function ($menu) {
                var $rootItems = $menu.children("[jb-type='MenuItemsContainer']").eq(0).children("[jb-type='MenuItem']");
                var $targetHamburger = $menu.find("[jb-id='__containerTemplate']").eq(0);
                var $targetContainer = $targetHamburger.children("[jb-type='MenuItemsContainer']").eq(0);
                if ($targetContainer.hasClass("hamburger") === false) {
                    $targetHamburger.find(".jb-no-icon")
                        .eq(0)
                        .removeClass("glyphicon-folder-open")
                        .addClass("glyphicon-menu-hamburger")
                        .css({
                        "margin-bottom": "3px",
                        "top": "5px"
                    });
                    $targetHamburger.find("[jb-type='MenuItemArrow']").remove();
                    $targetHamburger.addClass("hamburger");
                }
                var $menuTop = $menu.position().top;
                $rootItems.show().removeClass("to-hamburger");
                $targetContainer.empty();
                var hamburgerIsNeeded = false;
                var moveToHumburger = function ($item) {
                    var $clone = $item.clone(true);
                    $item.hide();
                    $targetContainer.append($clone);
                };
                for (var i = 0; i < $rootItems.length; i++) {
                    var $current = $rootItems.eq(i);
                    if ($current.position().top === $menuTop || $current.hasClass("hamburger") === true)
                        continue;
                    if (hamburgerIsNeeded === false && i > 0) {
                        // hamburgerIsNeeded = true;
                        var $prev = $rootItems.eq(i - 1);
                        $prev.addClass("to-hamburger");
                    }
                    hamburgerIsNeeded = true;
                    $current.addClass("to-hamburger");
                }
                $targetHamburger.toggle(hamburgerIsNeeded);
                if (hamburgerIsNeeded === false)
                    return;
                for (var i = 0; i < $rootItems.length; i++) {
                    var $current = $rootItems.eq(i);
                    if ($current.hasClass("to-hamburger") === false)
                        continue;
                    moveToHumburger($current);
                }
            };
            MenuControl.GetJbOverflowMenuItem = function (name) {
                return $("<li jb-id=\"MasterAdministrationResponsive" + name + "\" jb-type=\"MenuItem\" class=\"jb-submenu jb-overflow-menu jb-control\">\n                     <a jb-type=\"MenuItemLabelContainer\" data-toggle=\"dropdown\" class=\"dropdown-toggle jb-control\" style=\"min-height: 50px;\">\n                        <span jb-type=\"MenuItemLabel\" class=\"jb-control\"><span class=\"glyphicon glyphicon-option-horizontal jb-control\"></span></span>\n                     </a>\n                     <ul jb-type=\"MenuItemsContainer\" class=\"dropdown-menu jb-control\" id=\"okeyNav" + name + "\">\n                     </ul>\n                 </li>");
            };
            MenuControl.MAX_DRAW_TRIES = 20;
            return MenuControl;
        }());
        Widgets.MenuControl = MenuControl;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
