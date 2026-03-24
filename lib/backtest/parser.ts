/**
 * Safe Strategy Expression Parser
 * Replaces `eval` and `new Function` with a tokenized logic evaluator.
 * Supports basic operators: >, <, >=, <=, ==, !=, AND, OR.
 */

export function safeEvaluate(logic: string, context: Record<string, number>): boolean {
    let expression = logic.trim();
    if (!expression) return false;

    // 1. Recursive Parentheses Handling
    while (expression.includes('(')) {
        const closeIdx = expression.indexOf(')');
        const openIdx = expression.lastIndexOf('(', closeIdx);
        if (openIdx === -1) break; // Unbalanced

        const subExpr = expression.substring(openIdx + 1, closeIdx);
        const result = safeEvaluate(subExpr, context);
        expression = expression.substring(0, openIdx) + (result ? "TRUE" : "FALSE") + expression.substring(closeIdx + 1);
    }

    // 2. Normalize Logical Operators
    expression = expression.replace(/\s+and\s+/gi, ' AND ').replace(/\s+or\s+/gi, ' OR ').replace(/^not\s+/gi, 'NOT ').replace(/\s+not\s+/gi, ' NOT ');

    // 2.5. Handle Functions: CROSSOVER(A, B) -> (A > B AND A_prev <= B_prev)
    const crossoverRegex = /CROSSOVER\(([^,]+),\s*([^)]+)\)/gi;
    expression = expression.replace(crossoverRegex, '($1 > $2 AND $1_prev <= $2_prev)');

    const crossunderRegex = /CROSSUNDER\(([^,]+),\s*([^)]+)\)/gi;
    expression = expression.replace(crossunderRegex, '($1 < $2 AND $1_prev >= $2_prev)');


    // 3. Handle OR Logic (Lowest Precedence)
    if (expression.includes(' OR ')) {
        const parts = expression.split(' OR ');
        return parts.some(part => safeEvaluate(part, context));
    }

    // 4. Handle AND Logic
    if (expression.includes(' AND ')) {
        const parts = expression.split(' AND ');
        return parts.every(part => safeEvaluate(part, context));
    }

    // 5. Handle NOT Logic (evaluated on single conditions/literals)
    if (expression.startsWith('NOT ')) {
        return !safeEvaluate(expression.substring(4), context);
    }

    // 6. Literals
    if (expression === 'TRUE') return true;
    if (expression === 'FALSE') return false;

    // 7. Base Case: Single Condition Evaluation
    return parseCondition(expression, context);
}

function parseCondition(condition: string, context: Record<string, number>): boolean {
    const operators = ['>=', '<=', '>', '<', '==', '!='];
    let op = '';
    let tokens: string[] = [];

    for (const operator of operators) {
        if (condition.includes(operator)) {
             op = operator;
             tokens = condition.split(operator).map(s => s.trim());
             break;
        }
    }

    if (tokens.length !== 2 || !op) {
        console.warn(`Invalid condition format: ${condition}`);
        return false;
    }

    const leftVal = resolveValue(tokens[0], context);
    const rightVal = resolveValue(tokens[1], context);

    if (leftVal === undefined || rightVal === undefined) return false;

    switch (op) {
        case '>': return leftVal > rightVal;
        case '<': return leftVal < rightVal;
        case '>=': return leftVal >= rightVal;
        case '<=': return leftVal <= rightVal;
        case '==': return leftVal === rightVal;
        case '!=': return leftVal !== rightVal;
        default: return false;
    }
}

function resolveValue(token: string, context: Record<string, number>): number | undefined {
    // If it's a number (e.g. 30, 70, 0.5)
    if (!isNaN(Number(token))) {
        return Number(token);
    }
    
    // If it's a context variable (e.g. SMA_50, close)
    if (token in context) {
        return context[token];
    }
    
    console.warn(`Unresolved token: ${token}`);
    return undefined;
}
