import type { ReactNode } from 'react';
import clsx from 'clsx';
import type { TreeNodeItemProps } from '../../TreeNodeItem';
import { NodeTypes } from '../../../logic/constants';
import ExpandButton from '../ExpandButton';
import styles from './DefaultTreeNodeContent.module.scss';

type DefaultTreeNodeContentProps = TreeNodeItemProps & {
  isFolderType: boolean;
  isLoading: boolean;
  isExpanded: boolean;
  iconToShow: string | (() => ReactNode) | null;
  handleNodeClick: () => void;
  handleExpandToggle: () => void;
};

export default function DefaultTreeNodeContent(props: DefaultTreeNodeContentProps) {
  const {
    node,
    level,
    isFolderType,
    isLoading,
    isExpanded,
    iconToShow: IconToShow,
    indentSize,
    handleNodeClick,
    handleExpandToggle,
  } = props;

  const { name, type: nodeType } = node;

  return (
    <div
      className={clsx(styles.treeNodeContent, nodeType === NodeTypes.File ? styles.fileType : styles.folderType)}
      style={{ marginLeft: level * indentSize }}
      onClick={handleNodeClick}
    >
      {isFolderType && (
        <ExpandButton
          onClick={(e) => {
            e.stopPropagation();
            handleExpandToggle();
          }}
          disabled={isLoading}
          className={clsx(styles.btnExpandFolder, isExpanded && styles.btnIsExpanded, isLoading && styles.btnIsLoading)}
        />
      )}

      {!isFolderType && <div className={styles.fileNodeAligner} />}

      {IconToShow && (
        <span className={styles.nodeIcon}>{typeof IconToShow === 'string' ? IconToShow : <IconToShow />}</span>
      )}

      <span className={styles.nodeLabel}>{name}</span>

      {isLoading && <span className={styles.loadingText}>Loading...</span>}
    </div>
  );
}
