export function isPushNotificationsFeatureEnabled() {
  return 'Notification' in window;
}
