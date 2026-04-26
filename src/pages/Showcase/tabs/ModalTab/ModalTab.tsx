import { useState } from 'react';
import Button from '@src/components/controls/Button';
import Modal from '@src/components/Modal';

export default function ModalTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div>Modal:</div>

      <div className='flex flex-wrap gap-3'>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal — Trigger A</Button>

        <Button onClick={() => setIsModalOpen(true)}>Open Modal — Trigger B</Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title='Welcome Back'
        description='Sign in to your account to continue.'
      >
        <p className='text-sm text-white/70'>
          This modal is controlled from outside — both trigger buttons share the same state. You can place trigger
          buttons anywhere in your tree.
        </p>

        <div className='flex gap-3 justify-end w-full'>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}
