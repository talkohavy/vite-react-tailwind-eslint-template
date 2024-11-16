import { useSelector } from 'react-redux';
import { userDataSelector } from '../../store/slices/user/selectors';

// import LoginModal from './LoginModal';
// import { openLoginModal } from '../../store/slices/modals/actions';
// import { isLoginModalOpenSelector } from '../../store/slices/modals/selectors';
// import { loginToastMessageSelector } from '../../store/slices/toast/selectors';

export default function ReduxExamplePage() {
  // const isLoginModalOpen = useSelector(isLoginModalOpenSelector);
  // const loginToastMessage = useSelector(loginToastMessageSelector);
  const userData = useSelector(userDataSelector);
  // const dispatch = useDispatch();

  return (
    <div className='flex size-full flex-col items-start justify-start gap-6 p-6 dark:text-white'>
      <h1 className='self-center text-3xl font-bold'>Redux Advanced Middleware Example</h1>

      <button
        type='button'
        // onClick={() => dispatch(openLoginModal())}
        className='self-center rounded-lg border border-black bg-red-500 px-3 py-2 hover:bg-red-600'
      >
        Open Login Modal
      </button>

      {/* {loginToastMessage.isShowing && <div>{loginToastMessage.text}</div>} */}

      <div>{userData && JSON.stringify(userData)}</div>

      {/* {isLoginModalOpen && <LoginModal />} */}
    </div>
  );
}
