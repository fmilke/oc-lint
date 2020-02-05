"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tokenizer_1 = require("./impl/Tokenizer");
// var testString = "func Hit() { return Explode(50); }";
var testString = "IdentOne IdentTwo Catch me if you can ";
var tokenizer = new Tokenizer_1.Tokenizer(testString);
for (let token of tokenizer) {
    console.log(token.value);
}
//# sourceMappingURL=main.js.map