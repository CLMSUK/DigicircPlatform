/* Script: 'I see cycles'. Watch tutorial below */
/* https://www.youtube.com/watch?v=Jx4ZbxE7nH0   */
var Joove;
(function (Joove) {
    var Cycles = /** @class */ (function () {
        function Cycles() {
        }
        Cycles.reconstructObject = function (object) {
            Cycles.mapObjectReferences(object);
            Cycles.restoreObjectReferences(object);
            return object;
        };
        Cycles.mapObjectReferences = function (object) {
            "use strict";
            return (function terez(value) {
                // Not an object
                if (Joove.Common.valueIsObject(value) === false)
                    return value;
                // Array, loop through its values
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    for (var i = 0; i < value.length; i += 1) {
                        terez(value[i]);
                    }
                }
                // Object
                else {
                    if (typeof (value["$id"]) != "undefined") {
                        Cycles.referencesMap[value["$id"]] = value;
                        delete value.$id;
                    }
                    for (var name_1 in value) {
                        if (Object.prototype.hasOwnProperty.call(value, name_1)) {
                            terez(value[name_1]);
                        }
                    }
                }
                return value;
            }(object));
        };
        Cycles.checkForDuplicateIds = function (object) {
            "use strict";
            var ids = [];
            return (function terez(value) {
                // Not an object
                if (Joove.Common.valueIsObject(value) === false)
                    return value;
                // Array, loop through its values
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    for (var i = 0; i < value.length; i += 1) {
                        terez(value[i]);
                    }
                }
                // Object
                else {
                    if (typeof (value["$id"]) != "undefined") {
                        if (ids.indexOf(value["$id"]) > -1) {
                            console.log("Duplicate $id: " + value["$id"]);
                            throw "$id already encountered!";
                        }
                        else {
                            ids.push(value["$id"]);
                        }
                    }
                    for (var name_2 in value) {
                        if (Object.prototype.hasOwnProperty.call(value, name_2)) {
                            terez(value[name_2]);
                        }
                    }
                }
                return value;
            }(object));
        };
        Cycles.restoreObjectReferences = function (object) {
            "use strict";
            return (function terez(value) {
                // Not an object
                if (Joove.Common.valueIsObject(value) === false)
                    return value;
                // Array, loop through its values
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    for (var i = 0; i < value.length; i += 1) {
                        value[i] = terez(value[i]);
                    }
                }
                // Object
                else {
                    if (typeof (value["$ref"]) != "undefined") {
                        return Cycles.referencesMap[value["$ref"]];
                    }
                    for (var name_3 in value) {
                        if (Object.prototype.hasOwnProperty.call(value, name_3)) {
                            value[name_3] = terez(value[name_3]);
                        }
                    }
                }
                return value;
            }(object));
        };
        Cycles.decycleObject = function (object, refs) {
            "use strict";
            var objects = refs == null ? [] : refs;
            return (function terez(value) {
                // Not an object
                if (Joove.Common.valueIsObject(value) === false)
                    return value;
                // Object has already been seen, switch value with a reference
                if (Object.prototype.toString.apply(value) !== "[object Array]") {
                    for (var jj = 0; jj < objects.length; jj++) {
                        if (Joove.Common.objectsAreEqual(objects[jj], value, true)) {
                            return { $ref: objects[jj].$id };
                        }
                    }
                }
                // Array, loop through its values
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    var newArr = [];
                    for (var i = 0; i < value.length; i++) {
                        newArr[i] = terez(value[i]);
                    }
                    return newArr;
                }
                // Object
                else {
                    if (typeof (value.$ref) == "undefined" && typeof (value.$id) == "undefined") {
                        value.$id = Cycles.nextUniqueId().toString();
                    }
                    objects.push(value);
                    for (var propName in value) {
                        if (value.hasOwnProperty(propName)) {
                            if (propName.indexOf("$$hashKey") === 0) {
                                delete value[propName];
                                continue;
                            }
                            if (Object.prototype.hasOwnProperty.call(value, propName)) {
                                value[propName] = terez(value[propName]);
                            }
                        }
                    }
                }
                return value;
            }(object));
        };
        Cycles.referencesMap = {};
        Cycles.nextUniqueId = (function () {
            var currentId = 1;
            return function () { return (currentId++); };
        })();
        return Cycles;
    }());
    Joove.Cycles = Cycles;
})(Joove || (Joove = {}));
