import type { ASTNode, Token } from '../../../../../../lib/QueryLanguage';
import type { WhitespaceContext } from '../../../../../../lib/QueryLanguage/QueryParser/types';

interface CursorPositionInfoProps {
  cursorPosition: number;
  currentToken: Token | null;
  currentASTNode: (ASTNode & { value?: any }) | null;
  whitespaceContext: WhitespaceContext | null;
}

export default function CursorPositionInfo(props: CursorPositionInfoProps) {
  const { cursorPosition, currentToken, currentASTNode, whitespaceContext } = props;

  return (
    <div className='bg-gray-800 rounded-lg p-4'>
      <h3 className='text-lg font-semibold text-gray-200 mb-2'>Cursor Position: {cursorPosition}</h3>

      {/* Whitespace Context Information */}
      {whitespaceContext && (
        <div className='mb-4 p-3 bg-gray-700 rounded border-l-4 border-orange-500'>
          <h4 className='text-md font-semibold text-orange-300 mb-1'>Whitespace Context:</h4>
          <div className='text-sm text-gray-300 font-mono space-y-1'>
            <div>
              Type: <span className='text-orange-400'>{whitespaceContext.type}</span>
            </div>
            <div>
              Description: <span className='text-orange-200'>{whitespaceContext.description}</span>
            </div>
            <div>
              Expected:{' '}
              {whitespaceContext.expectedTokens.map((token, index) => (
                <span key={token} className='text-yellow-400'>
                  {token}
                  {index < whitespaceContext.expectedTokens.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
            <div>
              Position:{' '}
              <span className='text-yellow-400'>
                {whitespaceContext.position.start}-{whitespaceContext.position.end}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Current Token Information */}
      {currentToken && (
        <div className='mb-2'>
          <h4 className='text-md font-semibold text-blue-300'>Current Token:</h4>
          <div className='text-sm text-gray-300 font-mono'>
            Type: <span className='text-blue-400'>{currentToken.type}</span>
            <br />
            Value: <span className='text-green-400'>"{currentToken.value}"</span>
            <br />
            Position:{' '}
            <span className='text-yellow-400'>
              {currentToken.position.start}-{currentToken.position.end}
            </span>
          </div>
        </div>
      )}

      {/* Current AST Node Information */}
      {currentASTNode && (
        <div>
          <h4 className='text-md font-semibold text-purple-300'>Current AST Node:</h4>
          <div className='text-sm text-gray-300 font-mono'>
            Type: <span className='text-purple-400'>{currentASTNode.type}</span>
            <br />
            {currentASTNode.value && (
              <>
                Value:{' '}
                <span className='text-green-400'>
                  "
                  {typeof currentASTNode.value === 'object'
                    ? JSON.stringify(currentASTNode.value)
                    : currentASTNode.value}
                  "
                </span>
                <br />
              </>
            )}
            Position:{' '}
            <span className='text-yellow-400'>
              {currentASTNode.position.start}-{currentASTNode.position.end}
            </span>
          </div>
        </div>
      )}

      {/* Fallback Message */}
      {!currentToken && !currentASTNode && !whitespaceContext && (
        <div className='text-gray-400 text-sm'>
          No token, AST node, or whitespace context found at cursor position {cursorPosition}
        </div>
      )}

      {/* Helpful Tips */}
      {whitespaceContext && (
        <div className='mt-3 p-2 bg-blue-900 bg-opacity-30 rounded text-xs text-blue-200'>
          💡 <strong>Tip:</strong> The parser can now intelligently predict what should come after whitespace based on
          context!
        </div>
      )}
    </div>
  );
}
