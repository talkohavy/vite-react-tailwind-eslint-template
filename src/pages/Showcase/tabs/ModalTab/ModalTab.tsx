import { useState } from 'react';
import Button from '@src/components/controls/Button';
import Modal from '@src/components/Modal';
import styles from './ModalTab.module.scss';

function LazyCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-sm dark:text-white/70'>
        <strong>NOTE!</strong> If this was NOT lazy, you'd see the same count value from the previous session.
      </p>

      <p className='text-sm dark:text-white/70'>
        This content is lazily mounted — it unmounts when the modal closes. Increment the counter, close, and reopen to
        see it reset.
      </p>

      <div className='flex items-center gap-3'>
        <Button onClick={() => setCount((c) => c - 1)}>−</Button>
        <span className='text-xl font-semibold w-6 text-center dark:text-white'>{count}</span>
        <Button onClick={() => setCount((c) => c + 1)}>+</Button>
      </div>
    </div>
  );
}

export default function ModalTab() {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLazyOpen, setIsLazyOpen] = useState(false);
  const [isNonModalOpen, setIsNonModalOpen] = useState(false);

  return (
    <div className='flex flex-col gap-8 w-full'>
      {/* ── 1. Basic – shared trigger state ───────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Shared trigger state</p>
        <p className='text-xs text-white/40'>
          Multiple buttons share the same open state — place trigger buttons anywhere in the tree.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button onClick={() => setIsBasicOpen(true)}>Open Modal — Trigger A</Button>
          <Button onClick={() => setIsBasicOpen(true)}>Open Modal — Trigger B</Button>
        </div>
      </section>

      <Modal
        isOpen={isBasicOpen}
        setIsOpen={setIsBasicOpen}
        title='Welcome Back'
        description='Sign in to continue.'
        contentClassName={styles.modalContent}
      >
        <p className='text-sm text-white/70'>
          Both trigger buttons share the same state. Click outside, press Escape, or use the × button to close.
        </p>
        <div className='flex gap-3 justify-end w-full'>
          <Button onClick={() => setIsBasicOpen(false)}>Cancel</Button>
          <Button onClick={() => setIsBasicOpen(false)}>Confirm</Button>
        </div>
      </Modal>

      {/* ── 2. Alert Dialog ───────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Alert Dialog</p>
        <p className='text-xs text-white/40'>
          <code>role="alertdialog"</code> with <code>closeOnEscape=false</code>,{' '}
          <code>closeOnInteractOutside=false</code>, and <code>showCloseButton=false</code> — the user must explicitly
          confirm or cancel. Use for destructive or irreversible actions.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button onClick={() => setIsAlertOpen(true)} className='bg-red-600 hover:bg-red-700 active:bg-red-600'>
            Delete Account
          </Button>
        </div>
      </section>

      <Modal
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        title='Delete your account?'
        description='This action is permanent and cannot be undone.'
        role='alertdialog'
        closeOnEscape={false}
        closeOnInteractOutside={false}
        showCloseButton={false}
        contentClassName={styles.modalContent}
      >
        <p className='text-sm text-white/70'>
          All your data, settings, and history will be permanently erased. You will not be able to recover this account.
        </p>
        <div className='flex gap-3 justify-end w-full'>
          <Button onClick={() => setIsAlertOpen(false)}>Cancel</Button>
          <Button onClick={() => setIsAlertOpen(false)} className='bg-red-600 hover:bg-red-700 active:bg-red-600'>
            Yes, delete it
          </Button>
        </div>
      </Modal>

      {/* ── 3. Lazy Mount ─────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Lazy Mount</p>
        <p className='text-xs text-white/40'>
          <code>isLazyMount</code> — content is only mounted while open and unmounted on close. Ideal for forms where
          you want internal state to reset on each open.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button onClick={() => setIsLazyOpen(true)}>Open Lazy Modal</Button>
        </div>
      </section>

      <Modal
        isOpen={isLazyOpen}
        setIsOpen={setIsLazyOpen}
        title='Lazy Mounted Content'
        isLazyMount
        contentClassName={styles.modalContent}
      >
        <LazyCounter />
      </Modal>

      {/* ── 4. Non-Modal Panel ────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Non-Modal Panel</p>
        <p className='text-xs text-white/40'>
          <code>isModal=false</code> — focus is not trapped and the page stays interactive behind the overlay. Useful
          for drawer-style panels or soft notifications.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button onClick={() => setIsNonModalOpen(true)}>Open Notification Panel</Button>
        </div>
      </section>

      <Modal
        isOpen={isNonModalOpen}
        setIsOpen={setIsNonModalOpen}
        title='New Message'
        description='You have an unread notification.'
        isModal={false}
        contentClassName={styles.modalContent}
      >
        <p className='text-sm text-white/70'>
          Focus is not trapped — you can still interact with elements behind this panel. Click outside or press Escape
          to dismiss.
        </p>
        <div className='flex gap-3 justify-end w-full'>
          <Button onClick={() => setIsNonModalOpen(false)}>Dismiss</Button>
          <Button onClick={() => setIsNonModalOpen(false)}>View Message</Button>
        </div>
      </Modal>
    </div>
  );
}
