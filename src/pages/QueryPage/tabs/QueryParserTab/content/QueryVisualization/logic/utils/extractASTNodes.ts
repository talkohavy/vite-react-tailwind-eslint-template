import type { Expression } from '../../../../../../../../lib/QueryLanguage';
import type { VisualizationItem } from '../../types';
import { AST_COLORS } from '../constants';

export function extractASTNodes(expression: Expression, level = 0): VisualizationItem[] {
  const items: VisualizationItem[] = [];

  function traverseNode(node: Expression, currentLevel: number): void {
    const item: VisualizationItem = {
      id: `ast-${node.type}-${node.position.start}-${node.position.end}`,
      label: node.type,
      start: node.position.start,
      end: node.position.end,
      type: 'ast',
      subType: node.type,
      level: currentLevel,
      color: AST_COLORS[node.type as keyof typeof AST_COLORS] || '#6b7280',
    };
    items.push(item);

    // Traverse child nodes based on type
    switch (node.type) {
      case 'query':
      case 'group':
        if ('expression' in node) {
          traverseNode(node.expression, currentLevel + 1);
        }
        break;
      case 'boolean':
        if ('left' in node && 'right' in node && 'operator' in node) {
          // Add the operator node
          const operatorItem: VisualizationItem = {
            id: `ast-operator-${node.operator.position.start}-${node.operator.position.end}`,
            label: `operator: "${node.operator.value}"`,
            start: node.operator.position.start,
            end: node.operator.position.end,
            type: 'ast',
            subType: 'operator',
            level: currentLevel + 1,
            color: AST_COLORS.Operator,
          };

          items.push(operatorItem);

          // Traverse left and right expressions
          traverseNode(node.left, currentLevel + 1);
          traverseNode(node.right, currentLevel + 1);
        }
        break;
      case 'condition':
        if ('key' in node && 'comparator' in node && 'value' in node) {
          // Add the child nodes directly as items since they're ASTNodes too
          const keyItem: VisualizationItem = {
            id: `ast-key-${node.key.position.start}-${node.key.position.end}`,
            label: `key: "${node.key.value}"`,
            start: node.key.position.start,
            end: node.key.position.end,
            type: 'ast',
            subType: 'key',
            level: currentLevel + 1,
            color: AST_COLORS.Key,
          };

          const comparatorItem: VisualizationItem = {
            id: `ast-comparator-${node.comparator.position.start}-${node.comparator.position.end}`,
            label: `comparator: "${node.comparator.value}"`,
            start: node.comparator.position.start,
            end: node.comparator.position.end,
            type: 'ast',
            subType: 'comparator',
            level: currentLevel + 1,
            color: AST_COLORS.Comparator,
          };

          const valueItem: VisualizationItem = {
            id: `ast-value-${node.value.position.start}-${node.value.position.end}`,
            label: `value: "${node.value.value}"`,
            start: node.value.position.start,
            end: node.value.position.end,
            type: 'ast',
            subType: 'value',
            level: currentLevel + 1,
            color: AST_COLORS.Value,
          };

          items.push(keyItem, comparatorItem, valueItem);
        }
        break;
    }
  }

  traverseNode(expression, level);
  return items;
}
