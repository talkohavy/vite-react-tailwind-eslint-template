import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { TreeNode } from './types';
import TreeView from './TreeView';

const mockStaticData: Array<TreeNode> = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    items: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        items: [
          { id: '3', name: 'Button.tsx', type: 'file' },
          { id: '4', name: 'Input.tsx', type: 'file' },
        ],
      },
      { id: '5', name: 'App.tsx', type: 'file' },
    ],
  },
  {
    id: '6',
    name: 'package.json',
    type: 'file',
  },
];

const mockDynamicData: Array<TreeNode> = [
  {
    id: 'root',
    name: 'project',
    type: 'folder',
  },
  {
    id: 'readme',
    name: 'README.md',
    type: 'file',
  },
];

describe('TreeView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Static Configuration', () => {
    it('should render tree structure correctly', () => {
      render(<TreeView data={mockStaticData} testId='tree-view' />);

      expect(screen.getByTestId('tree-view-i1-label')).toHaveTextContent('src');
      expect(screen.getByTestId('tree-view-i2-label')).toHaveTextContent('package.json');
    });

    it('should show folder and file icons when showIcons is applied', () => {
      render(<TreeView data={mockStaticData} showIcons testId='tree-view' />);

      const srcButton = screen.getByTestId('tree-view-i1-node-as-button');
      const packageButton = screen.getByTestId('tree-view-i2-node-as-button');

      expect(srcButton).toHaveTextContent('📁');
      expect(packageButton).toHaveTextContent('📄');
    });

    it('should expand folder when expand button is clicked', () => {
      render(<TreeView data={mockStaticData} testId='tree-view' />);

      // Initially items should not be visible
      expect(screen.queryByTestId('tree-view-i1-i1')).not.toBeInTheDocument();

      // Click the expand button
      const expandButton = screen.getByTestId('tree-view-i1-expand-button');
      fireEvent.click(expandButton);

      // Now items should be visible
      expect(screen.getByTestId('tree-view-i1-i1-label')).toHaveTextContent('components');
      expect(screen.getByTestId('tree-view-i1-i2-label')).toHaveTextContent('App.tsx');
    });

    it('should call onNodeClick when node is clicked', () => {
      const mockOnNodeClick = jest.fn();
      render(<TreeView data={mockStaticData} onNodeClick={mockOnNodeClick} testId='tree-view' />);

      const packageJsonButton = screen.getByTestId('tree-view-i2-node-as-button');
      fireEvent.click(packageJsonButton);

      expect(mockOnNodeClick).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '6',
          name: 'package.json',
          type: 'file',
        }),
      );
    });

    it('should expand on node click when expandOnClick is true', () => {
      render(<TreeView data={mockStaticData} shouldExpandOnClick testId='tree-view' />);

      // Initially items should not be visible
      expect(screen.queryByTestId('tree-view-i1-i1')).not.toBeInTheDocument();

      // Click the folder button
      const srcButton = screen.getByTestId('tree-view-i1-node-as-button');
      fireEvent.click(srcButton);

      // Now items should be visible
      expect(screen.getByTestId('tree-view-i1-i1-label')).toHaveTextContent('components');
    });
  });

  describe('Dynamic Configuration', () => {
    it('should call onNodeExpand when expanding a folder', async () => {
      const mockItems: Array<TreeNode> = [
        { id: 'child1', name: 'src', type: 'folder' },
        { id: 'child2', name: 'dist', type: 'folder' },
      ];

      const mockOnNodeExpand = jest.fn().mockResolvedValue(mockItems);

      render(<TreeView data={mockDynamicData} onNodeExpand={mockOnNodeExpand} testId='tree-view' />);

      // Click the expand button for project folder
      const expandButton = screen.getByTestId('tree-view-i1-expand-button');
      fireEvent.click(expandButton);

      expect(mockOnNodeExpand).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'root',
          name: 'project',
          type: 'folder',
        }),
      );

      // Wait for items to be loaded and displayed
      await waitFor(() => {
        expect(screen.getByTestId('tree-view-i1-i1-label')).toHaveTextContent('src');
      });

      await waitFor(() => {
        expect(screen.getByTestId('tree-view-i1-i2-label')).toHaveTextContent('dist');
      });
    });

    it('should show loading state while expanding', async () => {
      const mockOnNodeExpand = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve([]), 100);
          }),
      );

      render(<TreeView data={mockDynamicData} onNodeExpand={mockOnNodeExpand} testId='tree-view' />);

      // Click the expand button for project folder
      const expandButton = screen.getByTestId('tree-view-i1-expand-button');
      fireEvent.click(expandButton);

      // Should show loading state
      expect(screen.getByTestId('tree-view-i1-is-loading')).toHaveTextContent('Loading...');

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('tree-view-i1-is-loading')).not.toBeInTheDocument();
      });
    });

    it('should handle onNodeExpand errors gracefully', async () => {
      const mockOnNodeExpand = jest.fn().mockRejectedValue(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<TreeView data={mockDynamicData} onNodeExpand={mockOnNodeExpand} testId='tree-view' />);

      // Click the expand button for project folder
      const expandButton = screen.getByTestId('tree-view-i1-expand-button');
      fireEvent.click(expandButton);

      // Wait for error handling
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error loading items:', expect.any(Error));
      });

      await waitFor(() => {
        expect(screen.queryByTestId('tree-view-i1-is-loading')).not.toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Custom Rendering', () => {
    it('should use custom renderNode function', () => {
      const mockRenderNode = jest
        .fn()
        .mockImplementation((props: any) => (
          <div data-test-id={`custom-${props.node.id}`}>Custom: {props.node.name}</div>
        ));

      render(<TreeView data={mockStaticData} renderNode={mockRenderNode} />);

      expect(screen.getByTestId('custom-1')).toHaveTextContent('Custom: src');
      expect(screen.getByTestId('custom-6')).toHaveTextContent('Custom: package.json');
    });
  });

  describe('Styling and Layout', () => {
    it('should apply custom className', () => {
      render(<TreeView data={mockStaticData} className='custom-tree' testId='tree-view-container' />);

      const treeView = screen.getByTestId('tree-view-container');
      expect(treeView).toHaveClass('custom-tree');
    });

    it('should apply custom indentSize', () => {
      render(<TreeView data={mockStaticData} indentSize={32} testId='tree-view' />);

      // Expand the src folder to see indented items
      const expandButton = screen.getByTestId('tree-view-i1-expand-button');
      fireEvent.click(expandButton);

      // Check that items have proper indentation
      const componentsButton = screen.getByTestId('tree-view-i1-i1-node-as-button');
      expect(componentsButton).toHaveStyle('margin-left: 32px');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data array', () => {
      render(<TreeView data={[]} testId='tree-view-container' />);

      const treeView = screen.getByTestId('tree-view-container');
      expect(treeView).toBeInTheDocument();
    });

    it('should generate correct test IDs for tree nodes', () => {
      render(<TreeView data={mockStaticData} testId='tree-view' />);

      // Check root level nodes have correct test IDs
      const srcNode = screen.getByTestId('tree-view-i1');
      expect(srcNode).toBeInTheDocument();
      expect(srcNode).toHaveTextContent('src');

      const packageJsonNode = screen.getByTestId('tree-view-i2');
      expect(packageJsonNode).toBeInTheDocument();
      expect(packageJsonNode).toHaveTextContent('package.json');

      // Expand src folder to access its children
      const srcExpandButton = screen.getByTestId('tree-view-i1-expand-button');
      fireEvent.click(srcExpandButton);

      // Check second level nodes have correct test IDs
      const componentsNode = screen.getByTestId('tree-view-i1-i1');
      expect(componentsNode).toBeInTheDocument();
      expect(componentsNode).toHaveTextContent('components');

      const appTsxNode = screen.getByTestId('tree-view-i1-i2');
      expect(appTsxNode).toBeInTheDocument();
      expect(appTsxNode).toHaveTextContent('App.tsx');

      // Expand components folder to access its children
      const componentsExpandButton = screen.getByTestId('tree-view-i1-i1-expand-button');
      fireEvent.click(componentsExpandButton);

      // Check third level nodes have correct test IDs
      const buttonTsxNode = screen.getByTestId('tree-view-i1-i1-i1');
      expect(buttonTsxNode).toBeInTheDocument();
      expect(buttonTsxNode).toHaveTextContent('Button.tsx');

      const inputTsxNode = screen.getByTestId('tree-view-i1-i1-i2');
      expect(inputTsxNode).toBeInTheDocument();
      expect(inputTsxNode).toHaveTextContent('Input.tsx');
    });
  });

  describe('Selection Functionality', () => {
    it('should call onSelectedNodeIdChange when a node is clicked', () => {
      const mockOnSelectedNodeIdChange = jest.fn();

      render(<TreeView data={mockStaticData} onSelectedNodeIdChange={mockOnSelectedNodeIdChange} testId='tree-view' />);

      const packageJsonButton = screen.getByTestId('tree-view-i2-node-as-button');
      fireEvent.click(packageJsonButton);

      expect(mockOnSelectedNodeIdChange).toHaveBeenCalledWith('6');
    });

    it('should show selected state when initialSelectedNodeId matches node id', () => {
      render(<TreeView data={mockStaticData} initialSelectedNodeId='6' testId='tree-view' />);

      const packageJsonButton = screen.getByTestId('tree-view-i2-node-as-button');
      expect(packageJsonButton).toHaveClass('selected');
    });

    it('should not call onSelectedNodeIdChange when clicking an already selected node', () => {
      const mockOnSelectedNodeIdChange = jest.fn();

      render(
        <TreeView
          data={mockStaticData}
          onSelectedNodeIdChange={mockOnSelectedNodeIdChange}
          initialSelectedNodeId='6'
          testId='tree-view'
        />,
      );

      const packageJsonButton = screen.getByTestId('tree-view-i2-node-as-button');
      fireEvent.click(packageJsonButton);

      // Should not call the callback when clicking the same node
      expect(mockOnSelectedNodeIdChange).not.toHaveBeenCalled();
    });

    it('should select a different node when clicked', () => {
      const mockOnSelectedNodeIdChange = jest.fn();

      render(
        <TreeView
          data={mockStaticData}
          onSelectedNodeIdChange={mockOnSelectedNodeIdChange}
          initialSelectedNodeId='6' // package.json is selected
          testId='tree-view'
        />,
      );

      // Expand src folder first
      const expandButton = screen.getByTestId('tree-view-i1-expand-button');
      fireEvent.click(expandButton);

      // Click on App.tsx
      const appTsxButton = screen.getByTestId('tree-view-i1-i2-node-as-button');
      fireEvent.click(appTsxButton);

      expect(mockOnSelectedNodeIdChange).toHaveBeenCalledWith('5');
    });
  });
});
