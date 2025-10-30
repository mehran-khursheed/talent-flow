import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function SlideOver({ open, onClose, children }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-hidden" onClose={onClose}>
        {/* Backdrop */}
        {/* Adjusted backdrop opacity for a deeper look */}
        <div className="absolute inset-0 bg-black/80 transition-opacity" aria-hidden="true" /> 
        
        <div className="fixed inset-0 flex justify-end">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            {/* Panel */}
            {/* ⚠️ INCREASED WIDTH: max-w-xl on small screens, max-w-3xl on large screens */}
            <Dialog.Panel className="relative bg-[#1A1A1A] shadow-2xl w-full max-w-xl lg:max-w-3xl h-full p-0 overflow-y-auto">
                
                {/* Close Button - Moved for consistency and better styling */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-1 
                               text-gray-400 hover:text-white transition 
                               bg-transparent hover:bg-white/10 rounded-full"
                    aria-label="Close"
                >
                    {/* SVG Icon for a cleaner look than just 'x' */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {/* The content (JobDetailSlideOver) is rendered here. 
                    Note: We removed the inner padding and background from here, 
                    as the JobDetailSlideOver component now controls the styling and padding. */}
                {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}