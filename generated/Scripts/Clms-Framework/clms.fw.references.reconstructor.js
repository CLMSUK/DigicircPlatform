var Joove;
(function (Joove) {
    var ReferencesReconstructor = /** @class */ (function () {
        function ReferencesReconstructor(freshInstances) {
            if (freshInstances === void 0) { freshInstances = []; }
            this._debug = Joove.Common.isInDebugMode() === true; // debug mode
            this._uniqueTypeClassInstances = {}; // unique object instances for each TypeClass Instance
            this._freshInstances = []; // unique object TypeClass instances we consider as freshly updated, propably from backend.
            this._seen = [];
            this.discriminatorProp = "___";
            this.addFreshArrayOfInstances(freshInstances);
        }
        // Checks if an object is an AppDev TypeClass.
        // It works by checking the existance of characteristic TypeClass properties 
        // _clientKey, _key, _originalTypeClassName, _typeHash
        ReferencesReconstructor.prototype.isInstanceOfTypeClass = function (object) {
            if (object == null)
                return false;
            var interestingProperties = ["_clientKey", "_key", "_originalTypeClassName", "_typeHash"];
            for (var i in interestingProperties) {
                if (interestingProperties.hasOwnProperty(i) === false)
                    continue;
                if (typeof (object[interestingProperties[i]]) != "undefined")
                    return true;
            }
            return false;
        };
        // Merges two objects and returns target object.
        // Properties that exist in source, but do not exist in target, are copied to target object.
        // Properties that exist in both source and target are NOT ALTERED.
        // Arrays are merged so that target array contains all unique values of both source and target
        ReferencesReconstructor.prototype.mergeObject = function (source, target) {
            var _this = this;
            var _seen = [];
            var merge = function (sourceInternal, targetInternal) {
                if (sourceInternal == null || Joove.Common.valueIsPrimitive(sourceInternal) || _seen.indexOf(sourceInternal) > -1)
                    return;
                _seen.push(sourceInternal);
                if (targetInternal == null) {
                    targetInternal = {};
                }
                var properties = Object.keys(sourceInternal);
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    if (Joove.Common.isArray(sourceInternal[property])) {
                        targetInternal[property] = _this.mergeArray(sourceInternal[property], targetInternal[property]);
                    }
                    else if (targetInternal.hasOwnProperty(property) === false) {
                        targetInternal[property] = sourceInternal[property];
                    }
                }
            };
            merge(source, target);
            return target;
        };
        // Merges two arrays.
        // Returns an array containing all unique values of both arrays
        ReferencesReconstructor.prototype.mergeArray = function (source, target) {
            if (source == null)
                return target;
            if (target == null)
                return source;
            var arrayUnique = function (array) {
                var a = array.concat();
                for (var i = 0; i < a.length; ++i) {
                    for (var j = i + 1; j < a.length; ++j) {
                        if (Joove.Common.classInstancesAreNotSame(a[i], a[j]))
                            continue;
                        a.splice(j--, 1);
                    }
                }
                return a;
            };
            return arrayUnique((target || []).concat(source));
        };
        // Returns an instance from the Unique Instances Collection that corresponds to the obj parameter.
        // Matching is performed using Common.classInstancesAreSame method (type and keys matching)
        ReferencesReconstructor.prototype.getCorrespondingUniqueInstance = function (obj) {
            if (obj == null || Joove.Common.valueIsPrimitive(obj) === true)
                return null;
            var classKey = Joove.Common.getClassInstanceKey(obj);
            return classKey == null ? null : this._uniqueTypeClassInstances[classKey];
        };
        // Merges an object with its corresponding Unique Instance and returns the merged unique instance.
        // If no corresponding Unique Instance is found, object is updated using its corresponding
        // Fresh Instance (if any) and then added to the Unique Instances Collection
        ReferencesReconstructor.prototype.mergeWithUniqueInstance = function (obj) {
            var uniqueInstance = this.getCorrespondingUniqueInstance(obj);
            if (uniqueInstance == null) {
                var freshInstance = this.getCorrespondingFreshInstance(obj);
                if (freshInstance != null) {
                    this.updateInstance(obj, freshInstance);
                    if (this._debug === true) {
                        console.log("Merged object with corresponding Fresh instance. Result:", obj);
                    }
                }
                var classkey = Joove.Common.getClassInstanceKey(obj);
                if (classkey != null) {
                    this._uniqueTypeClassInstances[classkey] = obj;
                }
                if (this._debug === true) {
                    console.log("Added Unique Instance:", obj);
                }
                return obj;
            }
            this.mergeObject(obj, uniqueInstance);
            return uniqueInstance;
        };
        // Adds a Fresh Instance. If a corresponding Fresh Instance already exists, it is overwritten.
        // All child properties are visited and added to the Fresh Instances Collection if needed
        // using a recursive call to this method. Arrays are handled here too.
        ReferencesReconstructor.prototype.addFreshInstance = function (object, refs) {
            var _this = this;
            var seen = refs == null ? [] : refs;
            return (function (currentObject) {
                if (currentObject == null)
                    return;
                // Object has already been seen, switch value with a reference
                if (Object.prototype.toString.apply(currentObject) !== "[object Array]") {
                    for (var index = 0; index < seen.length; index++) {
                        if (Joove.Common.objectsAreEqual(seen[index], currentObject, true)) {
                            return;
                        }
                    }
                }
                seen.push(currentObject);
                if (_this.isInstanceOfTypeClass(currentObject) === false)
                    return;
                var alreadyExists = false;
                for (var i = 0; i < _this._freshInstances.length; i++) {
                    if (Joove.Common.classInstancesAreNotSame(currentObject, _this._freshInstances[i]) === true)
                        continue;
                    _this._freshInstances[i] = currentObject; // overwrite existing                
                    alreadyExists = true;
                }
                if (alreadyExists === false) {
                    _this._freshInstances.push(currentObject);
                    if (_this._debug === true) {
                        console.log("Added new Fresh instance:", currentObject);
                    }
                }
                for (var property in currentObject) {
                    if (currentObject.hasOwnProperty(property) === false)
                        continue;
                    var prop = currentObject[property];
                    if (Joove.Common.isArray(prop) === true) {
                        for (var j = 0; j < prop.length; j++) {
                            _this.addFreshInstance(prop[j], seen);
                        }
                    }
                    else {
                        if (_this.isInstanceOfTypeClass(prop) === false)
                            continue;
                        _this.addFreshInstance(prop, seen);
                    }
                }
            })(object);
        };
        // Adds an array of Fresh Instances, using the addFreshInstance method.
        ReferencesReconstructor.prototype.addFreshArrayOfInstances = function (objects) {
            if (objects == null)
                return;
            for (var i = 0; i < objects.length; i++) {
                this.addFreshInstance(objects[i]);
            }
        };
        // Returns an instance from the Fresh Instances Collection that corresponds to the obj parameter.
        // Matching is performed using Common.classInstancesAreSame method (type and keys matching)
        ReferencesReconstructor.prototype.getCorrespondingFreshInstance = function (obj) {
            if (obj == null || Joove.Common.valueIsPrimitive(obj))
                return null;
            for (var i = 0; i < this._freshInstances.length; i++) {
                var current = this._freshInstances[i];
                if (Joove.Common.classInstancesAreSame(current, obj))
                    return current;
            }
            return null;
        };
        // Updates an object (target) based on another (source) and returns target object.
        // Properties that exist in source, but do not exist in target, are copied to target object.
        // Properties that exist in both in target and source are OVERWRITTEN in target using source values
        // Arrays are handled as other properties
        ReferencesReconstructor.prototype.updateInstance = function (target, source) {
            if (target == null || source == null)
                return target;
            if (this.isInstanceOfTypeClass(target) === false || this.isInstanceOfTypeClass(source) === false)
                return;
            for (var property in source) {
                if (source.hasOwnProperty(property) === false)
                    continue;
                target[property] = source[property];
            }
            return target;
        };
        ReferencesReconstructor.prototype.reconstructReferences = function (object) {
            this.reconstructReferencesPrive(object);
            for (var i in this._seen) {
                delete this._seen[i][this.discriminatorProp];
                delete this._seen[i]["$id"];
            }
            return object;
        };
        /**
         * Traverses the instance of an Object, top to bottom (through all its child objects, arrays, the objects within arrays, each property etc.) and reconstructs the
         * references so that: any Object or Property that is present more than once within the ROOT object, is pointing to one and only one instance of the same class.
         * The reconstructed Object is then returned.
         * @param object The Object or Property that is to be checked for references (i.e. user: UserViewModel)
         * @param parent The Parent of the investigated Property (i.e. "user" for property user.userName)
         * @param propName The Name of the investigated Property (i.e. "userName" for property user.UserName)
         */
        ReferencesReconstructor.prototype.reconstructReferencesPrive = function (object, parent, propName) {
            if (object == null || object[this.discriminatorProp] == true)
                return object; // null or already seen...
            if (Joove.Common.valueIsPrimitive(object) === true)
                return object; // primitive. Nothing to do
            this._seen.push(object);
            object[this.discriminatorProp] = true;
            // initialization debug
            if (this._debug === true && parent == null && propName == null) {
                console.log("Reconstructing references in root object:", object);
                console.log("Fresh Instances collection:", this._freshInstances);
            }
            //Array
            if (Joove.Common.isArray(object)) {
                for (var i = 0; i < object.length; i++) {
                    this.reconstructReferencesPrive(object[i], object, i); // recursive call for each array entry
                }
            }
            // Object
            else {
                // children objects debug
                if (this._debug === true && parent != null && propName != null) {
                    console.log("Reconstructing references in child object '" + propName + "'");
                    console.log("Parent is:", parent);
                    console.log("Child object is:", object);
                }
                // Handle TypeClass instances
                if (this.isInstanceOfTypeClass(object) === true) {
                    var mergedUniqueInstance = this.mergeWithUniqueInstance(object); // merge with unique instance
                    // point to the unique instance
                    if (parent != null && propName != null && parent.hasOwnProperty(propName) === true) {
                        parent[propName] = mergedUniqueInstance;
                        if (this._debug === true) {
                            console.log("Pointed to unique merged instance:", mergedUniqueInstance);
                        }
                    }
                }
                // recursive call for each property
                for (var property in object) {
                    if (object.hasOwnProperty(property) === false)
                        continue;
                    this.reconstructReferencesPrive(object[property], object, property);
                }
            }
            return object;
        };
        return ReferencesReconstructor;
    }()); /* end class ReferencesReconstructor*/
    Joove.ReferencesReconstructor = ReferencesReconstructor;
})(Joove || (Joove = {})); /* end Joove namespace */
