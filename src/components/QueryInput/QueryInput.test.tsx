import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryInput } from '../QueryInput';

describe('QueryInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    availableKeys: ['name', 'email', 'status'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders correctly', () => {
      render(<QueryInput {...defaultProps} />);

      const input = screen.getByTestId('query-input-base');
      expect(input).toBeInTheDocument();
    });

    it('displays placeholder text', () => {
      const placeholder = 'Enter your query...';
      render(<QueryInput {...defaultProps} placeholder={placeholder} />);

      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toBeInTheDocument();
    });

    it('calls onChange when input value changes', () => {
      const onChange = jest.fn();
      render(<QueryInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByTestId('query-input-base');
      fireEvent.change(input, { target: { value: 'test query' } });

      expect(onChange).toHaveBeenCalledWith('test query');
    });

    it('displays initial value', () => {
      const initialValue = 'name: John';
      render(<QueryInput {...defaultProps} value={initialValue} />);

      const input = screen.getByDisplayValue(initialValue);
      expect(input).toBeInTheDocument();
    });
  });

  describe('Auto-completion', () => {
    it('shows completion dropdown when typing', async () => {
      const onChange = jest.fn();
      render(<QueryInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByTestId('query-input-base');

      // Focus the input and start typing
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'n' } });

      // Wait for completions to appear
      await waitFor(() => {
        const dropdown = screen.queryByTestId('completion-dropdown');
        expect(dropdown).toBeInTheDocument();
      });
    });

    it('hides completion dropdown on escape', async () => {
      const onChange = jest.fn();
      render(<QueryInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByTestId('query-input-base');

      // Focus and type to show completions
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'n' } });

      // Wait for dropdown to appear
      await waitFor(() => {
        expect(screen.getByTestId('completion-dropdown')).toBeInTheDocument();
      });

      // Press escape
      fireEvent.keyDown(input, { key: 'Escape' });

      // Dropdown should be hidden
      expect(screen.queryByTestId('completion-dropdown')).not.toBeInTheDocument();
    });

    it('navigates completions with arrow keys', async () => {
      const onChange = jest.fn();
      render(<QueryInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByTestId('query-input-base');

      // Focus and type to show completions
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'n' } });

      // Wait for completions
      await waitFor(() => {
        expect(screen.getByTestId('completion-dropdown')).toBeInTheDocument();
      });

      // Test arrow navigation
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });

      // Should not throw errors
      expect(screen.getByTestId('completion-dropdown')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('shows validation errors for invalid queries', async () => {
      const onValidationChange = jest.fn();
      render(
        <QueryInput
          {...defaultProps}
          value='invalid query without colon'
          showValidation={true}
          onValidationChange={onValidationChange}
        />,
      );

      // Wait for validation to run
      await waitFor(() => {
        expect(onValidationChange).toHaveBeenCalledWith(false, expect.any(Array));
      });
    });

    it('shows valid status for correct queries', async () => {
      const onValidationChange = jest.fn();
      render(
        <QueryInput
          {...defaultProps}
          value='name: John'
          showValidation={true}
          onValidationChange={onValidationChange}
        />,
      );

      // Wait for validation to run
      await waitFor(() => {
        expect(onValidationChange).toHaveBeenCalledWith(true, []);
      });
    });

    it('displays validation errors in UI when showValidation is true', async () => {
      render(<QueryInput {...defaultProps} value='invalid' showValidation={true} />);

      // Wait for errors to appear
      await waitFor(() => {
        const errors = screen.queryByTestId('query-input-errors');
        expect(errors).toBeInTheDocument();
      });
    });

    it('hides validation errors when showValidation is false', () => {
      render(<QueryInput {...defaultProps} value='invalid' showValidation={false} />);

      const errors = screen.queryByTestId('query-input-errors');
      expect(errors).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('supports keyboard navigation', () => {
      render(<QueryInput {...defaultProps} />);

      const input = screen.getByTestId('query-input-base');
      expect(input).toBeInTheDocument();

      // Should be focusable
      input.focus();
      expect(document.activeElement).toBe(input);
    });

    it('supports autoFocus prop', () => {
      render(<QueryInput {...defaultProps} autoFocus={true} />);

      const input = screen.getByTestId('query-input-base');
      expect(input).toHaveFocus();
    });

    it('supports disabled state', () => {
      render(<QueryInput {...defaultProps} disabled={true} />);

      const input = screen.getByTestId('query-input-base');
      expect(input).toBeDisabled();
    });
  });

  describe('Configuration', () => {
    it('uses provided available keys for completions', async () => {
      const customKeys = ['customKey1', 'customKey2'];
      const onChange = jest.fn();

      render(<QueryInput {...defaultProps} availableKeys={customKeys} onChange={onChange} />);

      const input = screen.getByTestId('query-input-base');

      // Type to trigger completions
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'c' } });

      // Should show completions based on custom keys
      await waitFor(() => {
        expect(screen.queryByTestId('completion-dropdown')).toBeInTheDocument();
      });
    });

    it('updates completions when available keys change', () => {
      const { rerender } = render(<QueryInput {...defaultProps} />);

      // Change available keys
      const newKeys = ['newKey1', 'newKey2'];
      rerender(<QueryInput {...defaultProps} availableKeys={newKeys} />);

      // Component should handle the update without errors
      expect(screen.getByTestId('query-input-base')).toBeInTheDocument();
    });
  });
});
