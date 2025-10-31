import type { TreeNodeContentProps } from '@src/components/TreeView/types';
import { NodeTypes } from '@src/components/TreeView';
import CustomNodeCssFile from '../CustomNodeCssFile';
import CustomNodeFolder from '../CustomNodeFolder';
import CustomNodeJavascriptFile from '../CustomNodeJavascriptFile';
import CustomNodeReactFile from '../CustomNodeReactFile';

export default function MyCustomNode(props: TreeNodeContentProps) {
  const { node } = props;

  // Custom rendering for React/TypeScript files
  if (node.type === NodeTypes.File && node.name.endsWith('.tsx')) {
    return <CustomNodeReactFile node={node} />;
  }

  // Custom rendering for JavaScript files
  if (node.type === NodeTypes.File && node.name.endsWith('.js')) {
    return <CustomNodeJavascriptFile node={node} />;
  }

  // Custom rendering for CSS files
  if (node.type === NodeTypes.File && node.name.endsWith('.css')) {
    return <CustomNodeCssFile node={node} />;
  }

  // Custom rendering for folders with metadata
  if (node.type === NodeTypes.Folder && node.metadata) {
    return <CustomNodeFolder node={node} />;
  }

  // Use default rendering for other node types
  return null;
}
