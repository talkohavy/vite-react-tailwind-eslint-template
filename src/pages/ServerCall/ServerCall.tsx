import { useEffect, useState } from 'react';
import { httpClient } from '../../lib/HttpClient';

export default function ServerCall() {
  const [data, setData] = useState<any>();

  console.log('data is:', data);

  useEffect(() => {
    async function fetchData() {
      const response = await httpClient.get('http://localhost:8000');

      console.log('response is:', response);

      setData(response);
    }

    fetchData();
  }, []);

  return <div>hello world</div>;
}
