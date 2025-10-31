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
  isSelected: boolean;
  iconToShow: string | (() => ReactNode) | null;
  handleNodeClick: () => void;
  handleExpandToggle: () => void;
  testIdPath?: string;
};

export default function DefaultTreeNodeContent(props: DefaultTreeNodeContentProps) {
  const {
    node,
    level,
    isFolderType,
    isLoading,
    isExpanded,
    isSelected,
    iconToShow: IconToShow,
    indentSize,
    handleNodeClick,
    handleExpandToggle,
    shouldExpandOnClick,
    testIdPath = '',
  } = props;

  const { name, type: nodeType } = node;

  return (
    <div className={styles.treeNodeContent}>
      <button
        type='button'
        onClick={handleNodeClick}
        data-selected={isSelected}
        className={clsx(
          styles.treeNodeInfoButton,
          nodeType === NodeTypes.File ? styles.fileType : styles.folderType,
          isFolderType && shouldExpandOnClick ? styles.pointerCursor : styles.defaultCursor,
          isSelected && styles.selected,
        )}
        style={{ marginLeft: level * indentSize }}
        data-test-id={testIdPath}
      >
        {isFolderType && (
          <ExpandButton
            onClick={(e) => {
              e.stopPropagation(); // <--- Prevent the button's onClick from firing the node click handler
              handleExpandToggle();
            }}
            disabled={isLoading}
            className={clsx(
              styles.btnExpandFolder,
              isExpanded && styles.btnIsExpanded,
              isLoading && styles.btnIsLoading,
            )}
          />
        )}

        {!isFolderType && <div className={styles.fileNodeAligner} />}

        {IconToShow && (
          <span className={styles.nodeIcon}>{typeof IconToShow === 'string' ? IconToShow : <IconToShow />}</span>
        )}

        <span className={styles.nodeLabel}>{name}</span>
      </button>

      {isLoading && <span className={styles.loadingText}>Loading...</span>}
    </div>
  );
}
