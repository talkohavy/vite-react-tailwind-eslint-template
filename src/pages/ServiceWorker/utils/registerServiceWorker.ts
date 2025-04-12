export async function registerServiceWorker() {
  try {
    if ('serviceWorker' in navigator) {
      const response = await navigator.serviceWorker.register('/sw.js'); // <--- `register` can also accept a second parameter for options: ", { scope: '/help/' }", but the location of the sw.js in the dist folder is the most important. Meaning, if the sw.js is in a subfolder /help/, setting scope here to "/" won't work.

      console.log('Service Worker registered with scope:', response.scope);
    } else {
      console.warn('Service Worker is not supported in this browser.');
    }
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}
