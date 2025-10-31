import type { ReactNode } from 'react';
import { addDataAttributeWhen } from '@src/common/utils/addDataAttributeWhen';
import clsx from 'clsx';
import type { TreeNodeItemProps } from '../../TreeNodeItem';
import {
  TREE_VIEW_NODE_CONTENT_AS_BUTTON_CLASS,
  TREE_VIEW_NODE_CONTENT_CLASS,
  TREE_VIEW_NODE_CONTENT_EXPAND_BUTTON_CLASS,
} from '../../../logic/constants';
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

  const { name } = node;

  return (
    <div className={clsx(TREE_VIEW_NODE_CONTENT_CLASS, styles.treeNodeContent)}>
      <button
        type='button'
        onClick={handleNodeClick}
        className={clsx(
          TREE_VIEW_NODE_CONTENT_AS_BUTTON_CLASS,
          styles.treeNodeInfoButton,
          isFolderType ? styles.folderType : styles.fileType,
          isFolderType && shouldExpandOnClick ? styles.pointerCursor : styles.defaultCursor,
          isSelected && styles.selected,
        )}
        data-folder-type={addDataAttributeWhen(isFolderType)}
        data-file-type={addDataAttributeWhen(!isFolderType)}
        data-selected={addDataAttributeWhen(isSelected)}
        style={{ marginLeft: level * indentSize }}
        data-test-id={`${testIdPath}-node-as-button`}
      >
        {isFolderType && (
          <ExpandButton
            onClick={(e) => {
              e.stopPropagation(); // <--- Prevent the button's onClick from firing the node click handler
              handleExpandToggle();
            }}
            disabled={isLoading}
            className={clsx(
              TREE_VIEW_NODE_CONTENT_EXPAND_BUTTON_CLASS,
              styles.btnExpandFolder,
              isExpanded && styles.btnIsExpanded,
              isLoading && styles.btnIsLoading,
            )}
            testId={testIdPath}
          />
        )}

        {!isFolderType && <div className={styles.fileNodeAligner} />}

        {IconToShow && (
          <span className={styles.nodeIcon}>{typeof IconToShow === 'string' ? IconToShow : <IconToShow />}</span>
        )}

        <span className={styles.nodeLabel} data-test-id={`${testIdPath}-label`}>
          {name}
        </span>
      </button>

      {isLoading && (
        <span className={styles.loadingText} data-test-id={`${testIdPath}-is-loading`}>
          Loading...
        </span>
      )}
    </div>
  );
}
