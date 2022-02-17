//////////////////////////////////////////////////////////////////////////////////////////////
//  Use this javascript file to add custom functionality to your form.                      //
//  Please read the zAppDev JS Developer Api documentation for more info and code samples.  //
//  Documentation can be found at: http://community.zappdev.com/Content/ApiReference.html   //
//////////////////////////////////////////////////////////////////////////////////////////////

const symbiosisPages = new Set([
    "KnowledgeHub", 
    "MaterialList",
    "MaterialForm", 
    "ProcessList",
    "ProcessForm",
    "PhysicalFormList",
    "PhysicalFormForm",
    "UnitOfMeasurementList",
    "UnitOfMeasurementForm",
    "ProductTypeList",
    "ProductTypeForm",
]);

const materialPages = new Set([
    "MaterialList",
    "MaterialForm", 
    "PhysicalFormList",
    "PhysicalFormForm",
    "UnitOfMeasurementList",
    "UnitOfMeasurementForm",
    "ProductTypeList",
    "ProductTypeForm",
]);


function handleMenu () {
    
    
    $('[jb-type="MenuItem"] a').css({'border-color': 'transparent'})

    if (symbiosisPages.has(window._context.currentController)) 
    {
        // $('[jb-id="Matchmaking"] a').css({'border-color': 'transparent'})
        if (window._context.currentController == "KnowledgeHub") 
        {
            $('[jb-id="MaterialFlow"] a').css({'border-color': 'var(--main-symbiosis-background-color)'});
        }
        
        if (materialPages.has(window._context.currentController)) 
        {
            $('[jb-id="SymbiosisMaterialsMenuItem"] a').css({'border-color': 'var(--main-symbiosis-background-color)'});
        }
        
        if (window._context.currentController == "ProcessList" || window._context.currentController == "ProcessForm")
        {
            $('[jb-id="SymbiosisProcessMenuItem"] a').css({'border-color': 'var(--main-symbiosis-background-color)'});
        }
    } 
    else 
    {
        // console.log("Symbiosis");   
        // $('[jb-id="Symbiosis"] a').css({'border-color': 'transparent'})
        $('[jb-id="' + window._context.currentController + '"] a').css({'border-color': '#f36b1c'});
    }
}

function handleOwl () {
    $elem = $(".owl-carousel");

    $elem.owlCarousel({
        items: $elem.data("col_lg"),
        margin: $elem.data("item_space"),
        loop: $elem.data("loop"),
        autoplay: $elem.data("autoplay"),
        smartSpeed: $elem.data("smartspeed"),
        dots: $elem.data("dots"),
        nav: $elem.data("nav"),
        navText: ["<span class='prev'><i class='fa fa-long-arrow-left'></i></span>", "<span class='next'><i class='fa fa-long-arrow-right'></i></span>"],
        responsive: {
            0: {
                items: $elem.data("col_xs"),
                nav: false,
                dots: false,
            },
            768: {
                items: $elem.data("col_sm"),
                nav: false,
                dots: false,
            },
            992: {
                items: $elem.data("col_md"),
            },
            1200: {
                items: $elem.data("col_lg"),
            }
        }
    });
}

function killFlickering () {
  $("[jb-type='MenuItemsContainer']:not(:has(*))").addClass("empty-submenu");
  var failSafe = 9999;
  var counter = 0;
  while ($(".empty-submenu").length > 0) {
    $(".empty-submenu").parent().remove();
    $("[jb-type='MenuItemsContainer']:not(:has(*))").addClass("empty-submenu");
    counter++;
    if (counter > failSafe) {
      console.error("Too many recursions for hiding Empty Sub Menus...");
      break;
    }
  }
}


$onFormLoaded = function() {
    handleMenu();
    handleOwl ();
    killFlickering ();
}
    
$formExtend = function() {
    console.log("Form extension code executed!");
}