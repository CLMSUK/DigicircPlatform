//////////////////////////////////////////////////////////////////////////////////////////////
//  Use this javascript file to add custom functionality to your form.                      //
//  Please read the zAppDev JS Developer Api documentation for more info and code samples.  //
//  Documentation can be found at: http://community.zappdev.com/Content/ApiReference.html   //
//////////////////////////////////////////////////////////////////////////////////////////////

$onFormLoaded = function() {
    console.log("Form Loaded! Model object:", $form.model);
    window.DisableMenuResponsive = true;
}
    
$formExtend = function() {
    console.log("Form extension code executed!");
}