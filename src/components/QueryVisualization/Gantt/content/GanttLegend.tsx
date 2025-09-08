import { AST_COLORS, TOKEN_COLORS } from '../../logic/constants';

export default function GanttLegend() {
  return (
    <div className='mt-6 p-4 bg-gray-800 rounded'>
      <h4 className='text-sm font-semibold mb-3 text-gray-300'>Legend</h4>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <h5 className='text-xs font-semibold mb-2 text-gray-400'>Token Types:</h5>

          <div className='space-y-1'>
            {Object.entries(TOKEN_COLORS).map(([type, color]) => (
              <div key={type} className='flex items-center space-x-2'>
                <div className='w-3 h-3 rounded' style={{ backgroundColor: color }} />
                <span className='text-xs font-mono'>{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className='text-xs font-semibold mb-2 text-gray-400'>AST Node Types:</h5>

          <div className='space-y-1'>
            {Object.entries(AST_COLORS).map(([type, color]) => (
              <div key={type} className='flex items-center space-x-2'>
                <div className='w-3 h-3 rounded' style={{ backgroundColor: color }} />
                <span className='text-xs font-mono'>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
