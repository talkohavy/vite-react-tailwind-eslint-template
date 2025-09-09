import type { ParseError } from '../../../../../../../../lib/QueryLanguage/QueryParser';

type ParseErrorDisplayerProps = {
  errors: ParseError[];
};

export default function ParseErrorDisplayer(props: ParseErrorDisplayerProps) {
  const { errors } = props;

  return (
    <div className='mt-4 p-4 bg-red-900 border border-red-700 rounded'>
      <h4 className='text-sm font-semibold mb-2 text-red-200'>Parse Errors:</h4>
      <div className='space-y-2'>
        {errors.map((error, index) => (
          <div key={index} className='text-sm text-red-300'>
            <div className='font-mono'>
              Position {error.position.start}-{error.position.end}: {error.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
