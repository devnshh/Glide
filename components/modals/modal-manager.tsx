import { AddGestureModal } from './AddGestureModal';
import { DeleteGestureModal } from './DeleteGestureModal';
import { RetrainStatusModal } from './RetrainStatusModal';
import { EditActionModal } from './EditActionModal';

export function ModalManager() {
    // Always render all modals — each one internally uses AnimatePresence
    // to handle its own enter/exit animations based on isOpen state.
    // This lets exit animations play before the component unmounts.
    return (
        <>
            <AddGestureModal />
            <DeleteGestureModal />
            <RetrainStatusModal />
            <EditActionModal />
        </>
    );
}
