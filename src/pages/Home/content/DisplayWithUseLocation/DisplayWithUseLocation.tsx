import { useLocation } from 'react-router';

export default function DisplayWithUseLocation() {
  const location = useLocation();

  return (
    <div className='size-full flex flex-col gap-4 border p-2 rounded-lg'>
      <h2 className='font-bold text-2xl text-blue-500'>Accessing location using useLocation</h2>

      <div className='flex gap-14'>
        <strong>Current Path:</strong>
        <div>{location.pathname}</div>
      </div>

      <div className='flex gap-5'>
        <strong>Current Location:</strong>
        <div>
          <pre>{JSON.stringify(location, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
