﻿/* Script: 'I see cycles'. Watch tutorial below */
/* https://www.youtube.com/watch?v=Jx4ZbxE7nH0   */

namespace Joove {
    export class Cycles {
        static referencesMap = {};
        

        static nextUniqueId = (() => {
            var currentId = 1;
            return () => (currentId++);
        })();

        static reconstructObject(object: any): any {
            Cycles.mapObjectReferences(object);
            Cycles.restoreObjectReferences(object);

            return object;
        }

        static mapObjectReferences(object: any): any {
            "use strict";

            return (function terez(value) {
                // Not an object
                if (Common.valueIsObject(value) === false) return value;

                // Array, loop through its values
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    for (let i = 0; i < value.length; i += 1) {
                        terez(value[i]);
                    }
                }
                // Object
                else {
                    if (typeof (value["$id"]) != "undefined") {
                        Cycles.referencesMap[value["$id"]] = value;
                        delete value.$id;
                    }

                    for (let name in value) {
                        if (Object.prototype.hasOwnProperty.call(value, name)) {
                            terez(value[name]);
                        }
                    }
                }

                return value;

            }(object));
        }

        static checkForDuplicateIds(object: any): any {
            "use strict";

            var ids = [];

            return (function terez(value) {
                // Not an object
                if (Common.valueIsObject(value) === false) return value;

                // Array, loop through its values
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    for (let i = 0; i < value.length; i += 1) {
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

                    for (let name in value) {
                        if (Object.prototype.hasOwnProperty.call(value, name)) {
                            terez(value[name]);
                        }
                    }
                }

                return value;

            } (object));
        }

        static restoreObjectReferences(object: any): any {
            "use strict";

            return (function terez(value) {
                // Not an object
                if (Common.valueIsObject(value) === false) return value;

                // Array, loop through its values
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    for (let i = 0; i < value.length; i += 1) {
                        value[i] = terez(value[i]);
                    }
                }
                // Object
                else {
                    if (typeof (value["$ref"]) != "undefined") {
                        return Cycles.referencesMap[value["$ref"]];
                    }

                    for (let name in value) {
                        if (Object.prototype.hasOwnProperty.call(value, name)) {
                            value[name] = terez(value[name]);
                        }
                    }
                }

                return value;

            }(object));
        }
    
        static decycleObject(object: any, refs?: any): any {
            "use strict";
            
            var objects = refs == null ? [] : refs;
        
            return (function terez(value) {
                // Not an object
                if (Common.valueIsObject(value) === false) return value;

                // Object has already been seen, switch value with a reference
                if (Object.prototype.toString.apply(value) !== "[object Array]") {                    
                    for (let jj = 0; jj < objects.length; jj++) {
                        if (Common.objectsAreEqual(objects[jj], value, true)) {                            
                           return { $ref: objects[jj].$id };
                        }
                    }                    
                }

                // Array, loop through its values
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    var newArr = [];
                    for (let i = 0; i < value.length; i++) {
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

                    for (let propName in value) {
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
        }
    }
}