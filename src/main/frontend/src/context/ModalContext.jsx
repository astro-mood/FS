import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        message: "",
        onConfirm: null,
        onCancel: null,
    });

    const openModal = ({ type, message, onConfirm, onCancel }) => {
        setModalState({
            isOpen: true,
            type,
            message,
            onConfirm: onConfirm || (() => {}),
            onCancel: onCancel || (() => {}),
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            type: null,
            message: "",
            onConfirm: null,
            onCancel: null,
        });
    };

    return (
        <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModals = () => useContext(ModalContext);
