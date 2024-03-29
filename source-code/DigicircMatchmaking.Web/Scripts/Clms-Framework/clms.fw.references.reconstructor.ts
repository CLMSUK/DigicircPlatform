﻿namespace Joove {
    export class ReferencesReconstructor {
        private _debug = Common.isInDebugMode() === true; // debug mode
        private _uniqueTypeClassInstances: { [key: string]: any } = {}; // unique object instances for each TypeClass Instance
        private _freshInstances = []; // unique object TypeClass instances we consider as freshly updated, propably from backend.

        constructor(freshInstances: any[] = []) {
            this.addFreshArrayOfInstances(freshInstances);
        }
        
        // Checks if an object is an AppDev TypeClass.
        // It works by checking the existance of characteristic TypeClass properties 
        // _clientKey, _key, _originalTypeClassName, _typeHash
        private isInstanceOfTypeClass(object: any): boolean {
            if (object == null) return false;

            const interestingProperties = ["_clientKey", "_key", "_originalTypeClassName", "_typeHash"];

            for (let i in interestingProperties) {
                if (interestingProperties.hasOwnProperty(i) === false) continue;

                if (typeof (object[interestingProperties[i]]) != "undefined") return true;
            }

            return false;
        }

        // Merges two objects and returns target object.
        // Properties that exist in source, but do not exist in target, are copied to target object.
        // Properties that exist in both source and target are NOT ALTERED.
        // Arrays are merged so that target array contains all unique values of both source and target
        private mergeObject(source: any, target: any): any {
            const _seen = [];

            const merge = (sourceInternal: any, targetInternal: any): void => {
                if (sourceInternal == null || Common.valueIsPrimitive(sourceInternal) || _seen.indexOf(sourceInternal) > -1) return;

                _seen.push(sourceInternal);

                if (targetInternal == null) {
                    targetInternal = {};
                }

                const properties = Object.keys(sourceInternal);

                for (let i = 0; i < properties.length; i++) {
                    const property = properties[i];

                    if (Common.isArray(sourceInternal[property])) {
                        targetInternal[property] = this.mergeArray(sourceInternal[property], targetInternal[property]);
                    }
                    else if (targetInternal.hasOwnProperty(property) === false) {
                        targetInternal[property] = sourceInternal[property];
                    }
                }
            };

            merge(source, target);

            return target;
        }

        // Merges two arrays.
        // Returns an array containing all unique values of both arrays
        private mergeArray(source: Array<any>, target: Array<any>): Array<any> {
            if (source == null) return target;

            if (target == null) return source;

            const arrayUnique = (array: Array<any>): Array<any> => {
                var a = array.concat();

                for (let i = 0; i < a.length; ++i) {
                    for (let j = i + 1; j < a.length; ++j) {

                        if (Common.classInstancesAreNotSame(a[i], a[j])) continue;

                        a.splice(j--, 1);
                    }
                }

                return a;
            }

            return arrayUnique((target || []).concat(source));
        }

        // Returns an instance from the Unique Instances Collection that corresponds to the obj parameter.
        // Matching is performed using Common.classInstancesAreSame method (type and keys matching)
        private getCorrespondingUniqueInstance(obj: any): any {
            if (obj == null || Common.valueIsPrimitive(obj) === true) return null;

            const classKey = Common.getClassInstanceKey(obj);
            return classKey == null ? null : this._uniqueTypeClassInstances[classKey];
        }

        // Merges an object with its corresponding Unique Instance and returns the merged unique instance.
        // If no corresponding Unique Instance is found, object is updated using its corresponding
        // Fresh Instance (if any) and then added to the Unique Instances Collection
        private mergeWithUniqueInstance(obj: any): any {
            var uniqueInstance = this.getCorrespondingUniqueInstance(obj);

            if (uniqueInstance == null) {
                var freshInstance = this.getCorrespondingFreshInstance(obj);

                if (freshInstance != null) {
                    this.updateInstance(obj, freshInstance);

                    if (this._debug === true) {
                        console.log("Merged object with corresponding Fresh instance. Result:", obj);
                    }
                }

                const classkey = Common.getClassInstanceKey(obj);
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
        }

        // Adds a Fresh Instance. If a corresponding Fresh Instance already exists, it is overwritten.
        // All child properties are visited and added to the Fresh Instances Collection if needed
        // using a recursive call to this method. Arrays are handled here too.
        public addFreshInstance(object: any, refs?: any) {
            var seen = refs == null ? [] : refs;

            return ((currentObject) => {
                if (currentObject == null) return;

                // Object has already been seen, switch value with a reference
                if (Object.prototype.toString.apply(currentObject) !== "[object Array]") {                    
                    for (let index = 0; index < seen.length; index++) {
                        if (Common.objectsAreEqual(seen[index], currentObject, true)) {                            
                           return;
                        }
                    }                    
                }

                seen.push(currentObject);

                if (this.isInstanceOfTypeClass(currentObject) === false) return;

                var alreadyExists = false;

                for (let i = 0; i < this._freshInstances.length; i++) {
                    if (Common.classInstancesAreNotSame(currentObject, this._freshInstances[i]) === true) continue;

                    this._freshInstances[i] = currentObject; // overwrite existing                
                    alreadyExists = true;
                }

                if (alreadyExists === false) {
                    this._freshInstances.push(currentObject);

                    if (this._debug === true) {
                        console.log("Added new Fresh instance:", currentObject);
                    }
                }

                for (let property in currentObject) {
                    if (currentObject.hasOwnProperty(property) === false) continue;

                    var prop = currentObject[property];

                    if (Common.isArray(prop) === true) {
                        for (let j = 0; j < prop.length; j++) {
                            this.addFreshInstance(prop[j], seen);
                        }
                    }
                    else {
                        if (this.isInstanceOfTypeClass(prop) === false) continue;

                        this.addFreshInstance(prop, seen);
                    }
                }
            })(object)
        }

        // Adds an array of Fresh Instances, using the addFreshInstance method.
        public addFreshArrayOfInstances(objects: Array<any>) {
            if (objects == null) return;

            for (let i = 0; i < objects.length; i++) {
                this.addFreshInstance(objects[i]);
            }
        }

        // Returns an instance from the Fresh Instances Collection that corresponds to the obj parameter.
        // Matching is performed using Common.classInstancesAreSame method (type and keys matching)
        private getCorrespondingFreshInstance(obj: any): any {
            if (obj == null || Common.valueIsPrimitive(obj)) return null;

            for (let i = 0; i < this._freshInstances.length; i++) {
                var current = this._freshInstances[i];

                if (Common.classInstancesAreSame(current, obj)) return current;
            }

            return null;
        }

        // Updates an object (target) based on another (source) and returns target object.
        // Properties that exist in source, but do not exist in target, are copied to target object.
        // Properties that exist in both in target and source are OVERWRITTEN in target using source values
        // Arrays are handled as other properties
        private updateInstance(target: any, source: any): any {
            if (target == null || source == null) return target;

            if (this.isInstanceOfTypeClass(target) === false || this.isInstanceOfTypeClass(source) === false) return;

            for (let property in source) {
                if (source.hasOwnProperty(property) === false) continue;

                target[property] = source[property];
            }

            return target;
        }

        private _seen = [];
        private discriminatorProp = "___";
        public reconstructReferences(object: any): any {
            this.reconstructReferencesPrive(object);
            for (var i in this._seen) {
                delete this._seen[i][this.discriminatorProp];
				delete this._seen[i]["$id"];
            }
            return object;
        }
        /**
         * Traverses the instance of an Object, top to bottom (through all its child objects, arrays, the objects within arrays, each property etc.) and reconstructs the
         * references so that: any Object or Property that is present more than once within the ROOT object, is pointing to one and only one instance of the same class.
         * The reconstructed Object is then returned.
         * @param object The Object or Property that is to be checked for references (i.e. user: UserViewModel)
         * @param parent The Parent of the investigated Property (i.e. "user" for property user.userName)
         * @param propName The Name of the investigated Property (i.e. "userName" for property user.UserName)    
         */
        private reconstructReferencesPrive(object: any, parent?: any, propName?: any): any {
            if (object == null || object[this.discriminatorProp] == true) return object; // null or already seen...

            if (Common.valueIsPrimitive(object) === true) return object; // primitive. Nothing to do

            this._seen.push(object);
            object[this.discriminatorProp] = true;

            // initialization debug
            if (this._debug === true && parent == null && propName == null) {
                console.log("Reconstructing references in root object:", object);
                console.log("Fresh Instances collection:", this._freshInstances);
            }

            //Array
            if (Common.isArray(object)) {
                for (let i = 0; i < object.length; i++) {
                    this.reconstructReferencesPrive(object[i], object, i); // recursive call for each array entry
                }
            }
            // Object
            else {
                // children objects debug
                if (this._debug === true && parent != null && propName != null) {
                    console.log(`Reconstructing references in child object '${propName}'`);
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
                for (let property in object) {
                    if (object.hasOwnProperty(property) === false) continue;

                    this.reconstructReferencesPrive(object[property], object, property);
                }
            }

            return object;
        }
    } /* end class ReferencesReconstructor*/
} /* end Joove namespace */
