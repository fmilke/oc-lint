import { Token } from "../ifaces/ITokenizer";
import { precedenceRules, PrecedenceRule, PrecedencePosition } from "./Rules";
import { ExpressionNode, UnparsedOperatorNode, IASTNode, Operator1Node, Operator2Node, OperatorNode } from "../model/ASTNode";
import { appContainer } from "../app";
import { IDiagnosticsCache } from "../ifaces/IDiagnosticsCache";

type UnparsedNodeCollection = (UnparsedOperatorNode | IASTNode)[];

export class PrecedenceParser {

    private node: null | UnparsedOperatorNode = null;
    private rule: null | PrecedenceRule = null;
    private recentOperator: OperatorNode | null = null;

    private diagonstics = appContainer.resolve<IDiagnosticsCache>("DiagnosticsCache");

    constructor(private parts: UnparsedNodeCollection) { }

    public parse() {
        let operatorCount = this.parts.reduce(
            (prev, node) => node instanceof UnparsedOperatorNode ? prev + 1 : prev,
            0
        );

        while (operatorCount > 0) {

            if (!this.tryGetNodeWithHighestPrecedence(this.parts))
                return null;

            if (!this.tryApplyRule())
                return null;

            operatorCount--;
        }

        return this.recentOperator === null ? null : new ExpressionNode(this.recentOperator);
    }

    private tryApplyRule(): boolean {
        if (this.node === null || this.rule === null)
            throw Error("Trying to apply rule, while either node or rule is missing");

        const idx = this.parts.indexOf(this.node);
        const idxLast = this.parts.length - 1;

        if (this.rule.parameters === 1) {
            let position = this.rule.position;

            // Some rules (e.g. ++) can be postfix or prefix
            // Here we try to decide which of these
            if (position === PrecedencePosition.PrefixXorPostfix) {
                if (idx === 0)
                    position = PrecedencePosition.Prefix;
                else if (idx === idxLast) {
                    position = PrecedencePosition.Postfix;
                }
                else {
                    position = this.parts[idx - 1] instanceof UnparsedOperatorNode ?
                        PrecedencePosition.Prefix : PrecedencePosition.Postfix;
                }
            }

            if (position === PrecedencePosition.Prefix) {
                if (idx < idxLast) {
                    const right = this.parts[idx + 1];

                    if (right instanceof UnparsedOperatorNode) {
                        this.diagonstics.raiseError(this.node.token, "Expression expected.");
                        return false;
                    }

                    const operatorNode = new Operator1Node(this.node.token, right);
                    this.parts.splice(idx, 2, operatorNode);
                    this.recentOperator = operatorNode;
                }
                else {
                    this.diagonstics.raiseError(this.node.token, "Right-hand expression expected.");
                    return false;
                }
            }
            else {
                if (idx < 1) {
                    this.diagonstics.raiseError(this.node.token, "Left-hand expression expected.");
                    return false;
                }
                else {
                    const left = this.parts[idx - 1];

                    if (left instanceof UnparsedOperatorNode) {
                        this.diagonstics.raiseError(this.node.token, "Expression expected");
                        return false;
                    }

                    const operatorNode = new Operator1Node(this.node.token, left);
                    this.parts.splice(idx - 1, 2, operatorNode);
                    this.recentOperator = operatorNode;
                }
            }
        }
        else {
            if (idx < 1) {
                this.diagonstics.raiseError(this.node.token, "Missing left expression.");
                return false;
            }
            else if (idx >= this.parts.length - 1) {
                this.diagonstics.raiseError(this.node.token, "Missing right expression.");
                return false;
            }
            else {
                const left = this.parts[idx - 1];
                const right = this.parts[idx + 1];

                if (left instanceof UnparsedOperatorNode) {
                    this.diagonstics.raiseError(left.token, "Expression expected.");
                    return false;
                }

                if (right instanceof UnparsedOperatorNode) {
                    this.diagonstics.raiseError(right.token, "Expression expected");
                    return false;
                }

                const operatorNode = new Operator2Node(this.node.token, left, right);
                this.parts.splice(idx - 1, 3, operatorNode);
                this.recentOperator = operatorNode;
            }
        }

        return true;
    }

    private tryGetNodeWithHighestPrecedence(nodes: UnparsedNodeCollection) {
        let maxOperator = null;
        let maxPriority = 0;
        let maxRule = null;

        for (let node of nodes) {
            if (node instanceof UnparsedOperatorNode) {
                const rule = this.getOperatorPrecedence(node.token);

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
}