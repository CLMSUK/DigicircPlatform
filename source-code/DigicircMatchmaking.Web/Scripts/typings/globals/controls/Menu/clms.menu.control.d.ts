declare namespace Joove.Widgets {
    enum MenuVariant {
        NavBar = 0,
        SideNav = 1
    }
    class MenuControl {
        private _menu;
        private _menuItems;
        private _menuWidth;
        private _menuItemWidth;
        private _menuVariant;
        private _ratio;
        private maxDrawTries;
        private static MAX_DRAW_TRIES;
        constructor(options: {
            menuVariant?: MenuVariant;
            ratio?: number;
        });
        Init(): void;
        private SaveMenuItems;
        private VisibleMenu;
        private InitSideNav;
        static PreInit(counts?: number): void;
        private InitNavBar;
        private CalculateMenuSize;
        private static ToogleSidenav;
        private RegisterEventHandlers;
        private repositionSubmenu;
        private HandleDraw;
        private Draw;
        private RecalculateMenuRatio;
        private GetMenuItemSize;
        private ResetMenu;
        private HandleOverflowMenuItems;
        private MarkEmptySubMenus;
        private HideEmptySubMenus;
        private GetChildMenu;
        private _responsiveTimeout;
        private MakeMenusResponsive;
        private AdjustDimensions;
        private static GetJbOverflowMenuItem;
    }
}
