import { delay } from '@src/common/utils/delay';
import {
  showErrorToast,
  showInfoToast,
  showLoadingToast,
  showPromiseToast,
  showSuccessToast,
  showWarningToast,
} from '@src/common/utils/toast';
import Button from '@src/components/controls/Button';
import CustomToastTitle from './content/CustomToastTitle';

export default function ToastTab() {
  function showLoadingToSuccess() {
    const id = showLoadingToast({ title: 'Uploading file...' });

    setTimeout(() => {
      showSuccessToast({ title: 'Upload complete!', data: { id } });
    }, 2000);
  }

  return (
    <div className='flex flex-col gap-8 w-full'>
      {/* ── 1. Success ───────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Success</p>
        <p className='text-xs text-white/40'>Green checkmark — use after a completed action.</p>
        <div className='flex flex-wrap gap-3'>
          <Button
            onClick={() =>
              showSuccessToast({
                title: 'Changes saved successfully.',
                data: {
                  closeButton: true,
                  duration: Number.POSITIVE_INFINITY,
                },
              })
            }
            className='bg-emerald-600! hover:bg-emerald-500! active:bg-emerald-700!'
          >
            Success toast
          </Button>
        </div>
      </section>

      {/* ── 2. Error ───────────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Error</p>
        <p className='text-xs text-white/40'>Red icon — use when something goes wrong.</p>
        <div className='flex flex-wrap gap-3'>
          <Button
            onClick={() => showErrorToast({ title: 'Failed to save. Please try again.' })}
            className='bg-red-600! hover:bg-red-500 active:bg-red-700'
          >
            Error toast
          </Button>
        </div>
      </section>

      {/* ── 3. Warning ─────────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Warning</p>
        <p className='text-xs text-white/40'>Amber icon — use for cautionary messages.</p>
        <div className='flex flex-wrap gap-3'>
          <Button
            onClick={() => showWarningToast({ title: 'Your session expires in 5 minutes.' })}
            className='bg-amber-500! hover:bg-amber-400 active:bg-amber-600'
          >
            Warning toast
          </Button>
        </div>
      </section>

      {/* ── 4. Info ────────────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Info</p>
        <p className='text-xs text-white/40'>Blue icon — use for neutral informational messages.</p>
        <div className='flex flex-wrap gap-3'>
          <Button
            onClick={() => showInfoToast({ title: 'A new version is available.' })}
            className='bg-white! dark:bg-black! hover:bg-blue-500 active:bg-blue-700'
          >
            Info toast
          </Button>
        </div>
      </section>

      {/* ── 5. Loading ───────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Loading</p>
        <p className='text-xs text-white/40'>
          Spinner toast — stays until dismissed or replaced. The second button morphs into a success toast after 2 s.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button
            onClick={() => showLoadingToast({ title: 'Processing...' })}
            className='bg-zinc-600! hover:bg-zinc-500 active:bg-zinc-700'
          >
            Loading toast
          </Button>

          <Button onClick={() => showLoadingToSuccess()}>Loading → success</Button>
        </div>
      </section>

      {/* ── 7. Promise ───────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Promise</p>
        <p className='text-xs text-white/40'>
          Starts as loading, then updates to success or error when the promise settles. <code>success</code> can be a
          function that receives the resolved value.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button
            onClick={() =>
              showPromiseToast({
                promise: delay(2000).then(() => ({ fileName: 'report.pdf' })),
                loading: 'Uploading file...',
                success: (data) => `Uploaded ${data.fileName}!`,
                error: 'Upload failed.',
              })
            }
          >
            Promise → success
          </Button>

          <Button
            onClick={() =>
              showPromiseToast({
                promise: delay(2000).then(() => {
                  throw new Error('Network error');
                }),
                loading: 'Saving changes...',
                success: 'Changes saved!',
                error: 'Failed to save changes.',
              })
            }
            className='bg-red-600! hover:bg-red-500! active:bg-red-700!'
          >
            Promise → error
          </Button>
        </div>
      </section>

      {/* ── 8. Custom title ────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Custom title</p>
        <p className='text-xs text-white/40'>
          Pass any <code>ReactNode</code> as <code>title</code> — not just a string. Handy for rich layouts, icons, or
          styled copy.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button
            onClick={() =>
              showSuccessToast({
                title: <CustomToastTitle />,
                data: { duration: 10000 },
              })
            }
            className='bg-linear-to-r from-violet-600 to-fuchsia-600! hover:from-violet-500 hover:to-fuchsia-500! active:from-violet-700 active:to-fuchsia-700!'
          >
            Custom title toast
          </Button>
        </div>
      </section>
    </div>
  );
}
