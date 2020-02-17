
export enum PrecedencePosition {
    Postfix,
    Prefix,
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
];

// ++	Increases the value of the following variable by 1.	prefix	reference, reference
// 15	--	Decreases the value of the following variable by 1.	prefix	reference, reference
// 15	~	Bitwise negation of the following value.	prefix	int, int
// 15	!	Logical negation of the following value.	prefix	bool, bool
// 15	+	no effect (compatibility for terms such as "+5")	prefix	int, int
// 15	-	Yields the reciprocal of the following value.	prefix	int, int
// 15	++	Increases the value of the preceding variable by 1.	postfix (only one parameter)	int, reference
// 15	--	Decreases the value of the preceding variable by 1.	postfix (only one parameter)	int, reference
// 14l	**	Yields the power of a to b.	postfix	int, int/int
// 13l	/	Divides a by b.	postfix	int, int/int
// 13l	*	Multiplies a by b.	postfix	int, int/int
// 13l	%	Yields the remainder of the devision of a by b.	postfix	int, int/int
// 12l	-	Subtracts b from a.	postfix	int, int/int
// 12l	+	Adds a to b.	postfix	int, int/int
// 11l	<<	Performs a bit shift operation to the left.	postfix	int, int/int
// 11l	>>	Performs a bit shift operation to the right.	postfix	int, int/int
// 10l	<	Returns whether a is less than b.	postfix	bool, int/int
// 10l	<=	Returns whether a is less than or equal to b.	postfix	bool, int/int
// 10l	>	Returns whether a is greater than b.	postfix	bool, int/int
// 10l	>=	Returns whether the first value is greater than or equal to the second.	postfix	bool, int/int
// 9l	==	Returns whether a equals b. For proplists and arrays, pointers are compared. Use DeepEqual to compare contents.	postfix	bool, any/any
// 9l	!=	Returns whether a is unequal to b. For proplists and arrays, pointers are compared. Use !DeepEqual to compare contents.	postfix	bool, any/any
// 8l	&	Performs a bitwise AND operation.	postfix	int, int/int
// 6l	^	Performs a bitwise XOR operation.	postfix	int, int/int
// 6l	|	Performs a bitwise OR operation.	postfix	int, int/int
// 5l	&&	Performs a logical AND operation.	postfix	any, any/any
// 4l	||	Performs a logical OR operation.	postfix	any, any/any
// 3l	??	Returns the left-hand operand if the operand is not nil, or the right-hand operand otherwise.	postfix	any, any/any
// 2r	*=	Multiplies the preceeding variables by the following value.	postfix	reference, reference/int
// 2r	/=	Divides the preceeding variable by the following value.	postfix	reference, reference/int
// 2r	%=	Sets the preceeding variable to the remainder of the devision of that variable by the following value.	postfix	reference, reference/int
// 2r	+=	Increases the preceeding variable by the following value.	postfix	reference, reference/int
// 2r	-=	Decreases the preeceding variable by the following value.	postfix	reference, reference/int
// 2r	=	Assigns the following value to the preceeding variable.