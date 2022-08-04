"use strict";
exports.__esModule = true;
var O = require("fp-ts/Option");
var A = require("fp-ts/Array");
var function_1 = require("fp-ts/function");
(0, function_1.pipe)([1, 2], A.map(O.fromNullable), console.log);
