import { useRef, useState } from 'react';
import LoadingBumpingBalls from '../../components/beautiful/LoadingBumpingBalls';
import Button from '../../components/controls/Button';
import { httpClient } from '../../lib/HttpClient';

export default function ServerCall() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const abortRef = useRef<(() => void) | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await httpClient.get('/api/users').promise;

      console.log('response is:', data);

      setData('data loaded successfully!');
    } catch (error) {
      setError(error);
    }
  };

  const createUser = async () => {
    try {
      setIsLoading(true);
      const { promise, abort } = httpClient.post('/api/users', {
        body: {
          name: 'John Doe',
          email: 'talkohavy@example.com',
        },
      });

      abortRef.current = abort;
      const data = await promise;

      console.log('response is:', data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-6 size-full p-4'>
      <div className='flex gap-2'>
        <Button onClick={fetchUsers}>Fetch Users</Button>

        <Button onClick={createUser}>Create User</Button>

        <Button onClick={() => abortRef.current?.()}>Abort</Button>
      </div>

      {isLoading && <LoadingBumpingBalls />}

      <div>data: {data && JSON.stringify(data)}</div>
      <div>error: {error?.message}</div>
    </div>
  );
}
