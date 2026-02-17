import ActionButtons from './content/ActionButtons';
import ErrorResponse from './content/ErrorResponse';
import InfoCard from './content/InfoCard';
import LoadingIndicator from './content/LoadingIndicator';
import RequestInfoDisplay from './content/RequestInfoDisplay';
import ServerCallHeader from './content/ServerCallHeader';
import SuccessResponse from './content/SuccessResponse';
import UserInputForm from './content/UserInputForm';
import { useServerCallPageLogic } from './logic/useServerCallPageLogic';

export default function ServerCallPage() {
  const { isLoading, data, error, requestInfo, userFormData, updateFormField, fetchUsers, createUser, handleAbort } =
    useServerCallPageLogic();

  return (
    <div className='size-full overflow-auto bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8'>
      <div className='flex flex-col gap-10 max-w-5xl mx-auto space-y-6'>
        <ServerCallHeader />

        <UserInputForm formData={userFormData} isLoading={isLoading} onUpdateField={updateFormField} />

        <ActionButtons
          isLoading={isLoading}
          onFetchUsers={fetchUsers}
          onCreateUser={createUser}
          onAbort={handleAbort}
        />

        {isLoading && <LoadingIndicator requestInfo={requestInfo} />}

        {requestInfo && !isLoading && <RequestInfoDisplay requestInfo={requestInfo} />}

        {data && !error && !isLoading && <SuccessResponse data={data} />}

        {error && <ErrorResponse error={error} />}

        {!data && !error && !isLoading && <InfoCard />}
      </div>
    </div>
  );
}
