import Button from '../../components/controls/Button';
import { useQueryParams } from '../../hooks/useQueryParams';

export default function QueryParamsPage() {
  const { queryParams, setParam, resetAllQueryParams } = useQueryParams();

  return (
    <div className='flex flex-col gap-6 size-full p-4'>
      <div>
        Try adding this <code className='text-green-300'>?name=tal&age=28&arr=1&arr=2&nullValue=null</code> to the url.
      </div>

      <div className='flex gap-2'>
        <Button onClick={() => setParam('age', (queryParams.age as number) + 1)} className='w-44'>
          Add +1 to age
        </Button>

        <Button
          onClick={() =>
            window.history.pushState({}, '', `${window.location.pathname}?name=tal&age=28&arr=1&arr=2&nullValue=null`)
          }
          className='w-44'
        >
          Navigate to tal
        </Button>

        <Button
          onClick={() => window.history.pushState({}, '', `${window.location.pathname}?name=daniel&age=20`)}
          className='w-44'
        >
          Navigate to daniel
        </Button>

        <Button className='w-44' onClick={resetAllQueryParams}>
          Reset all query params
        </Button>
      </div>

      <div>
        <strong>Query params:</strong>

        <ul className='px-4'>
          {Object.entries(queryParams).map(([key, value]) => (
            <li key={key} className='list-disc'>
              {key}: {JSON.stringify(value)}, type: {typeof value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
