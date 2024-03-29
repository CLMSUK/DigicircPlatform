namespace Joove.Widgets {
    
    export enum MenuVariant {
        NavBar,
        SideNav
    }

    $(document)
        .ready(() => {

            const InitGlobalMenuBar = () => {
                const variant = ($(`.sidenav`).length === 0)
                    ? MenuVariant.NavBar
                    : MenuVariant.SideNav;

                new MenuControl({
                    menuVariant: variant,
                    ratio: window.maxLeftMenuWidthRatio
                }).Init();
            }
            window._backEndInfoAggregator.registerOnCompleteHook(
                () => {
                    InitGlobalMenuBar(); 
                });             
        });

    export class MenuControl {    
        private _menu: {
            left?: JQuery;
            right?: JQuery;
        }

        private _menuItems: {
            left: JQuery;
            right: JQuery;
        }

        private _menuWidth: number;
        private _menuItemWidth: number;    
        private _menuVariant: MenuVariant;    
        private _ratio: number;
        private maxDrawTries = 0;
        private static MAX_DRAW_TRIES = 20;

        constructor(options: { menuVariant?: MenuVariant; ratio?: number}) {
            this._ratio = options.ratio || 0.75;
            this._menuVariant = options.menuVariant || MenuVariant.NavBar;
            this._menu = {};
        }

        Init() {       
            $("[jb-type='MenuControl'].loading").removeClass("loading");         
            this.HideEmptySubMenus();

            this._menu.left = $("[jb-type='MenuControl'] .nav:first");
            this._menu.right = $("[jb-type='MenuControl'] .nav:last");


            if (this._menuVariant === MenuVariant.SideNav) {
                this.InitSideNav();
            } else {
                this.InitNavBar();
            }
            this.RegisterEventHandlers();

            this.SaveMenuItems();
            
            // TODO Remove it
            $('[jb-type="MenuItemIcon"]').addClass("glyphicon");
        }

        private SaveMenuItems() {
            this._menuItems = {
                left: $("> li", this._menu.left).clone(true, true),
                right: $("> li", this._menu.right).clone(true, true)
            }

            this.VisibleMenu(this._menuItems.left);
            this.VisibleMenu(this._menuItems.right);
        }

        private VisibleMenu(menu: JQuery) {
            for (let i = 0; i < menu.length; i++) {
                const item = menu[i];
                $(item).css("visibility", "visible");
                $("li", item).css("visibility", "visible");
            }
        }

        private InitSideNav() {
            //const isOpen = localStorage.getItem("sidenavIsOpen") === "true";
            //if (!isOpen) {
            //    $("#sidenav-toogle").toggleClass("pull");
            //    $("[jb-type='MenuControl'].sidenav").toggleClass("pull");
            //} 

            $(".nav [jb-type='MenuItem']").css("visibility", "visible");
            $(".master-page-footer").css("left", $("[jb-type='MenuControl']").width() + "px");

            $("#sidenav-toogle").on("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                MenuControl.ToogleSidenav();
            });
            
        }

        public static PreInit(counts = 0) {
            if (counts < 20 && $("[jb-type='MenuControl']").length == 0) {
                setTimeout(() => {
                    MenuControl.PreInit((counts || 0) + 1);
                }, 70);
                return;
            }

            const variant = ($(`.sidenav`).length === 0)
                ? MenuVariant.NavBar
                : MenuVariant.SideNav;

            if (variant == MenuVariant.SideNav) {
                const alwaysOpen = $(`.sidenav`).hasClass("always-open");
                if (alwaysOpen == true) {
                    $("#sidenav-toogle").remove();
                }
                
                const isOpen = alwaysOpen ?
                    true :
                    localStorage.getItem("sidenavIsOpen") === "true";

                $("body").addClass("open-sidenav");
                if (!isOpen) {
                    setTimeout(() => {
                        $("#sidenav-toogle").addClass("pull");
                        $("[jb-type='MenuControl'].sidenav").addClass("pull");
                        $(".open-sidenav").addClass("pull");
                    }, 500);
                }
            }
        }

        private InitNavBar() {
            this.MakeMenusResponsive();

            const $rootElement = this._menu.left.closest(".form-root-element");
            const existingMargin = parseInt(this._menu.left.closest("[jb-type='MenuControl']").next().css("margin-top"));
            var moveContents = isNaN(existingMargin) || existingMargin < 5;
            if (moveContents) {
                $rootElement.css("margin-top", "50px");
            }

            setTimeout(() => {
                this.HandleDraw();
                $(".nav [jb-type='MenuItem']").css("visibility", "visible");
                if (!moveContents) {
                    return;
                }
                $rootElement.animate({
                    "margin-top": this._menu.left.closest("[jb-type='MenuControl']").height() + "px"
                }, 50);
            }, 500);
        }

        private CalculateMenuSize() {
            const menuHeaderWidth = $(".navbar-header").width();
            this._menuWidth = $("[jb-type='MenuControl']").width() - menuHeaderWidth;
            this._menuItemWidth = $("[jb-type='MenuControl'] .nav:first li:first").width();
        }

        private static ToogleSidenav(update = true) {
            $("#sidenav-toogle").toggleClass("pull");
            $(".sidenav").toggleClass("pull");

            if (update) {
                const isOpen = localStorage.getItem("sidenavIsOpen") === "true";
                localStorage.setItem("sidenavIsOpen", String(!isOpen));
            }

            //Check if any Datalists are displayed and refresh their size
            $("[jb-id][jb-type='DataList']:visible").each((index, element) => {
                var datatableInstance = Joove.Widgets.DataListControl.instancesDic[$(element).attr("jb-id")];
                if (datatableInstance != undefined) {
                    setTimeout(() => { datatableInstance.updateDataTableSize(); }, 500);
                }
            });
        }
        
        private RegisterEventHandlers() {
            $("[jb-type='MenuControl']").on("click", ".jb-submenu", (event) => {
                event.preventDefault();
                event.stopPropagation();
                var $target = $(event.currentTarget);
                $target.siblings().removeClass("open");
                $target.toggleClass("open");
                this.repositionSubmenu($target.find("[jb-type='MenuItemsContainer']").eq(0), $target);
            });

            const that = this;
            if (this._menuVariant !== MenuVariant.SideNav) {
                $(window)
                .resize(() => {
                    that.HandleDraw();
                });
            } 

            $(".jb-direct-link[jb-type='MenuItem']").on("mousedown", function (e) {
                if (e.which != 2) return;
                $(this).data("openInNewWindow", true)
                $(this).click();
                return false;
            });
        }
        private repositionSubmenu($subMenu: JQuery, $parent: JQuery) {
            if (this._menuVariant == MenuVariant.SideNav || window.outerWidth < 768) return;
            var menuWidth = $subMenu.width();
            var isOffScreenToRight = $subMenu.offset().left + menuWidth > window.innerWidth;
            var isOffScreenToLeft = $subMenu.offset().left <= 0;
            var topPosition = $parent.position().top;
            $subMenu.css("margin-top", topPosition + "px");
            $subMenu.toggleClass("offscreen-left", isOffScreenToLeft);
            $subMenu.toggleClass("offscreen-right", isOffScreenToRight === true || $parent.closest("ul").hasClass("offscreen-right") === true);                                        
        }

        private HandleDraw() {
            this.CalculateMenuSize();

            if ($("[jb-type='MenuControl']").width() < 760) {
                this.ResetMenu(this._menu.left, "left");
            }

            this.Draw();
        }

        private Draw() {
            if (this.maxDrawTries > MenuControl.MAX_DRAW_TRIES) {
                this.maxDrawTries = 0;
                return;
            }

            const leftMenuWidth = this._menuWidth * this._ratio;
            const rightMenuWidth = this._menuWidth * (1 - this._ratio);

            const leftItemsToShow = Math.floor(leftMenuWidth / this._menuItemWidth);

            if (leftItemsToShow > 0) {
                this.HandleOverflowMenuItems(this._menu.left, "Left", leftItemsToShow);
            }

            //this.handleOverflowMenuItems("[jb-type='MenuControl'] .nav:first", "Right");

            let isReDraw = this.RecalculateMenuRatio(false);
            if (isReDraw) { 
                this.maxDrawTries = this.maxDrawTries + 1;
                this.Draw(); 
            }
        }

        private RecalculateMenuRatio(reset: boolean): boolean {
            const menuHeight = $('[jb-type="MenuControl"] .navbar-collapse').height();
            const menuRightHeight = $('[jb-type="MenuControl"] .navbar-right').height();

            if (menuRightHeight == 0) return false;

            if (menuHeight > menuRightHeight) {
                this._ratio = this._ratio - 0.05;
                return true;
            } else {
                if (reset) {
                    this._ratio = window.maxLeftMenuWidthRatio || 0.75;
                }
                return false;
            }
        }

        private GetMenuItemSize(menuQuery: string) {
            return $(`${menuQuery} > li`).length;
        }

        private ResetMenu(menuQuery: JQuery, name: string) {
            const $menu = $(menuQuery);
            $menu.empty();
            $menu.append(this._menuItems[name.toLowerCase()].clone(true, true)); 
            $('[jb-type="MenuItemIcon"]').addClass("glyphicon");
        }

        private HandleOverflowMenuItems(menuQuery: JQuery, name: string, leftItemsToShow: number) {
            const $menu = $(menuQuery);
            const items = $(`> li`, menuQuery);
            
            const lastMenuItem = $(`> li`, menuQuery).last();

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
            } else {
                if ($(`[jb-id='MasterAdministrationResponsive${name}']`).length === 0) {
                    const menuItemTemplate = MenuControl.GetJbOverflowMenuItem(name);
                    $menu.append(menuItemTemplate);

                    if ($(".nav [jb-type='MenuItem']").css("visibility") === "visible") {
                        menuItemTemplate.css("visibility", "visible");
                    }
                }

                const $leftMenuItems = items.slice(leftItemsToShow - 1, items.length).detach();
                $leftMenuItems.appendTo(`#okeyNav${name}`);
            }
        }

        private MarkEmptySubMenus() {
            $("[jb-type='MenuItemsContainer']:not(:has(*))").addClass("empty-submenu");
        }

        private HideEmptySubMenus() {
            this.MarkEmptySubMenus();

            const failSafe = 9999;
            let counter = 0;

            while ($(".empty-submenu").length > 0) {
                $(".empty-submenu").parent().remove();
                this.MarkEmptySubMenus();

                counter++;
                if (counter > failSafe) {
                    console.error("Too many recursions for hiding Empty Sub Menus...");
                    break;
                }

            }
        }

        private GetChildMenu($menuItem) {
            return $menuItem.children("[jb-type='MenuItemsContainer']").eq(0);
        }

        private _responsiveTimeout = null;

        private MakeMenusResponsive() {
            var $menus = $("[jb-type='MenuControl']");

            clearTimeout(this._responsiveTimeout);

            this._responsiveTimeout = setTimeout(() => {
                for (let i = 0; i < $menus.length; i++) {
                    this.AdjustDimensions($menus.eq(i));
                }
            }, 250);
        };

        private AdjustDimensions($menu) {
            const $rootItems = $menu.children("[jb-type='MenuItemsContainer']").eq(0).children("[jb-type='MenuItem']");

            const $targetHamburger = $menu.find("[jb-id='__containerTemplate']").eq(0);
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

            const $menuTop = $menu.position().top;

            $rootItems.show().removeClass("to-hamburger");
            $targetContainer.empty();

            let hamburgerIsNeeded = false;

            const moveToHumburger = $item => {
                var $clone = $item.clone(true);
                $item.hide();
                $targetContainer.append($clone);
            };

            for (let i = 0; i < $rootItems.length; i++) {
                const $current = $rootItems.eq(i);

                if ($current.position().top === $menuTop || $current.hasClass("hamburger") === true) continue;

                if (hamburgerIsNeeded === false && i > 0) {
                    // hamburgerIsNeeded = true;
                    const $prev = $rootItems.eq(i - 1);
                    $prev.addClass("to-hamburger");
                }

                hamburgerIsNeeded = true;

                $current.addClass("to-hamburger");
            }

            $targetHamburger.toggle(hamburgerIsNeeded);

            if (hamburgerIsNeeded === false) return;

            for (let i = 0; i < $rootItems.length; i++) {
                const $current = $rootItems.eq(i);

                if ($current.hasClass("to-hamburger") === false) continue;

                moveToHumburger($current);
            }
        }

        private static GetJbOverflowMenuItem(name: string): JQuery {
            return $(`<li jb-id="MasterAdministrationResponsive${name}" jb-type="MenuItem" class="jb-submenu jb-overflow-menu jb-control">
                     <a jb-type="MenuItemLabelContainer" data-toggle="dropdown" class="dropdown-toggle jb-control" style="min-height: 50px;">
                        <span jb-type="MenuItemLabel" class="jb-control"><span class="glyphicon glyphicon-option-horizontal jb-control"></span></span>
                     </a>
                     <ul jb-type="MenuItemsContainer" class="dropdown-menu jb-control" id="okeyNav${name}">
                     </ul>
                 </li>`);
        }
    }
}
