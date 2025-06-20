import { ReactNode } from 'react';
import { create } from 'zustand';

export type ModalType = 'auth' | 'message' | 'custom' | null;

interface ModalStore {
    isOpen: boolean;
    type: ModalType;
    props: Record<string, string>;
    content: ReactNode | null;
    openModal: (args: { type?: ModalType; props?: Record<string, string>; content?: ReactNode | null }) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    isOpen: false,
    type: null,
    props: {},
    content: null,
    openModal: ({ type = null, props = {}, content = null }) =>
        set({ isOpen: true, type, props, content }),
    closeModal: () => set({ isOpen: false, type: null, props: {}, content: null }),
}));