export default function HostTab2() {
  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>HostTab2</h2>

      <a
        href='http://localhost:3004/base/iframe/host-route-2'
        target='_blank'
        rel='noopener'
        className='text-blue-600 hover:underline hover:text-red-500'
      >
        http://localhost:3004/base/iframe/host-route-2
      </a>
    </div>
  );
}
