import { useState } from 'react';
import Button from '@src/components/controls/Button';
import Modal from '@src/components/Modal';
import LazyCounter from './content/LazyCounter';
import styles from './ModalTab.module.scss';

export default function ModalTab() {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLazyOpen, setIsLazyOpen] = useState(false);
  const [isNonModalOpen, setIsNonModalOpen] = useState(false);
  const [isStack1Open, setIsStack1Open] = useState(false);
  const [isStack2Open, setIsStack2Open] = useState(false);
  const [isStack3Open, setIsStack3Open] = useState(false);

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

      {/* ── 5. Stacked Modals ─────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Stacked Modals</p>
        <p className='text-xs text-white/40'>
          Three modals layered on top of each other. Each modal opens the next. Underlying modals scale back as new
          layers stack above them, and restore when the layers above close.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button onClick={() => setIsStack1Open(true)}>Open First Modal</Button>
        </div>
      </section>

      {/* Layer 1 — scales back when layer 2 or 3 are open */}
      <Modal
        isOpen={isStack1Open}
        setIsOpen={setIsStack1Open}
        title='Level 1 — First Modal'
        description='This is the first modal. Open the next one to stack on top.'
        contentClassName={styles.modalContent}
      >
        <p className='text-sm text-white/70'>
          Click the button below to open a second modal on top of this one. Notice how this modal scales back as more
          layers stack above it.
        </p>
        <div className='flex gap-3 justify-end w-full'>
          <Button onClick={() => setIsStack1Open(false)}>Close</Button>
          <Button onClick={() => setIsStack2Open(true)}>Open Second Modal</Button>
        </div>
      </Modal>

      {/* Layer 2 — scales back when layer 3 is open */}
      <Modal
        isOpen={isStack2Open}
        setIsOpen={setIsStack2Open}
        title='Level 2 — Second Modal'
        description='A second modal stacked on top of the first.'
        contentClassName={styles.modalContent}
      >
        <p className='text-sm text-white/70'>
          The first modal is still open behind this one. Click below to open a third modal on top.
        </p>
        <div className='flex gap-3 justify-end w-full'>
          <Button onClick={() => setIsStack2Open(false)}>Close</Button>
          <Button onClick={() => setIsStack3Open(true)}>Open Third Modal</Button>
        </div>
      </Modal>

      {/* Layer 3 — topmost */}
      <Modal
        isOpen={isStack3Open}
        setIsOpen={setIsStack3Open}
        title='Level 3 — Third Modal'
        description='The topmost modal in the stack.'
        contentClassName={styles.modalContent}
      >
        <p className='text-sm text-white/70'>
          You have reached the third level. Two modals are stacked behind this one. Close this modal to return to the
          second, then close that to return to the first.
        </p>
        <div className='flex gap-3 justify-end w-full'>
          <Button onClick={() => setIsStack3Open(false)}>Close This Modal</Button>
        </div>
      </Modal>
    </div>
  );
}
