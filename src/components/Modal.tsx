import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import '../styles/components/Modal.scss'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  size?: 's' | 'm' | 'l'
  children: ReactNode
}

export function Modal({ open, onClose, title, size = 'm', children }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal()
    if (!open && dialog.current?.open) dialog.current?.close()
  }, [open])
  return <dialog ref={dialog} className={`modal modal--${size}`} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose() }}>
    <header className="modal-header">
      <h2 id={titleId}>{title}</h2>
      <button type="button" className="modal-close" aria-label="닫기" title="닫기" onClick={onClose}><Icon name="x" /></button>
    </header>
    <div className="modal-body">{children}</div>
  </dialog>
}
