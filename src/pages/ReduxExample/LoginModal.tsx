import { useState } from 'react';
import ReactDom from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isUserLoadingSelector } from '../../store/slices/user/selectors';

// import { closeLoginModal } from '../../store/slices/modals/actions';
// import { startLoginFlow } from '../../store/slices/user/actions';

export default function LoginModal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const isUserLoading = useSelector(isUserLoadingSelector);

  return ReactDom.createPortal(
    <div
      data-test-id='login-modal'
      // onKeyDown={(e) => e.key === 'Escape' && dispatch(closeLoginModal())}
      // @ts-ignore - attributes does not exist on e.target
      onMouseDown={(e) => e.target.attributes['data-test-id']?.value === 'login-modal' && dispatch(closeLoginModal())}
      className='fixed left-0 top-0 z-50 flex size-full items-start overflow-auto bg-black bg-opacity-50 px-1 py-0'
      style={{ justifyContent: 'center' }}
    >
      <form className='relative top-20 flex h-auto w-full max-w-[500px] animate-appear flex-col gap-6 overflow-x-hidden rounded-3xl border border-black bg-white p-7 text-center dark:bg-[#383838] dark:text-sky-400'>
        <h2 className='text-xl font-bold'>Login to App</h2>

        <div>
          <div>Username:</div>
          <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} className='text-black' />
        </div>

        <div>
          <div>Password:</div>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='text-black'
          />
        </div>

        <div className='h-10'>{isUserLoading && <div>loading...</div>}</div>

        <button
          type='button'
          // @ts-ignore
          onClick={() => dispatch(startLoginFlow({ loginType: 'credentials', params: { username, password } }))}
          className='self-center rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400'
          disabled={isUserLoading}
        >
          Login
        </button>
      </form>
    </div>,
    document.body,
  );
}
