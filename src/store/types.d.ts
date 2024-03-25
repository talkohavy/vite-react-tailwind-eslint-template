import type { Message } from '@luckylove-pkg/types';
import type { AnyAction } from '@reduxjs/toolkit';

declare type State = {
  router: { location: { pathname: string } };
  masterRoom: { isLogged; user: any; notifications: number; notificationPopup: any };
  chatRoom: {
    chatID: any;
    messages: Array<Message>;
    otherUser: any;
    meAndOther: any;
    selection: {
      selectedMessagesIds: Array<any>;
      showMessageOptionsMenu: boolean;
      messageMenuPos: { x: number; y: number };
    };
  };
  platform: any;
  gallery: any;
  who: any;
  backMsgs: any;
  modals: any;
  locale: { curLocale: { langCode: string; dir: 'rtl' | 'ltr' }; isOpen: boolean };
  report: any;
  navigator: any;
  payments: any;
};

declare type GetStateFunction = () => State;

declare type ActionHandlerProps = {
  action: AnyAction;
  dispatch: any;
  getState: GetStateFunction;
};

export { ActionHandlerProps, GetStateFunction, State };
