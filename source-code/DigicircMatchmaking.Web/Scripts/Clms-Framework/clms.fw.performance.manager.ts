﻿namespace Joove {


    class PerformanceManagerWatch {
        private _startTime: number;
        private _endTime: number; 
        private _running: boolean;

        constructor(startImmediately: boolean = false) {
            this.clear();
            this._running = false;

            if (startImmediately) {
                this.start();
            }
        }

        public clear() {
            this._startTime = 0;
            this._endTime = 0;
        }

        public start() {
            this.clear();
            this._running = true;

            this._startTime = performance.now();
        }

        public stop() {
            this._endTime = performance.now();

            this._running = false;
        }

        public getMilliseconds(): number {
            if (this._running) {
                this.stop();
            }

            return this._endTime - this._startTime;
        }
    }//end PerformanceManagerWatch class

    class PerformanceMetricsIdentifier {
        public controller: string;
        public action: string;
        public information: string;

        constructor(controller: string, action: string = null, information: string = null) {
            this.controller = controller;
            this.action = action;
            this.information = information;
        }

        public asString(): string {
            let result = this.controller;
            if (this.action) result = result + ";" + this.action;
            if (this.information) result = result + ";" + this.information;

            return result;
        }
    }


    class FrontEndStatisticsDTO {
        public FrontEndMetricsDTOList: Array<FrontEndMetricsDTO> ;
    }

    class FrontEndMetricsDTO {
        public ID: string;
        public ElapsedMilliseconds: number;

        constructor(id: string, elapsedMilliseconds: number) {
            this.ID = id;
            this.ElapsedMilliseconds = elapsedMilliseconds;
        }
    }

    export class PerformanceManager {
        
        private _enabled: boolean;
        private _watches: { [id: string]: PerformanceManagerWatch }; 

        constructor(enabled: boolean) {
            this._enabled = enabled;
            this._watches = {};
        }

        public start(controller: string, action: string = null, information: string = null) {
            if (this._enabled === false) { return; }
            this._watches[new PerformanceMetricsIdentifier(controller, action, information).asString()] = new PerformanceManagerWatch(true);
        }

        public stop(controller: string, action: string = null, information: string = null) {
            if (this._enabled === false) { return; }
            this._watches[new PerformanceMetricsIdentifier(controller, action, information).asString()].stop();
        }


        public waitAndSend(milliseconds: number = 1000) {
            setTimeout(() => {
                this.send();
            }, milliseconds);
        }

        public send() {
            if (this._watches == {}) { return; }

            let result: Array<FrontEndMetricsDTO> = new Array<FrontEndMetricsDTO>();

            for (let key in this._watches) {
                result.add(new FrontEndMetricsDTO(key, this._watches[key].getMilliseconds()));
            }

            if (result.length > 0) {

                let postData = new FrontEndStatisticsDTO();
                postData.FrontEndMetricsDTOList = result;

                Ajax.ajax({
                    url: `${window._context.siteRoot}${window._context.currentController}/_LogFrontEndPerformanceMeasurements`,
                    method:"POST",
                    data: postData,
                    success: data => {
                        if (data.result == false) {
                            console.log(`Error logging the Front End Performance Measurements. Exception Message: ${data.exception}`);
                        }
                    },
                    error: data => {
                        console.error("Error while sending the Front End Performance Measurements back to the Server:", data);
                    }
                });
            }


            this._watches = {}; 
        }

        
    }//end PerformanceManager()

} //end namespace
