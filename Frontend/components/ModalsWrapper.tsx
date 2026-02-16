'use client'

import { DeleteGestureModal } from './modals/DeleteGestureModal'
import { AddGestureModal } from './modals/AddGestureModal'
import { EditActionModal } from './modals/EditActionModal'
import { RetrainStatusModal } from './modals/RetrainStatusModal'

export function ModalsWrapper() {
  return (
    <>
      <DeleteGestureModal />
      <AddGestureModal />
      <EditActionModal />
      <RetrainStatusModal />
    </>
  )
}
