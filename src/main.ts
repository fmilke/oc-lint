import { Tokenizer } from "./impl/Tokenizer";

// var testString = "func Hit() { return Explode(50); }";
var testString = "IdentOne IdentTwo Catch me if you can ";

var tokenizer = new Tokenizer(testString);

for (let token of tokenizer) {
    console.log(token.value);
}