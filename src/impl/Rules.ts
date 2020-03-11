
export enum PrecedencePosition {
    Postfix,
    Prefix,
    PrefixXorPostfix,
}

export interface PrecedenceRule {
    value: string,
    position: PrecedencePosition,
    priority: number,
    parameters: 1 | 2,
}

export const precedenceRules: PrecedenceRule[] = [
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 12,
        value: "+",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 13,
        value: "*",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 13,
        value: "%",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 13,
        value: "/",
    },
    {   // 14l	**	Yields the power of a to b.	postfix	int, int/int
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 14,
        value: "**",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 11,
        value: "<<",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 11,
        value: ">>",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 10,
        value: "<",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 10,
        value: "<=",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 10,
        value: ">",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 10,
        value: ">=",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 9,
        value: "==",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 9,
        value: "!=",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 8,
        value: "&",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 6,
        value: "^",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 6,
        value: "|",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 5,
        value: "&&",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 4,
        value: "||",
    },
    {
        parameters: 2,
        position: PrecedencePosition.Postfix,
        priority: 3,
        value: "??",
    },
    {
        parameters: 1,
        position: PrecedencePosition.PrefixXorPostfix,
        priority: 15,
        value: "++",
    },
    {
        parameters: 1,
        position: PrecedencePosition.PrefixXorPostfix,
        priority: 15,
        value: "--",
    },
    {
        parameters: 1,
        position: PrecedencePosition.Prefix,
        priority: 15,
        value: "~",
    },
    {
        parameters: 1,
        position: PrecedencePosition.Prefix,
        priority: 15,
        value: "!",
    },
];

// 15	+	no effect (compatibility for terms such as "+5")	prefix	int, int
// 15	-	Yields the reciprocal of the following value.	prefix	int, int
// 2r	*=	Multiplies the preceeding variables by the following value.	postfix	reference, reference/int
// 2r	/=	Divides the preceeding variable by the following value.	postfix	reference, reference/int
// 2r	%=	Sets the preceeding variable to the remainder of the devision of that variable by the following value.	postfix	reference, reference/int
// 2r	+=	Increases the preceeding variable by the following value.	postfix	reference, reference/int
// 2r	-=	Decreases the preeceding variable by the following value.	postfix	reference, reference/int
// 2r	=	Assigns the following value to the preceeding variable.