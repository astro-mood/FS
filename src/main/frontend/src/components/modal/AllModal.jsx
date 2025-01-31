import React from "react";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";
import { useModals } from "../../context/ModalContext";

const Modals = () => {
    const { modalState, closeModal } = useModals();

    if (!modalState.isOpen) return null;

    const { type, message, onConfirm, onCancel } = modalState;

    if (type === "alert") {
        return (
            <ConfirmModal
                isOpen={modalState.isOpen}
                message={message}
                onConfirm={() => {
                    onConfirm();
                    closeModal();
                }}
            />
        );
    }

    if (type === "confirm") {
        return (
            <Modal
                isOpen={modalState.isOpen}
                message={message}
                onConfirm={() => {
                    onConfirm();
                    closeModal();
                }}
                onCancel={() => {
                    onCancel();
                    closeModal();
                }}
            />
        );
    }

    return null;
};

export default Modals;
