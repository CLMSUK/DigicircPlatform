$(document).ready(function () {
    $.connection.eventsHub.client.debug = function (sessionID, guid, ticks, timestamp, type, data) {
        if (currentSessionID != sessionID) {
            return;
        }
        
        console.log(type)
        scope_DebugPage.actions.ConsumeDebugMessage(guid, ticks, timestamp, type, data);
    }
    $.connection.hub.start();
    $("body").fadeIn(200);

});

$app.controller('DebugPageController', ['$scope', function ($scope, JSONFormatterConfig) {

    scope_DebugPage = $scope;   
    $scope.DebugEventData = new Array();

    $scope.sortBy = 'Ticks';
    $scope.sortReverse = true;

    $scope.messageSearchText = "";

    $scope.messageTypes = [
        { 'priority': 3, 'id': 'Debug',     'count': 0, 'enabled': true, 'buttonStyle': 'btn btn-sm btn-default', 'label': "  Debug Messages" },
        { 'priority': 0, 'id': 'Error',     'count': 0, 'enabled': true, 'buttonStyle': 'btn btn-sm btn-danger', 'label': "  Errors" },
        { 'priority': 1, 'id': 'Warning',   'count': 0, 'enabled': true, 'buttonStyle': 'btn btn-sm btn-warning', 'label': "  Warnings" },
        { 'priority': 2, 'id': 'Info',      'count': 0, 'enabled': true, 'buttonStyle': 'btn btn-sm btn-info', 'label': "  Info Messages" },
        { 'priority': 4, 'id': 'IDEFTrace', 'count': 0, 'enabled': true, 'buttonStyle': 'btn btn-sm btn-default', 'label': "  IDEF0 Traces" },
    ];

    $scope.SwitchFilter = function (messageType) {
        var filter = $scope.findFilterByID(messageType);
        if (filter != null) {
            filter.enabled = !filter.enabled;
        }
    };


    $scope.findFilterByID = function (id) {
        if (!isNaN(id)) id = CLMS.Framework.Utilities.DebugMessageType[id];
        for (var i = 0; i < $scope.messageTypes.length; i++) {
            if ($scope.messageTypes[i].id == id) {
                return $scope.messageTypes[i];
            }
        }
        return null;
    }

    $scope.sort = function (sortBy) {
        $scope.sortReverse = ($scope.sortBy === sortBy) ? !$scope.sortReverse : false;
        $scope.sortBy = sortBy;
    };

    $scope.clearDebugMessages = function () {
        $scope.DebugEventData.splice(0, $scope.DebugEventData.length);
        for (var i = 0; i < $scope.messageTypes.length; i++) {
            $scope.messageTypes[i].enabled = true;
            $scope.messageTypes[i].count = 0;
        }
        $scope.messageSearchText = "";
    }

    $scope.countTotalDebugMessages = function () {
        var total = 0;
        for (var i = 0; i < $scope.messageTypes.length; i++) {
            total += $scope.messageTypes[i].count;
        }
        return total;
    }

    $scope.ApplyFilter = function (filter) {
        filter.enabled = !filter.enabled;
    }


    $scope.filterBy = function (debugRow) {
        for (var i = 0; i < $scope.messageTypes.length; i++) {
            if (debugRow.Type == $scope.messageTypes[i].id) {
                return $scope.messageTypes[i].enabled;
            }
        }
    };

    $scope.updateSearchValue = function (value) {
        var messageSearchText = value;
    }

    // Controller actions
    $scope.actions = {        
        ConsumeDebugMessage:
        function (guid, ticks, timestamp, type, data) {
            var rowClass = "";
            var icon = "glyphicon glyphicon-console";
            switch (type) {
                case "Warning":
                case "2": 
                    rowClass = "warning";
                    icon = "glyphicon glyphicon-alert warning-icon";
                    $scope.totalWarnings++;
                    break;
                case "Info":
                case "1": 
                    $scope.totalInfos++;
                    icon = "glyphicon glyphicon-info-sign info-icon";
                    rowClass = "info"
                    break;
                case "Error":
                case "3":
                    $scope.totalErrors++;
                    rowClass = "danger";
                    icon = "glyphicon glyphicon-remove-sign error-icon";
                    break;
                case "Debug":
                case "0":
                    $scope.totalDebug++;
                    rowClass = "";
                    icon = "glyphicon glyphicon-console";
                    break;
                case "IDEF0Trace":
                case "4":
                    $scope.totalIDEF0Traces++;
                    rowClass = "";
                    icon = "glyphicon glyphicon-console";
                    break;
                default:
                    rowClass = "";
                    break;
            }

            var filter = $scope.findFilterByID(type);
            if(filter != null){
                filter.count += 1;
            }


            if (!isNaN(type)) {
                type = CLMS.Framework.Utilities.DebugMessageType[type];
            }

            var parsedData = data;
            try {
                parsedData = Joove.Common.modelToJson(data);
            } catch (e) {
                parsedData = data.toString();
            }

            $scope.DebugEventData.push({ "Guid": guid, "Ticks": ticks, "Timestamp": timestamp, "Type": type, "Data": data, "DataObject": parsedData, "rowClass": rowClass, "rowIcon": icon });
            $scope.$digest();
        },

    };  

}]);
