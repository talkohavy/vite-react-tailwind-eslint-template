import { v4 as uuid } from 'uuid';
import { SESSION_KEYS } from './constants';

class SessionManager {
  constructor() {
    const localStorageId = localStorage.getItem(SESSION_KEYS.LOCAL_STORAGE);
    const sessionStorageId = sessionStorage.getItem(SESSION_KEYS.SESSION_STORAGE);

    if (!localStorageId) {
      localStorage.setItem(SESSION_KEYS.LOCAL_STORAGE, uuid());
    }

    if (!sessionStorageId) {
      sessionStorage.setItem(SESSION_KEYS.SESSION_STORAGE, uuid());
    }
  }

  setSessionId() {
    const localStorageId = localStorage.getItem(SESSION_KEYS.LOCAL_STORAGE);
    const sessionStorageId = sessionStorage.getItem(SESSION_KEYS.SESSION_STORAGE);

    if (!localStorageId) {
      localStorage.setItem(SESSION_KEYS.LOCAL_STORAGE, uuid());
    }

    if (!sessionStorageId) {
      sessionStorage.setItem(SESSION_KEYS.SESSION_STORAGE, uuid());
    }
  }

  getSessionId() {
    const localStorageId = localStorage.getItem(SESSION_KEYS.LOCAL_STORAGE);
    const sessionStorageId = sessionStorage.getItem(SESSION_KEYS.SESSION_STORAGE);

    return { localStorageId, sessionStorageId };
  }
}

function initSessionManager() {
  sessionManager = new SessionManager();
}

let sessionManager: SessionManager = null as any;

export { initSessionManager, sessionManager };
