
function NemoAceCustomControl (rootElement, properties, context) {
    this.init = function() {
        if ($(rootElement).height() <= 0) {
            $(rootElement).css("min-height", "200");
        }
        context.editor = ace.edit(rootElement);
        context.editor = ace.edit(rootElement);
        context.editor.setTheme("ace/theme/" + properties.Theme);
        context.editor.getSession().setMode("ace/mode/" + properties.Language);

        context.editor.setValue(properties.Value || "");

        context.editor.getSession().on('change', function(e) {
            context.ValueChanged(context.editor.getValue());
        });
    };

    this.ValueChanged = function(newValue) {
        if (newValue == context.editor.getValue()) {
            return;
        }
        context.editor.setValue(newValue);
    };



}
