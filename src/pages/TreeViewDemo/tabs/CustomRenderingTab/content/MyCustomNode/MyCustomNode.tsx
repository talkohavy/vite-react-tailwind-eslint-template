import type { TreeNodeContentProps } from '@src/components/TreeView/types';
import { NodeTypes } from '@src/components/TreeView';
import CustomNodeCssFile from '../CustomNodeCssFile';
import CustomNodeFolder from '../CustomNodeFolder';
import CustomNodeJavascriptFile from '../CustomNodeJavascriptFile';
import CustomNodeReactFile from '../CustomNodeReactFile';

export default function MyCustomNode(props: TreeNodeContentProps) {
  const { node, renderNode: DefaultTreeNodeContent } = props;

  // Custom rendering for React/TypeScript files
  if (node.type === NodeTypes.File && node.name.endsWith('.tsx')) {
    return <CustomNodeReactFile {...props} />;
  }

  // Custom rendering for JavaScript files
  if (node.type === NodeTypes.File && node.name.endsWith('.js')) {
    return <CustomNodeJavascriptFile {...props} />;
  }

  // Custom rendering for CSS files
  if (node.type === NodeTypes.File && node.name.endsWith('.css')) {
    return <CustomNodeCssFile {...props} />;
  }

  // Custom rendering for folders
  if (node.type === NodeTypes.Folder) {
    return <CustomNodeFolder {...props} />;
  }

  // Use default rendering for other node types (JSON, images, etc.)
  return DefaultTreeNodeContent ? <DefaultTreeNodeContent {...props} /> : null;
}
