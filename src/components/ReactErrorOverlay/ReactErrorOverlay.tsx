export default function ReactErrorOverlay(error: Error | null) {
  // must be within function call because that's when the element is defined for sure.
  const ErrorOverlay = customElements.get('vite-error-overlay');
  // don't open outside vite environment

  if (!ErrorOverlay) return;

  console.log(error);

  const overlay = new ErrorOverlay(error);
  document.body.appendChild(overlay);
}
