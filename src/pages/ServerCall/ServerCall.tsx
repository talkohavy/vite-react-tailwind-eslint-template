import { useState } from 'react';
import Button from '../../components/controls/Button';
import { httpClient } from '../../lib/HttpClient';

export default function ServerCall() {
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();

  const fetchUsers = async () => {
    try {
      const data = await httpClient.get('/users').promise;

      console.log('response is:', data);

      setData('data loaded successfully!');
    } catch (error) {
      setError(error);
    }
  };

  const createUser = async () => {
    try {
      const data = await httpClient.post('/users', {
        body: {
          name: 'John Doe',
          email: 'talkohavy@example.com',
        },
      }).promise;

      console.log('response is:', data);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className='flex flex-col gap-6 size-full p-4'>
      <div>data: {data && JSON.stringify(data)}</div>
      <div>error: {error?.message}</div>

      <div className='flex gap-2'>
        <Button onClick={fetchUsers}>Fetch Users</Button>

        <Button onClick={createUser}>Create User</Button>
      </div>
    </div>
  );
}
