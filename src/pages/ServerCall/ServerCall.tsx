import { useEffect, useState } from 'react';
import { httpClient } from '../../lib/HttpClient';

export default function ServerCall() {
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await httpClient.get('/');

        console.log('response is:', response);

        setData(response);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className='w-full p-4'>
      <div>hello world</div>

      <hr />
      <br />

      <div>data: {data && JSON.stringify(data)}</div>
      <div>error: {error?.message}</div>
    </div>
  );
}
