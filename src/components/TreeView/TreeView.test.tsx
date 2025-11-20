import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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
      render(<TreeView data={mockStaticData} />);

      expect(screen.getByText('src')).toBeInTheDocument();
      expect(screen.getByText('package.json')).toBeInTheDocument();
    });

    it('should show folder and file icons when showIcons is applied', () => {
      render(<TreeView data={mockStaticData} showIcons />);

      const srcFolder = screen.getByRole('button', { name: /📁.*src/ });
      const packageFile = screen.getByRole('button', { name: /📄.*package\.json/ });

      expect(srcFolder).toHaveTextContent('📁');
      expect(packageFile).toHaveTextContent('📄');
    });

    it('should expand folder when expand button is clicked', () => {
      render(<TreeView data={mockStaticData} />);

      // Initially items should not be visible
      expect(screen.queryByText('components')).not.toBeInTheDocument();

      // Get the main src button and use within to find the nested expand button
      const srcButton = screen.getByRole('button', { name: 'src' });
      const expandButton = within(srcButton).getByRole('button');

      fireEvent.click(expandButton);

      // Now items should be visible
      expect(screen.getByText('components')).toBeInTheDocument();
      expect(screen.getByText('App.tsx')).toBeInTheDocument();
    });

    it('should call onNodeClick when node is clicked', () => {
      const mockOnNodeClick = jest.fn();
      render(<TreeView data={mockStaticData} onNodeClick={mockOnNodeClick} />);

      fireEvent.click(screen.getByText('package.json'));

      expect(mockOnNodeClick).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '6',
          name: 'package.json',
          type: 'file',
        }),
      );
    });

    it('should expand on node click when expandOnClick is true', () => {
      render(<TreeView data={mockStaticData} shouldExpandOnClick />);

      // Initially items should not be visible
      expect(screen.queryByText('components')).not.toBeInTheDocument();

      // Click the folder name
      fireEvent.click(screen.getByText('src'));

      // Now items should be visible
      expect(screen.getByText('components')).toBeInTheDocument();
    });
  });

  describe('Dynamic Configuration', () => {
    it('should call onNodeExpand when expanding a folder', async () => {
      const mockItems: Array<TreeNode> = [
        { id: 'child1', name: 'src', type: 'folder' },
        { id: 'child2', name: 'dist', type: 'folder' },
      ];

      const mockOnNodeExpand = jest.fn().mockResolvedValue(mockItems);

      render(<TreeView data={mockDynamicData} onNodeExpand={mockOnNodeExpand} />);

      // Click the expand button for project folder
      const projectButton = screen.getByRole('button', { name: 'project' });
      const expandButton = within(projectButton).getByRole('button');

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
        expect(screen.getByText('src')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('dist')).toBeInTheDocument();
      });
    });

    it('should show loading state while expanding', async () => {
      const mockOnNodeExpand = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve([]), 100);
          }),
      );

      render(<TreeView data={mockDynamicData} onNodeExpand={mockOnNodeExpand} />);

      // Click the expand button for project folder
      const projectButton = screen.getByRole('button', { name: 'project' });
      const expandButton = within(projectButton).getByRole('button');

      fireEvent.click(expandButton);

      // Should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should handle onNodeExpand errors gracefully', async () => {
      const mockOnNodeExpand = jest.fn().mockRejectedValue(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<TreeView data={mockDynamicData} onNodeExpand={mockOnNodeExpand} />);

      // Click the expand button for project folder
      const projectButton = screen.getByRole('button', { name: 'project' });
      const expandButton = within(projectButton).getByRole('button');

      fireEvent.click(expandButton);

      // Wait for error handling
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error loading items:', expect.any(Error));
      });

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Custom Rendering', () => {
    it('should use custom renderNode function', () => {
      const mockRenderNode = jest
        .fn()
        .mockImplementation((node: TreeNode) => <div data-test-id={`custom-${node.id}`}>Custom: {node.name}</div>);

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
      render(<TreeView data={mockStaticData} indentSize={32} />);

      // Expand the src folder to see indented items
      const srcButton = screen.getByRole('button', { name: 'src' });
      const expandButton = within(srcButton).getByRole('button');
      fireEvent.click(expandButton);

      // Check that items have proper indentation
      const componentsButton = screen.getByRole('button', { name: 'components' });
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
      render(<TreeView data={mockStaticData} />);

      // Check root level nodes have correct test IDs
      const srcNode = screen.getByTestId('i1');
      expect(srcNode).toBeInTheDocument();
      expect(srcNode).toHaveTextContent('src');

      const packageJsonNode = screen.getByTestId('i2');
      expect(packageJsonNode).toBeInTheDocument();
      expect(packageJsonNode).toHaveTextContent('package.json');

      // Expand src folder to access its children
      const srcButton = screen.getByRole('button', { name: 'src' });
      const srcExpandButton = within(srcButton).getByRole('button');
      fireEvent.click(srcExpandButton);

      // Check second level nodes have correct test IDs
      const componentsNode = screen.getByTestId('i1-i1');
      expect(componentsNode).toBeInTheDocument();
      expect(componentsNode).toHaveTextContent('components');

      const appTsxNode = screen.getByTestId('i1-i2');
      expect(appTsxNode).toBeInTheDocument();
      expect(appTsxNode).toHaveTextContent('App.tsx');

      // Expand components folder to access its children
      const componentsButton = screen.getByRole('button', { name: 'components' });
      const componentsExpandButton = within(componentsButton).getByRole('button');
      fireEvent.click(componentsExpandButton);

      // Check third level nodes have correct test IDs
      const buttonTsxNode = screen.getByTestId('i1-i1-i1');
      expect(buttonTsxNode).toBeInTheDocument();
      expect(buttonTsxNode).toHaveTextContent('Button.tsx');

      const inputTsxNode = screen.getByTestId('i1-i1-i2');
      expect(inputTsxNode).toBeInTheDocument();
      expect(inputTsxNode).toHaveTextContent('Input.tsx');
    });
  });

  describe('Selection Functionality', () => {
    it('should call onSelectedNodeIdChange when a node is clicked', () => {
      const mockOnSelectedNodeIdChange = jest.fn();

      render(<TreeView data={mockStaticData} onSelectedNodeIdChange={mockOnSelectedNodeIdChange} />);

      const packageJsonNode = screen.getByTestId('i2');
      fireEvent.click(packageJsonNode);

      expect(mockOnSelectedNodeIdChange).toHaveBeenCalledWith('6');
    });

    it('should show selected state when initialSelectedNodeId matches node id', () => {
      render(<TreeView data={mockStaticData} initialSelectedNodeId='6' />);

      const packageJsonNode = screen.getByTestId('i2');
      expect(packageJsonNode).toHaveClass('selected');
    });

    it('should not call onSelectedNodeIdChange when clicking an already selected node', () => {
      const mockOnSelectedNodeIdChange = jest.fn();

      render(
        <TreeView
          data={mockStaticData}
          onSelectedNodeIdChange={mockOnSelectedNodeIdChange}
          initialSelectedNodeId='6'
        />,
      );

      const packageJsonNode = screen.getByTestId('i2');
      fireEvent.click(packageJsonNode);

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
        />,
      );

      // Click on App.tsx (which requires expanding the src folder first)
      const srcButton = screen.getByRole('button', { name: 'src' });
      const expandButton = within(srcButton).getByRole('button');
      fireEvent.click(expandButton); // Expand src folder

      const appTsxNode = screen.getByTestId('i1-i2');
      fireEvent.click(appTsxNode);

      expect(mockOnSelectedNodeIdChange).toHaveBeenCalledWith('5');
    });
  });
});
