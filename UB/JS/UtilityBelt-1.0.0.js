/**
 *
 * Utility Belt
 *
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
         * @Method isEmail
         * Validate string as email pattern
         * @param email {string}
         * @return boolean
         */
        isEmail: function (email) {
            return this.getRegExp('email').test(email);
        }

    }
})();
