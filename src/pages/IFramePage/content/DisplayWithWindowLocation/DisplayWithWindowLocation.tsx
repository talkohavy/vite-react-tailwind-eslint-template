export default function DisplayWithWindowLocation() {
  return (
    <div className='size-full flex flex-col gap-4 border p-2 rounded-lg'>
      <h2 className='font-bold text-2xl text-blue-500'>Accessing Window.location Directly</h2>

      <div className='flex gap-14'>
        <strong>Current Path:</strong>
        <div>{window.location.pathname}</div>
      </div>

      <div className='flex gap-5'>
        <strong>Current Location:</strong>
        <div>
          <pre>{JSON.stringify(window.location, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
