import { useApp } from '@/lib/app-context';
import { AddGestureModal } from './AddGestureModal';
import { DeleteGestureModal } from './DeleteGestureModal';
import { RetrainStatusModal } from './RetrainStatusModal';
import { EditActionModal } from './EditActionModal';

export function ModalManager() {
    const { state } = useApp();
    const { type } = state.modalState;

    if (!type) return null;

    return (
        <>
            {type === 'addGesture' && <AddGestureModal />}
            {type === 'deleteGesture' && <DeleteGestureModal />}
            {type === 'retrain' && <RetrainStatusModal />}
            {(type === 'editGesture' || type === 'mapAction') && <EditActionModal />}
        </>
    );
}
