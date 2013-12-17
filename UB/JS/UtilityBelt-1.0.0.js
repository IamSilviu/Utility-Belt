/*

Utility Belt

*/
if (typeof UtilityBelt === 'undefined') UtilityBelt = UB = {};

UtilityBelt = UB = (function () {

    /**
     * Private
     */

    return {
        /**
         * @cfg regExp
         * Regular expression library
         */
        regExp: {
            email : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },

        /**
         * @Method getRegExp
         * Getter for Regular Expression library
         * @param email {string}
         * @return boolean
         */
        getRegExp: function (exp) {

            if (!this.regExp[exp]) {
                consol.warn('The regular expression', exp, 'was not found');
                return null;
            }

            return this.regExp[exp] ? this.regExp[exp] : null;
        },

        /**
         * Returns `true` if the passed value is email, `false` otherwise
         * @param {String} value The value to test.
         * @return {Boolean}
         */
        isEmail: function (value) {
            return this.getRegExp('email').test(value);
        },
		
		/**
         * Returns the given value itself if it's not empty, returns the default
         * value (second argument) otherwise.
         *
         * @param {Object} value The value to test.
         * @param {Object} defaultValue The value to return if the original value is empty.
         * @param {Boolean} [allowBlank=false] (optional) `true` to allow zero length strings to qualify as non-empty.
         * @return {Object} `value`, if non-empty, else `defaultValue`.
         */
        valueFrom: function(value, defaultValue, allowBlank){
            return this.isEmpty(value, allowBlank) ? defaultValue : value;
        },

        /**
         * Returns the type of the given variable in string format. List of possible values are:
         *
         * - `undefined`: If the given value is `undefined`
         * - `null`: If the given value is `null`
         * - `string`: If the given value is a string
         * - `number`: If the given value is a number
         * - `boolean`: If the given value is a boolean value
         * - `date`: If the given value is a `Date` object
         * - `function`: If the given value is a function reference
         * - `object`: If the given value is an object
         * - `array`: If the given value is an array
         * - `regexp`: If the given value is a regular expression
         * - `element`: If the given value is a DOM Element
         * - `textnode`: If the given value is a DOM text node and contains something other than whitespace
         * - `whitespace`: If the given value is a DOM text node and contains only whitespace
         *
         * @param {Object} value
         * @return {String}
         */
        typeOf: function(value) {
            if (value === null) {
                return 'null';
            }

            var type = typeof value;

            if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
                return type;
            }

            var typeToString = toString.call(value);

            switch(typeToString) {
                case '[object Array]':
                    return 'array';
                case '[object Date]':
                    return 'date';
                case '[object Boolean]':
                    return 'boolean';
                case '[object Number]':
                    return 'number';
                case '[object RegExp]':
                    return 'regexp';
            }

            if (type === 'function') {
                return 'function';
            }

            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    }
                    else {
                        return 'element';
                    }
                }

                return 'object';
            }

            //<debug error>
            console.warn('Failed to determine the type of the specified value "' + value + '". This is most likely a bug.');
            //</debug>
        },

        /**
         * Returns `true` if the passed value is empty, `false` otherwise. The value is deemed to be empty if it is either:
         *
         * - `null`
         * - `undefined`
         * - a zero-length array.
         * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`).
         *
         * @param {Object} value The value to test.
         * @param {Boolean} [allowEmptyString=false] (optional) `true` to allow empty strings.
         * @return {Boolean}
         */
        isEmpty: function(value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (Ext.isArray(value) && value.length === 0);
        },

        /**
         * Returns `true` if the passed value is a JavaScript Array, `false` otherwise.
         *
         * @param {Object} target The target to test.
         * @return {Boolean}
         * @method
         */
        isArray: ('isArray' in Array) ? Array.isArray : function(value) {
            return toString.call(value) === '[object Array]';
        },

        /**
         * Returns 'true' if the passed value is a JavaScript Date object, 'false' otherwise.
         * @param {Object} object The object to test.
         * @return {Boolean}
         */
        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },
		
		/**
         * Returns week 'number' if the passed value is a JavaScript Date object, '-1' otherwise.
         * @param {Object} object The object to test.
         * @return {Boolean}
         */
		getWeek: function(value) {
		
			if(!this.isDate(value)) return -1;
			
			// Create a copy of this date object  
            var target = this.clone(value),

            // ISO week date weeks start on monday so correct the day number  
            dayNr = (value.getDay() + 6) % 7;

            target.setDate(target.getDate() - dayNr + 3);
            var firstThursday = target.valueOf();

            // Set the target to the first thursday of the year  
            // First set the target to january first  
            target.setMonth(0, 1);
			
            // Not a thursday? Correct the date to the next thursday  
            if (target.getDay() != 4) {
                target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
            }

            // The weeknumber is the number of weeks between the   
            // first thursday of the year and the thursday in the target week  
            return 1 + Math.ceil((firstThursday - target) / 604800000);	
		},
        /**
         * Returns 'true' if the passed value is a String that matches the MS Date JSON encoding format
         * @param {String} value The string to test
         * @return {Boolean}
         */
        isMSDate: function(value) {
            if (!Ext.isString(value)) {
                return false;
            } else {
                return value.match("\\\\?/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\\\?/") !== null;
            }
        },

        /**
         * Returns `true` if the passed value is a JavaScript Object, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         * @method
         */
        isObject: (toString.call(null) === '[object Object]') ?
        function(value) {
            // check ownerDocument here as well to exclude DOM nodes
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return toString.call(value) === '[object Object]';
        },

        /**
         * @private
         */
        isSimpleObject: function(value) {
            return value instanceof Object && value.constructor === Object;
        },
        /**
         * Returns `true` if the passed value is a JavaScript 'primitive', a string, number or Boolean.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isPrimitive: function(value) {
            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },

        /**
         * Returns `true` if the passed value is a JavaScript Function, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         * @method
         */
        isFunction:
        // Safari 3.x and 4.x returns 'function' for typeof <NodeList>, hence we need to fall back to using
        // Object.prorotype.toString (slower)
        (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
            return toString.call(value) === '[object Function]';
        } : function(value) {
            return typeof value === 'function';
        },

        /**
         * Returns `true` if the passed value is a number. Returns `false` for non-finite numbers.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        /**
         * Validates that a value is numeric.
         * @param {Object} value Examples: 1, '1', '2.34'
         * @return {Boolean} `true` if numeric, `false` otherwise.
         */
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        /**
         * Returns `true` if the passed value is a string.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isString: function(value) {
            return typeof value === 'string';
        },

        /**
         * Returns `true` if the passed value is a Boolean.
         *
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isBoolean: function(value) {
            return typeof value === 'boolean';
        },

        /**
         * Returns `true` if the passed value is an HTMLElement.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isElement: function(value) {
            return value ? value.nodeType === 1 : false;
        },

        /**
         * Returns `true` if the passed value is a TextNode.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isTextNode: function(value) {
            return value ? value.nodeName === "#text" : false;
        },

        /**
         * Returns `true` if the passed value is defined.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isDefined: function(value) {
            return typeof value !== 'undefined';
        },

        /**
         * Returns `true` if the passed value is iterable, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isIterable: function(value) {
            return (value && typeof value !== 'string') ? value.length !== undefined : false;
        },
		
		/**
         * Clone almost any type of variable including array, object, DOM nodes and Date without keeping the old reference.
         * @param {Object} item The variable to clone.
         * @return {Object} clone
         */
		clone: function(item) {
            if (item === null || item === undefined) {
                return item;
            }

            // DOM nodes
            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            // Strings
            var type = toString.call(item);

            // Dates
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            var i, j, k, clone, key;

            // Arrays
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = this.clone(item[i]);
                }
            }
            // Objects
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = this.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        clone[k] = item[k];
                    }
                }
            }

            return clone || item;
        }
    }
})();
