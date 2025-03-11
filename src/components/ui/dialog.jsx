// src/components/ui/dialog.jsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import '../dashboard/DashboardStyles.css';

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;
  
  return (
    <DialogPortal>
      {children}
    </DialogPortal>
  );
};

const DialogPortal = ({ children }) => {
  useEffect(() => {
    // Prevent scrolling on body when dialog is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  return (
    <div className="dialog-portal">
      {children}
    </div>
  );
};

const DialogOverlay = ({ className = '', ...props }) => (
  <div
    className={`dialog-overlay ${className}`}
    {...props}
  />
);

const DialogContent = ({ className = '', children, ...props }) => {
  const contentRef = useRef(null);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && props.onOpenChange) {
        props.onOpenChange(false);
      }
    };
    
    const handleClickOutside = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target) && props.onOpenChange) {
        props.onOpenChange(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [props.onOpenChange]);
  
  return (
    <>
      <DialogOverlay onClick={() => props.onOpenChange && props.onOpenChange(false)} />
      <div
        ref={contentRef}
        className={`dialog-content ${className}`}
        {...props}
      >
        {children}
        <button 
          className="dialog-close" 
          onClick={() => props.onOpenChange && props.onOpenChange(false)}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );
};

const DialogHeader = ({ className = '', ...props }) => (
  <div
    className={`dialog-header ${className}`}
    {...props}
  />
);

const DialogFooter = ({ className = '', ...props }) => (
  <div
    className={`dialog-footer ${className}`}
    {...props}
  />
);

const DialogTitle = ({ className = '', ...props }) => (
  <h2
    className={`dialog-title ${className}`}
    {...props}
  />
);

const DialogDescription = ({ className = '', ...props }) => (
  <p
    className={`dialog-description ${className}`}
    {...props}
  />
);

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};