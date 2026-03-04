'use client';
import React from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function Modal({ open, title = '', children, onClose, onConfirm, confirmText, cancelText }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {title && <h2 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>{title}</h2>}
        <div style={{ marginBottom: '20px' }}>{children}</div>
        <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {onConfirm ? (
            <>
              <button className="btn-ghost" onClick={onClose} style={{ padding: '6px 14px' }}>
                {cancelText || 'Cancel'}
              </button>
              <button className="btn-primary" onClick={onConfirm} style={{ padding: '6px 14px' }}>
                {confirmText || 'OK'}
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={onClose} style={{ padding: '6px 14px' }}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
}
