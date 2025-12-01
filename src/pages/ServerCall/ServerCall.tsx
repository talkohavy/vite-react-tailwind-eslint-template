import { useRef, useState } from 'react';
import LoadingBumpingBalls from '../../components/beautiful/LoadingBumpingBalls';
import Button from '../../components/controls/Button';
import { httpClient } from '../../lib/HttpClient';

export default function ServerCall() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [requestInfo, setRequestInfo] = useState<{ method: string; url: string; requestId: string } | null>(null);
  const abortRef = useRef<(() => void) | null>(null);

  const fetchUsers = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const { promise, requestInfo: info } = httpClient.get('/api/users');
      setRequestInfo({ method: 'GET', url: info.url, requestId: info.requestId });

      const data = await promise;
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const {
        promise,
        abort,
        requestInfo: info,
      } = httpClient.post('/api/users', {
        body: {
          name: 'John Doe',
          email: 'talkohavy@example.com',
        },
      });

      setRequestInfo({ method: 'POST', url: info.url, requestId: info.requestId });
      abortRef.current = abort;
      const data = await promise;

      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handleAbort = () => {
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
      setIsLoading(false);
      setError({ message: 'Request aborted by user' });
    }
  };

  return (
    <div className='size-full overflow-auto bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8'>
      <div className='flex flex-col gap-10 max-w-5xl mx-auto space-y-6'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>HTTP Client Demo</h1>
          <p className='text-gray-600 dark:text-gray-400'>Test API requests with real-time abort capability</p>
        </div>

        {/* Action Buttons Card */}
        <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Actions</h2>
          <div className='flex flex-wrap gap-3'>
            <Button
              onClick={fetchUsers}
              disabled={isLoading}
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
            >
              📥 Fetch Users
            </Button>

            <Button
              onClick={createUser}
              disabled={isLoading}
              className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
            >
              ➕ Create User
            </Button>

            {isLoading && (
              <Button
                onClick={handleAbort}
                className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg'
              >
                ⛔ Abort Request
              </Button>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700'>
            <div className='flex flex-col items-center gap-4'>
              <LoadingBumpingBalls />
              <p className='text-gray-600 dark:text-gray-400 font-medium'>Processing request...</p>
              {requestInfo && (
                <div className='text-sm text-gray-500 dark:text-gray-500 text-center'>
                  <div>
                    <span className='font-semibold'>{requestInfo.method}</span> {requestInfo.url}
                  </div>
                  <div className='font-mono text-xs mt-1'>ID: {requestInfo.requestId}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Request Info */}
        {requestInfo && !isLoading && (
          <div className='bg-linear-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg p-6 border border-indigo-200 dark:border-indigo-800'>
            <h2 className='text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2'>
              📡 Last Request Info
            </h2>
            <div className='space-y-2 font-mono text-sm'>
              <div className='flex items-center gap-2'>
                <span className='font-semibold text-indigo-700 dark:text-indigo-400'>Method:</span>
                <span className='px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-bold'>
                  {requestInfo.method}
                </span>
              </div>
              <div>
                <span className='font-semibold text-indigo-700 dark:text-indigo-400'>URL:</span>
                <span className='text-gray-700 dark:text-gray-300 ml-2'>{requestInfo.url}</span>
              </div>
              <div>
                <span className='font-semibold text-indigo-700 dark:text-indigo-400'>Request ID:</span>
                <span className='text-gray-700 dark:text-gray-300 ml-2 text-xs'>{requestInfo.requestId}</span>
              </div>
            </div>
          </div>
        )}

        {/* Success Response */}
        {data && !error && !isLoading && (
          <div className='bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-800'>
            <h2 className='text-lg font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2'>
              ✅ Success Response
            </h2>
            <pre className='bg-white dark:bg-slate-900 rounded-lg p-4 overflow-auto text-sm border border-green-200 dark:border-green-800'>
              <code className='text-gray-800 dark:text-gray-200'>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
        )}

        {/* Error Response */}
        {error && (
          <div className='bg-linear-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg p-6 border border-red-200 dark:border-red-800'>
            <h2 className='text-lg font-semibold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2'>
              ❌ Error
            </h2>
            <div className='bg-white dark:bg-slate-900 rounded-lg p-4 border border-red-200 dark:border-red-800'>
              <p className='text-red-700 dark:text-red-400 font-semibold mb-2'>
                {error?.message || 'An error occurred'}
              </p>
              {error?.status && (
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Status Code: <span className='font-mono font-bold'>{error.status}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Info Card */}
        {!data && !error && !isLoading && (
          <div className='bg-linear-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl shadow-lg p-6 border border-amber-200 dark:border-amber-800'>
            <h2 className='text-lg font-semibold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2'>
              💡 Getting Started
            </h2>
            <div className='text-amber-800 dark:text-amber-300 space-y-2'>
              <p>Click one of the buttons above to make an API request.</p>
              <ul className='list-disc list-inside space-y-1 text-sm ml-2'>
                <li>
                  <strong>Fetch Users</strong> - GET request to retrieve data
                </li>
                <li>
                  <strong>Create User</strong> - POST request to create a new user
                </li>
                <li>
                  <strong>Abort Request</strong> - Cancel an ongoing request (appears when loading)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
