import { promises, readdirSync } from 'fs';
import * as path from 'path';
import { expect } from 'chai';
import { Tokenizer } from '../../src/impl/Tokenizer';
import { ASTBuilder } from '../../src/impl/ASTBuilder';
import { Parser } from '../../src/impl/Parser';
import { DiagnosticsCache } from '../../src/impl/DiagnosticsCache';

describe('Parser', () => {
    const targetDir = './tests/parser/ast_values';
    const fileNames = readdirSync(targetDir);

    for (let fileName of fileNames) {
        if (path.extname(fileName) !== ".json")
            continue;

        it(`should create parse tree according to ${fileName}`, async () => {
            const data = await promises.readFile(path.join(targetDir, fileName), { encoding: 'utf-8' });
            const parsed = JSON.parse(data);

            const tokenizer = new Tokenizer(parsed.target);
            const builder = new ASTBuilder();
            const diagCache = new DiagnosticsCache();
            new Parser(tokenizer, builder, diagCache).parse();
            const ast = builder.getRoot();

            expect(ast.toTestObject()).to.eql(parsed.expected);
        });
    }
});