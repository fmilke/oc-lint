import { promises, readdirSync } from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { expect } from 'chai';
import { Tokenizer } from '../../src/impl/Tokenizer';
import { ParseTreeBuilder } from '../../src/impl/ParseTreeBuilder';
import { ParseTreeHelper } from './Helper';

interface YamlStructure {
    name: string,
    target: string,
    expected: [any],
}

describe('Yml Tester', () => {
    const targetDir = './tests/parseTreeBuilder/value_matches';
    const fileNames = readdirSync(targetDir);

    for (let fileName of fileNames) {
        it(`should create parse tree according to ${fileName}`, async () => {
            const data = await promises.readFile(path.join(targetDir, fileName), { encoding: 'utf-8' });
            const parsed = YAML.parse(data) as YamlStructure;

            const tokenizer = new Tokenizer(parsed.target);
            const tree = ParseTreeHelper.getValueTree(tokenizer);

            expect(tree).to.eql(parsed.expected);
        });
    }
});