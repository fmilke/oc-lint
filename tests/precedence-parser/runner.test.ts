import { readdirSync, promises } from "fs";
import path = require("path");
import { Tokenizer } from "../../src/impl/Tokenizer";
import { expect } from "chai";
import { PrecedenceParser } from "../../src/impl/PrecedenceParser";
import { ASTNode } from "../../src/model/ASTNode";

describe('Precedence Parser', () => {
    const targetDir = './tests/precedence-parser/json';
    const fileNames = readdirSync(targetDir);

    for (let fileName of fileNames) {
        if (path.extname(fileName) !== ".json")
            continue;

        it(`should create parse tree according to ${fileName}`, async () => {
            const data = await promises.readFile(path.join(targetDir, fileName), { encoding: 'utf-8' });
            const parsed = JSON.parse(data);

            const tokenizer = new Tokenizer(parsed.target);
            const root = ASTNode.createRoot();
            const nodes = Array.from(tokenizer).map(token => new ASTNode(token));
            nodes.pop();
            nodes.forEach(node => root.appendChild(node));
            // pop EOF node
            const parser = new PrecedenceParser(nodes);
            parser.parse();
            expect(root.children[0].toTestObject()).to.eql(parsed.expected);
        });
    }
});