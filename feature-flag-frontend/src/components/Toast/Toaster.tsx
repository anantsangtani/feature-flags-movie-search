import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { toast } from '../../utils/toast';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 400px;
`;

const ToastItem = styled.div<{ type: string; isLeaving: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  animation: ${({ isLeaving }) => (isLeaving ? slideOut : slideIn)} 0.3s ease-in-out;
  
  ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return `
          background-color: ${theme.colors.success[50]};
          border: 1px solid ${theme.colors.success[500]};
          color: ${theme.colors.success[600]};
        `;
      case 'error':
        return `
          background-color: ${theme.colors.danger[50]};
          border: 1px solid ${theme.colors.danger[500]};
          color: ${theme.colors.danger[600]};
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.warning[50]};
          border: 1px solid ${theme.colors.warning[500]};
          color: ${theme.colors.warning[600]};
        `;
      default:
        return `
          background-color: ${theme.colors.gray[50]};
          border: 1px solid ${theme.colors.gray[200]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const ToastMessage = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

const ToastIcon = styled.span<{ type: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return `&::before { content: '✅'; }`;
      case 'error':
        return `&::before { content: '❌'; }`;
      case 'warning':
        return `&::before { content: '⚠️'; }`;
      default:
        return `&::before { content: 'ℹ️'; }`;
    }
  }}
`;

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<any[]>([]);
  const [leavingToasts, setLeavingToasts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const handleClose = (id: string) => {
    setLeavingToasts(prev => new Set(prev).add(id));
    setTimeout(() => {
      toast.removeToast(id);
      setLeavingToasts(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  };

  return (
    <ToastContainer>
      {toasts.map((toastItem) => (
        <ToastItem
          key={toastItem.id}
          type={toastItem.type}
          isLeaving={leavingToasts.has(toastItem.id)}
        >
          <ToastIcon type={toastItem.type} />
          <ToastMessage>{toastItem.message}</ToastMessage>
          <CloseButton onClick={() => handleClose(toastItem.id)}>
            ×
          </CloseButton>
        </ToastItem>
      ))}
    </ToastContainer>
  );
};
