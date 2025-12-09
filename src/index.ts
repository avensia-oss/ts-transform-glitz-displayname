import * as ts from 'typescript';
// Use a factory alias compatible across TS versions (<=3.9 and >=4)
const f: any = (ts as any).factory ?? (ts as any);

export const defaultOptions = {};
export type Options = typeof defaultOptions;

export default function transformer(
  program: ts.Program,
  options: Partial<Options> = defaultOptions,
): ts.TransformerFactory<ts.SourceFile> {
  options = {
    ...defaultOptions,
    ...options,
  };
  if (!program) {
    throw new Error('No ts.Program was passed to the transformer factory');
  }
  return (context: ts.TransformationContext) => (file: ts.SourceFile) =>
    visitSourceFile(file, program, context, options as Options);
}

function visitSourceFile(
  sourceFile: ts.SourceFile,
  program: ts.Program,
  context: ts.TransformationContext,
  options: Options,
): ts.SourceFile {
  const transformedSourceFile = ts.visitEachChild(
    visitNode(sourceFile, sourceFile, program, context, options),
    (childNode) => visitNodeAndChildren(childNode, sourceFile, program, context, options),
    context,
  );
  return transformedSourceFile;
}

function visitNodeAndChildren(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  program: ts.Program,
  context: ts.TransformationContext,
  options: Options,
): ts.Node | ts.Node[] {
  const visitedNode = visitNode(node, sourceFile, program, context, options);
  const visitedChildNode = ts.visitEachChild(
    visitedNode,
    (childNode) => visitNodeAndChildren(childNode, sourceFile, program, context, options),
    context,
  );
  return visitedChildNode;
}

function isVariableDeclaration(node: ts.Node): node is ts.VariableDeclaration {
  return node.kind === ts.SyntaxKind.VariableDeclaration;
}
function visitNode(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  program: ts.Program,
  context: ts.TransformationContext,
  options: Options,
): any {
  if (ts.isVariableStatement(node)) {
    const decl = node.declarationList.declarations[0];

    // Styled HTML component
    if (
      decl.initializer &&
      ts.isIdentifier(decl.name) &&
      ts.isCallExpression(decl.initializer) &&
      ts.isPropertyAccessExpression(decl.initializer.expression) &&
      decl.initializer.expression.expression &&
      ts.isIdentifier(decl.initializer.expression.expression) &&
      decl.initializer.expression.expression.escapedText === 'styled'
    ) {
      const variableDeclarationName = decl.name.escapedText.toString();
      return [
        node,
        f.createExpressionStatement(
          f.createBinaryExpression(
            f.createPropertyAccessExpression(f.createIdentifier(variableDeclarationName), 'displayName'),
            f.createToken(ts.SyntaxKind.EqualsToken),
            f.createStringLiteral(variableDeclarationName),
          ),
        ),
      ];
    }

    // Wrapped glitz component
    if (
      decl.initializer &&
      ts.isIdentifier(decl.name) &&
      ts.isCallExpression(decl.initializer) &&
      ts.isIdentifier(decl.initializer.expression) &&
      decl.initializer.expression.escapedText === 'styled' &&
      decl.initializer.arguments.length > 0
    ) {
      const variableDeclarationName = decl.name.escapedText.toString();
      return [
        node,
        f.createExpressionStatement(
          f.createBinaryExpression(
            f.createPropertyAccessExpression(f.createIdentifier(variableDeclarationName), 'displayName'),
            f.createToken(ts.SyntaxKind.EqualsToken),
            f.createStringLiteral(variableDeclarationName),
          ),
        ),
      ];
    }
  }
  return node;
}
