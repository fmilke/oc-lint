import { DocumentString } from "./DocumentString";
import { Tokenizer } from "./impl/Tokenizer";

var testString = "func Hit() { return Explode(50); }";

var doc = new DocumentString(testString);

var tokenizer = new Tokenizer(doc);

for (let token of tokenizer) {
    console.log(token.value);
}