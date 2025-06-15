// components/Modal.js
'use client';

import { useModalStore } from '@/lib/stores/popupStores';
import ModalPortal from '@/components/popup';

export default function Modal() {
    const { isOpen, modalContent, closeModal } = useModalStore(state => state);

    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className="modal-backdrop" onClick={closeModal}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    {modalContent}
                    <button onClick={closeModal}>Закрыть</button>
                </div>
            </div>
        </ModalPortal>
    );
}