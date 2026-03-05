import { useEffect, useState } from 'react';
import { API_URLS } from '@src/common/constants';
import { isBackgroundSyncFeatureEnabled } from '@src/common/utils/isBackgroundSyncFeatureEnabled';
import { HttpMethod, httpClient } from '@src/lib/HttpClient';
import { fireSyncEvent } from '../../../logic/utils/fireSyncEvent';
import { sendDataLater, sendDataNow } from './sendData';
import { useFormValues } from './useFormValues';
import type { RequestDetails } from '@src/common/types';

export function useBackgroundSyncTabLogic() {
  const { email, password, name, age, handleEmailChange, handlePasswordChange, handleNameChange, handleAgeChange } =
    useFormValues();

  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        setErrorMessage('');

        const data = await httpClient.get(API_URLS.users).promise;

        setData(data);
      } catch (error) {
        console.error(error);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load users');
      }
    }
    fetchUsers();
  }, []);

  const onSendDataClick = async () => {
    const requestDetails: RequestDetails = {
      url: API_URLS.users,
      options: {
        method: HttpMethod.POST,
        body: { email, password, name, age },
      },
    };

    try {
      setErrorMessage('');

      if (isBackgroundSyncFeatureEnabled()) return sendDataLater(requestDetails);

      sendDataNow(requestDetails);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send data');
    }
  };

  const tryToSyncData = async () => {
    await fireSyncEvent();
  };

  return {
    email,
    password,
    name,
    age,
    handleEmailChange,
    handlePasswordChange,
    handleNameChange,
    handleAgeChange,
    onSendDataClick,
    tryToSyncData,
    data,
    errorMessage,
  };
}
