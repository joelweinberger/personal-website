/*
 *    Copyright 2011 Joel Weinberger
 *
 *    This program is free software: you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the Free
 *    Software Foundation, either version 3 of the License, or (at your option)
 *    any later version.
 *
 *    This program is distributed in the hope that it will be useful, but WITHOUT
 *    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 *    more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * rhino jslint-rhino-wrap.js jslintfile [options]... [files]...
 *
 * The user *must* specify a JSLint file as the JSLint library. It is probably
 * useful to write a shell script that wraps around this and always specifies
 * the location of the JSLint file that you want to use. You can find the latest
 * bleeding-edge version of JSLint here:
 *      https://raw.github.com/douglascrockford/JSLint/master/jslint.js
 *
 * The user may specify 0 or more options of the form "--[option]" or
 * "--no_[option]" where [option] is a valid JSLINT option. If there is a
 * "--no_" prefix, the option value is set to "false" and passed to JSLint.
 * Otherwise, the option value is set to "true".
 *
 * Additionally, there is a single special option "jslint" that specifies that
 * the JSLINT object should be predefined and assumed to exist. This should
 * primarily only be used to analyze this file since it loads the JSLint lib and
 * needs to know of the JSLINT objects existence.
 *
 * The user must specify at least 1 file. Files are linted in order and errors
 * are printed out in order.
 */

var rhino_arguments = arguments;
var rhino_print = print;
var rhino_load = load;

var JSLINT_WRAP = (function () {
    'use strict';
    var jslint_path, i, option, options, negoption;

    if (rhino_arguments.length < 1) {
        rhino_print("error: you must provide a path to JSLint.");
        return;
    }

    jslint_path = rhino_arguments[0];
    rhino_load(jslint_path);

    function lintFile(filename, options) {
        var file, lintresult, i, error;
        
        file = readFile(filename);
        if (file === "") {
            rhino_print('File "' + filename + '" is either empty or non-existant.');
            return;
        }

        lintresult = JSLINT(file, options);

        if (lintresult) {
            rhino_print('File "' + filename + '" is lint free.');
            return;
        }

        rhino_print('Lint errors in "' + filename + '":');
        for (i = 0; i < JSLINT.errors.length; i = i + 1) {
            error = JSLINT.errors[i];
            if (error === null) {
                break;
            }

            rhino_print('(' + error.line + ',' + error.character + '): ' +
                  error.reason);
        }
    }

    /*
     * First, extract any special options. After the last option that starts
     * with '--', start processing as files.
     *
     * Note that we start at index 1 because the first index is the path to
     * JSLint.
     */
    options = {};
    for (i = 1; i < rhino_arguments.length; i = i + 1) {
        option = rhino_arguments[i];
        if (option.indexOf('--no_') === 0) {
            option = option.substr(5, option.length - 5);
            negoption = true;
        } else if (option.indexOf('--') === 0) {
            option = option.substr(2, option.length - 2);
            negoption = false;
        } else {
            break;
        }

        if (option === 'jslint') {
            if (negoption) {
                options.predef = [];
            } else {
                options.predef = [ 'JSLINT' ];
            }
        } else {
            options[option] = !negoption;
        }
    }

    if (i >= rhino_arguments.length) {
        rhino_print("error: you must provide at least 1 file to lint.");
        return;
    }

    for (; i < rhino_arguments.length; i = i + 1) {
        lintFile(rhino_arguments[i], options);
    }
}());
