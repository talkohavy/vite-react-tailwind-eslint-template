import { addDataAttributeWhen } from '@src/common/utils/addDataAttributeWhen';
import clsx from 'clsx';
import type { TreeNodeContentProps } from '../../../types';
import {
  DEFAULT_INDENT_SIZE,
  TREE_VIEW_NODE_CONTENT_AS_BUTTON_CLASS,
  TREE_VIEW_NODE_CONTENT_CLASS,
  TREE_VIEW_NODE_CONTENT_EXPAND_BUTTON_CLASS,
} from '../../../logic/constants';
import ExpandButton from '../ExpandButton';
import styles from './DefaultTreeNodeContent.module.scss';

export default function DefaultTreeNodeContent(props: TreeNodeContentProps) {
  const {
    node,
    level,
    isFolderType,
    isLoading,
    isExpanded,
    isSelected,
    iconToShow: IconToShow,
    indentSize = DEFAULT_INDENT_SIZE,
    handleNodeClick,
    handleExpandToggle,
    shouldExpandOnClick,
    testId = '',
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
          isFolderType && shouldExpandOnClick ? styles.pointerCursor : styles.defaultCursor,
        )}
        data-folder-type={addDataAttributeWhen(isFolderType)}
        data-file-type={addDataAttributeWhen(!isFolderType)}
        data-selected={addDataAttributeWhen(isSelected)}
        style={{ marginLeft: level * indentSize }}
        data-test-id={`${testId}-node-as-button`}
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
            testId={testId}
          />
        )}

        {!isFolderType && <div className={styles.fileNodeAligner} />}

        {IconToShow && (
          <span className={styles.nodeIcon}>{typeof IconToShow === 'string' ? IconToShow : <IconToShow />}</span>
        )}

        <span className={styles.nodeLabel} data-test-id={`${testId}-label`}>
          {name}
        </span>
      </button>

      {isLoading && (
        <span className={styles.loadingText} data-test-id={`${testId}-is-loading`}>
          Loading...
        </span>
      )}
    </div>
  );
}
