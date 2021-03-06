var Joove;
(function (Joove) {
    var Widgets;
    (function (Widgets) {
        var RecorderPanel = /** @class */ (function () {
            function RecorderPanel() {
                var _this = this;
                this.panel = "\n    <div id=\"recorder\">\n    <div class=\"status-heading\">\n        <p>Record your test</p>\n        <span>-</span>\n    </div>\n    <div class=\"status-body\">\n        <ul>\n            <li>\n                <button class=\"btn play\" disabled>Play</button>\n            </li>\n            <li>\n                <button class=\"btn start\">Record</button>\n            </li>\n            <li>\n                <button class=\"btn stop\" disabled>Stop</button>\n            </li>\n            <li>\n                <div class=\"upload\">\n                    <button class=\"btn load\">Load</button>\n                    <input type=\"file\" name=\"recording\" />\n                </div>\n            </li>\n            <li>\n                <button class=\"btn save\" disabled>Save</button>\n            </li>\n        </ul>\n    </div>\n    </div>";
                this.init = function () {
                    $('body').append(_this.panel);
                    _this.cnxt = $("#recorder");
                    $('input[type="file"]', _this.cnxt).change(_this.load);
                    $('input[type="file"]', _this.cnxt).change(function () { this.value = null; }); // Always fires onchange event
                    $('.play', _this.cnxt).click(_this.play);
                    $('.start', _this.cnxt).click(_this.start);
                    $('.stop', _this.cnxt).click(_this.stop);
                    $('.save', _this.cnxt).click(_this.save);
                    _this.cnxt.draggable();
                };
                this.load = function (e) {
                    var reader = new FileReader();
                    var file = e.target.files[0];
                    reader.onload = function (e) {
                        var fromLoad = JSON.parse(reader.result);
                        _this.recording = new Joove.Recording(fromLoad.states);
                        _this.recording.register(_this.nextStep);
                        _this.recording.name = file.name;
                        _this.setMsg("Load: " + _this.recording.name, "0 / " + _this.recording.numSteps());
                        $('.play', _this.cnxt).prop("disabled", false);
                    };
                    reader.readAsText(file);
                };
                this.nextStep = function (stepId) {
                    var nums = _this.recording.numSteps();
                    stepId = Math.ceil(stepId / 2);
                    if (stepId <= nums) {
                        _this.setStatus(stepId + " / " + _this.recording.numSteps());
                    }
                };
                this.play = function () {
                    _this.setMsg("Play: " + _this.recording.name);
                    $('.play', _this.cnxt).addClass("run");
                    _this.cnxt.removeClass("success");
                    _this.cnxt.removeClass("error");
                    _this.recording.play()
                        .then(function () {
                        _this.setMsg("End: " + _this.recording.name);
                        $('.play', _this.cnxt).removeClass("run");
                        _this.cnxt.addClass("success");
                    })
                        .catch(function () {
                        _this.setMsg("Error: " + _this.recording.name);
                        $('.play', _this.cnxt).removeClass("run");
                        _this.cnxt.addClass("error");
                    });
                };
                this.save = function () {
                    window._recorder.download();
                };
                this.start = function () {
                    window._recorder.start();
                    $('.stop', _this.cnxt).prop("disabled", false);
                    $('.start', _this.cnxt).prop("disabled", true);
                    $('.start', _this.cnxt).addClass("run");
                };
                this.stop = function () {
                    window._recorder.stop();
                    $('.start', _this.cnxt).prop("disabled", false);
                    $('.stop', _this.cnxt).prop("disabled", true);
                    $('.save', _this.cnxt).prop("disabled", false);
                    $('.start', _this.cnxt).removeClass("run");
                };
                this.setMsg = function (msg, status) {
                    $('.status-heading p', _this.cnxt).text(msg);
                    _this.setStatus(status);
                };
                this.setStatus = function (status) {
                    if (status != null) {
                        $('.status-heading span', _this.cnxt).text(status);
                    }
                };
                this.init();
            }
            return RecorderPanel;
        }());
        Widgets.RecorderPanel = RecorderPanel;
    })(Widgets = Joove.Widgets || (Joove.Widgets = {}));
})(Joove || (Joove = {}));
