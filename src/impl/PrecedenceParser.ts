import { TokenType, Token } from "../ifaces/ITokenizer";
import { ASTNode } from "../model/ASTNode";
import { precedenceRules, PrecedenceRule, PrecedencePosition } from "./Rules";

export class PrecedenceParser {

    private node: null | ASTNode = null;
    private rule: null | PrecedenceRule = null;
    private operators: ASTNode[] = [];

    constructor(private nodes: ASTNode[]) {
        this.operators = nodes.filter(node => this.isOperatorToken(node.token));
    }

    public parse() {
        while (this.operators.length) {
            console.log(this.operators.map(node => node.token.value));

            // Should not throw, should push diagonstic
            if (!this.tryGetNodeWithHighestPrecedence(this.operators))
                throw new Error("Could not get node with precedence");

            if (this.node === null || this.rule === null) {
                throw new Error("Failed");
            }

            console.log(`Apply rule of ${this.rule.value}`);

            this.applyRule(this.node, this.rule);
        }
    }

    private applyRule(node: ASTNode, rule: PrecedenceRule) {
        const idx = this.nodes.indexOf(node);
        
        console.log(node.toDebugString());

        if (rule.parameters === 1) {
            if (rule.position === PrecedencePosition.Prefix) {
                if (idx === this.nodes.length - 1) {
                    // provide diagnostics
                    throw new Error("Error1");
                }
                else {
                    node.appendChild(this.nodes[idx + 1]);
                    this.nodes.splice(idx + 1, 1);

                }
            }
            else {
                if (idx === 0) {
                    // provide diagnostics
                    throw new Error("Error2");
                }
                else {
                    node.appendChild(this.nodes[idx - 1]);
                    this.nodes.splice(idx - 1, 1);
                }
            }
        }
        else {
            if (idx === 0 || idx === this.nodes.length - 1) {
                // provide diagnostics
                throw new Error("Error3");
            }
            else {
                
                node.appendChild(this.nodes[idx - 1]);
                node.appendChild(this.nodes[idx + 1]);
                this.nodes.splice(idx - 1, 3, node);
            }
        }

        return true;
    }

    private tryGetNodeWithHighestPrecedence(nodes: ASTNode[]) {
        let maxOperator = null;
        let maxPriority = 0;
        let maxRule = null;

        for (let node of nodes) {
            if (this.isOperatorToken(node.token)) {
                console.log(node.token.value);
                const rule = this.getOperatorPrecedence(node.token);
                console.log(rule);

                if (rule.priority > maxPriority) {
                    maxPriority = rule.priority;
                    maxOperator = node;
                    maxRule = rule;
                }
            }
        }

        this.node = maxOperator;
        this.rule = maxRule;

        return maxRule !== null;
    }

    private getOperatorPrecedence(token: Token) {
        let rule = precedenceRules.find(({ value }) => value === token.value);

        if (!rule)
            throw new Error(`Could not find matching rule for ${token.value}`);

        return rule;
    }

    private isOperatorToken(token: Token) {
        switch (token.type) {
            case TokenType.ArithmicOperator:
            case TokenType.NilCaseOperator:
            case TokenType.AssignmentOperator:
            case TokenType.BitwiseOperator:
            case TokenType.LogicalOperator:
                return true;
            default:
                return false;
        }
    }
}