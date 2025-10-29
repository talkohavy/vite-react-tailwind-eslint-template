import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { TreeNode } from './types';
import TreeView from './TreeView';

const mockStaticData: Array<TreeNode> = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        children: [
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

    it('should show folder and file icons by default', () => {
      render(<TreeView data={mockStaticData} />);

      const srcFolder = screen.getByText('src').parentElement;
      const packageFile = screen.getByText('package.json').parentElement;

      expect(srcFolder).toHaveTextContent('📁');
      expect(packageFile).toHaveTextContent('📄');
    });

    it('should hide icons when showIcons is false', () => {
      render(<TreeView data={mockStaticData} showIcons={false} />);

      const srcFolder = screen.getByText('src').parentElement;
      const packageFile = screen.getByText('package.json').parentElement;

      expect(srcFolder).not.toHaveTextContent('📁');
      expect(packageFile).not.toHaveTextContent('📄');
    });

    it('should expand folder when expand button is clicked', () => {
      render(<TreeView data={mockStaticData} />);

      // Initially children should not be visible
      expect(screen.queryByText('components')).not.toBeInTheDocument();

      // Click the expand button for src folder
      const expandButton = screen.getByText('src').parentElement?.querySelector('button');
      expect(expandButton).toBeInTheDocument();

      if (expandButton) {
        fireEvent.click(expandButton);
      }

      // Now children should be visible
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
      render(<TreeView data={mockStaticData} expandOnClick={true} />);

      // Initially children should not be visible
      expect(screen.queryByText('components')).not.toBeInTheDocument();

      // Click the folder name
      fireEvent.click(screen.getByText('src'));

      // Now children should be visible
      expect(screen.getByText('components')).toBeInTheDocument();
    });
  });

  describe('Dynamic Configuration', () => {
    it('should call onNodeExpand when expanding a folder', async () => {
      const mockChildren: Array<TreeNode> = [
        { id: 'child1', name: 'src', type: 'folder' },
        { id: 'child2', name: 'dist', type: 'folder' },
      ];

      const mockOnNodeExpand = jest.fn().mockResolvedValue(mockChildren);

      render(<TreeView data={mockDynamicData} onNodeExpand={mockOnNodeExpand} />);

      // Click the expand button for project folder
      const expandButton = screen.getByText('project').parentElement?.querySelector('button');
      expect(expandButton).toBeInTheDocument();

      if (expandButton) {
        fireEvent.click(expandButton);
      }

      expect(mockOnNodeExpand).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'root',
          name: 'project',
          type: 'folder',
        }),
      );

      // Wait for children to be loaded and displayed
      await waitFor(() => {
        expect(screen.getByText('src')).toBeInTheDocument();
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
      const expandButton = screen.getByText('project').parentElement?.querySelector('button');

      if (expandButton) {
        fireEvent.click(expandButton);
      }

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
      const expandButton = screen.getByText('project').parentElement?.querySelector('button');

      if (expandButton) {
        fireEvent.click(expandButton);
      }

      // Wait for error handling
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error loading children:', expect.any(Error));
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Custom Rendering', () => {
    it('should use custom renderNode function', () => {
      const mockRenderNode = jest
        .fn()
        .mockImplementation((node: TreeNode, _defaultRender) => (
          <div data-test-id={`custom-${node.id}`}>Custom: {node.name}</div>
        ));

      render(<TreeView data={mockStaticData} renderNode={mockRenderNode} />);

      expect(screen.getByTestId('custom-1')).toHaveTextContent('Custom: src');
      expect(screen.getByTestId('custom-6')).toHaveTextContent('Custom: package.json');
    });
  });

  describe('Styling and Layout', () => {
    it('should apply custom className', () => {
      const { container } = render(<TreeView data={mockStaticData} className='custom-tree' />);

      const treeView = container.querySelector('.tree-view');
      expect(treeView).toHaveClass('custom-tree');
    });

    it('should apply custom indentSize', () => {
      render(<TreeView data={mockStaticData} indentSize={32} />);

      // Expand the src folder to see indented children
      const expandButton = screen.getByText('src').parentElement?.querySelector('button');
      if (expandButton) {
        fireEvent.click(expandButton);
      }

      // Check that children have proper indentation
      const componentsNode = screen.getByText('components').parentElement;
      expect(componentsNode).toHaveStyle('margin-left: 32px');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data array', () => {
      render(<TreeView data={[]} />);

      const treeView = screen.getByTestId('tree-view-container');
      expect(treeView).toBeInTheDocument();
    });

    it('should handle nodes without children property', () => {
      const dataWithoutChildren: Array<TreeNode> = [{ id: '1', name: 'file.txt', type: 'file' }];

      render(<TreeView data={dataWithoutChildren} />);

      expect(screen.getByText('file.txt')).toBeInTheDocument();
    });
  });
});
