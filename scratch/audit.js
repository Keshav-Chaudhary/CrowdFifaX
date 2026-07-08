const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
        filePath,
        code,
        ts.ScriptTarget.Latest,
        true
    );

    let functionsCount = 0;
    let largestFuncLines = 0;
    let largestFuncName = "";
    let conditionals = 0;
    let switches = 0;
    let maxDepth = 0;
    let useEffects = 0;
    let jsxElements = 0;

    function getLineCount(node) {
        const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line;
        const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
        return end - start + 1;
    }

    function calculateDepth(node, currentDepth) {
        let blockDepth = currentDepth;
        if (
            ts.isBlock(node) ||
            ts.isIfStatement(node) ||
            ts.isForStatement(node) ||
            ts.isWhileStatement(node) ||
            ts.isSwitchStatement(node) ||
            ts.isCatchClause(node) ||
            ts.isConditionalExpression(node)
        ) {
            blockDepth++;
            if (blockDepth > maxDepth) {
                maxDepth = blockDepth;
            }
        }

        ts.forEachChild(node, (child) => calculateDepth(child, blockDepth));
    }

    function visit(node) {
        if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
            functionsCount++;
            const lines = getLineCount(node);
            if (lines > largestFuncLines) {
                largestFuncLines = lines;
                if (ts.isFunctionDeclaration(node) && node.name) {
                    largestFuncName = node.name.text;
                } else if (ts.isVariableDeclaration(node.parent) && ts.isIdentifier(node.parent.name)) {
                    largestFuncName = node.parent.name.text;
                } else {
                    largestFuncName = "anonymous";
                }
            }
        }

        if (ts.isIfStatement(node) || ts.isConditionalExpression(node)) {
            conditionals++;
        }

        if (ts.isSwitchStatement(node)) {
            switches++;
        }

        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'useEffect') {
            useEffects++;
        }

        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
            jsxElements++;
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    
    // Depth analysis is done separately to only track within functions/blocks
    function visitForDepth(node) {
        if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
            calculateDepth(node, 0);
        } else {
            ts.forEachChild(node, visitForDepth);
        }
    }
    visitForDepth(sourceFile);

    const loc = code.split('\n').length;
    
    // Simplified risk heuristic
    let risk = "LOW";
    if (loc > 500 || largestFuncLines > 80 || maxDepth > 4) risk = "CRITICAL";
    else if (loc > 400 || largestFuncLines > 50) risk = "HIGH";
    else if (loc > 300) risk = "MEDIUM";

    return {
        file: filePath.replace(/\\/g, '/').split('/src/')[1] || filePath,
        loc,
        functions: functionsCount,
        largestFuncLines,
        largestFuncName,
        conditionals,
        switches,
        maxDepth,
        useEffects,
        jsxElements,
        risk
    };
}

const files = walk('./src');
const results = files.map(analyzeFile);

// Filter and sort for the report
const sorted = results
    .filter(r => r.risk === 'CRITICAL' || r.risk === 'HIGH' || r.risk === 'MEDIUM')
    .sort((a, b) => {
        const riskOrder = { CRITICAL: 3, HIGH: 2, MEDIUM: 1 };
        if (riskOrder[b.risk] !== riskOrder[a.risk]) return riskOrder[b.risk] - riskOrder[a.risk];
        return b.loc - a.loc;
    });

fs.writeFileSync('audit_report.json', JSON.stringify(sorted, null, 2));
console.log(`Audited ${files.length} files. Found ${sorted.length} with elevated risk.`);
