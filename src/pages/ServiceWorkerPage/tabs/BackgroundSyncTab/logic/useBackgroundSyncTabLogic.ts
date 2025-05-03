import { useEffect, useState } from 'react';
import type { RequestDetails } from '../../../../../common/types';
import { isBackgroundSyncFeatureEnabled } from '../../../../../common/utils/isBackgroundSyncFeatureEnabled';
import { httpClient } from '../../../../../lib/HttpClient';
import { HttpMethod } from '../../../../../lib/HttpClient/types';
import { fireSyncEvent } from '../../../logic/utils/fireSyncEvent';
import { sendDataLater, sendDataNow } from './sendData';
import { useFormValues } from './useFormValues';

export function useBackgroundSyncTabLogic() {
  const { email, password, name, age, handleEmailChange, handlePasswordChange, handleNameChange, handleAgeChange } =
    useFormValues();

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await httpClient.get('/users');

      setData(data);
    }
    fetchUsers();
  }, []);

  const onSendDataClick = async () => {
    const requestDetails: RequestDetails = {
      url: '/users',
      options: {
        method: HttpMethod.POST,
        body: { email, password, name, age },
      },
    };

    if (isBackgroundSyncFeatureEnabled()) return sendDataLater(requestDetails);

    sendDataNow(requestDetails);
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
  };
}
