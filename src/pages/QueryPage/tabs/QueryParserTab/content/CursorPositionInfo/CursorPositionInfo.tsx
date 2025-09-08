import type { ASTNode, Token } from '../../../../../../lib/QueryLanguage';

type CursorPositionInfoProps = {
  cursorPosition: number;
  currentToken: Token | null;
  currentASTNode: (ASTNode & { value?: any }) | null;
};

export default function CursorPositionInfo(props: CursorPositionInfoProps) {
  const { cursorPosition, currentToken, currentASTNode } = props;

  return (
    <div className='bg-gray-800 rounded-lg p-4'>
      <h3 className='text-lg font-semibold text-gray-200 mb-2'>Cursor Position: {cursorPosition}</h3>

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

      {currentASTNode && currentASTNode.type !== 'condition' && (
        <div>
          <h4 className='text-md font-semibold text-purple-300'>Current AST Node:</h4>
          <div className='text-sm text-gray-300 font-mono'>
            Type: <span className='text-purple-400'>{currentASTNode.type}</span>
            <br />
            {currentASTNode.value && (
              <>
                Value: <span className='text-green-400'>"{currentASTNode.value}"</span>
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

      {!currentToken && !currentASTNode && (
        <div className='text-gray-400 text-sm'>No token or AST node found at cursor position {cursorPosition}</div>
      )}
    </div>
  );
}
