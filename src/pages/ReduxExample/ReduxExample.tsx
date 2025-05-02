import { useDispatch, useSelector } from 'react-redux';
import { userDataIdSelector, userDataSelector } from '../../store/slices/user/selectors';
import { updateUser } from '../../store/slices/user/slice';

const userId = 0;

export default function ReduxExamplePage() {
  const userData = useSelector(userDataSelector);
  const userDataId = useSelector(userDataIdSelector);

  const dispatch = useDispatch();

  const onClick = () => {
    // userId++;
    dispatch(updateUser({ user: { id: userId }, isLogged: true }));
  };

  console.log('i rendered!');
  console.log('userDataId', userDataId);
  console.log('userData is:', userData);

  return (
    <div className='flex size-full flex-col items-start justify-start gap-6 p-6 dark:text-white'>
      <h1 className='self-center text-3xl font-bold'>Redux Advanced Middleware Example</h1>

      <button
        type='button'
        onClick={onClick}
        className='self-center rounded-lg border border-black bg-red-500 px-3 py-2 hover:bg-red-600'
      >
        Click
      </button>

      {/* {loginToastMessage.isShowing && <div>{loginToastMessage.text}</div>} */}

      {/* <div>{userData && JSON.stringify(userData)}</div> */}

      {/* {isLoginModalOpen && <LoginModal />} */}
    </div>
  );
}
