namespace Joove.Widgets {
    export class RecorderPanel {
        recording: Recording;
        cnxt: JQuery;
        panel = `
    <div id="recorder">
    <div class="status-heading">
        <p>Record your test</p>
        <span>-</span>
    </div>
    <div class="status-body">
        <ul>
            <li>
                <button class="btn play" disabled>Play</button>
            </li>
            <li>
                <button class="btn start">Record</button>
            </li>
            <li>
                <button class="btn stop" disabled>Stop</button>
            </li>
            <li>
                <div class="upload">
                    <button class="btn load">Load</button>
                    <input type="file" name="recording" />
                </div>
            </li>
            <li>
                <button class="btn save" disabled>Save</button>
            </li>
        </ul>
    </div>
    </div>`;

        constructor() {
            this.init();

        }

        init = () => {
            $('body').append(this.panel);
            this.cnxt = $("#recorder");
            $('input[type="file"]', this.cnxt).change(this.load);
            $('input[type="file"]', this.cnxt).change(function () { this.value = null; }); // Always fires onchange event
            $('.play', this.cnxt).click(this.play);
            $('.start', this.cnxt).click(this.start);
            $('.stop', this.cnxt).click(this.stop);
            $('.save', this.cnxt).click(this.save);

            this.cnxt.draggable();
        }

        load = (e) => {
            const reader = new FileReader();
            const file = e.target.files[0];
            reader.onload = (e) => {
                var fromLoad = JSON.parse(reader.result as any);
                this.recording = new Recording(fromLoad.states);
                this.recording.register(this.nextStep);
                this.recording.name = file.name;
                this.setMsg(`Load: ${this.recording.name}`, `0 / ${this.recording.numSteps()}`);
                $('.play', this.cnxt).prop("disabled", false);
            };
            reader.readAsText(file);
        }

        nextStep = (stepId) => {
            const nums = this.recording.numSteps();
            stepId = Math.ceil(stepId / 2);
            if (stepId <= nums) {
                this.setStatus(`${stepId} / ${this.recording.numSteps()}`);
            }
        };

        play = () => {
            this.setMsg(`Play: ${this.recording.name}`);
            $('.play', this.cnxt).addClass("run");
            this.cnxt.removeClass("success");
            this.cnxt.removeClass("error");
            this.recording.play()
                .then(() => {
                    this.setMsg(`End: ${this.recording.name}`);
                    $('.play', this.cnxt).removeClass("run");
                    this.cnxt.addClass("success");
                })
                .catch(() => {
                    this.setMsg(`Error: ${this.recording.name}`);
                    $('.play', this.cnxt).removeClass("run");
                    this.cnxt.addClass("error");
                });
        }

        save = () => {
            window._recorder.download();
        }

        start = () => {
            window._recorder.start();
            $('.stop', this.cnxt).prop("disabled", false);
            $('.start', this.cnxt).prop("disabled", true);
            $('.start', this.cnxt).addClass("run");
        }

        stop = () => {
            window._recorder.stop();
            $('.start', this.cnxt).prop("disabled", false);
            $('.stop', this.cnxt).prop("disabled", true);
            $('.save', this.cnxt).prop("disabled", false);
            $('.start', this.cnxt).removeClass("run");
        }

        setMsg = (msg: string, status?: string) => {
            $('.status-heading p', this.cnxt).text(msg);
            this.setStatus(status);
        }

        setStatus = (status?: string) => {
            if (status != null) {
                $('.status-heading span', this.cnxt).text(status);
            }
        }
    }
}