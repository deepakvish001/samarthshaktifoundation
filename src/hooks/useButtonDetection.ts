import { useEffect } from 'react';
import { useGlobalCrud } from '@/contexts/GlobalCrudContext';

export const useButtonDetection = (tableName: string) => {
  const { notifyOperation } = useGlobalCrud();

  useEffect(() => {
    const handleButtonClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check if the clicked element is a button or has button-like attributes
      if (target.tagName === 'BUTTON' || target.role === 'button' || (target as HTMLButtonElement).type === 'submit') {
        const buttonText = target.textContent?.toLowerCase() || '';
        const className = target.className?.toLowerCase() || '';
        const ariaLabel = target.getAttribute('aria-label')?.toLowerCase() || '';
        
        // Skip sidebar-related buttons to prevent false notifications
        const allText = `${buttonText} ${className} ${ariaLabel}`;
        if (allText.includes('sidebar') || allText.includes('menu') || allText.includes('toggle') || allText.includes('collapse')) {
          return;
        }
        
        // Only detect operations within admin forms or tables, not navigation
        const isInAdminForm = target.closest('form') || target.closest('table') || target.closest('[data-admin-action]');
        if (!isInAdminForm) {
          return;
        }
        
        // Detect CRUD operations based on button text, class, or aria-label (more specific)
        if (allText.includes('save') || allText.includes('submit') || allText.includes('create') || (allText.includes('add') && !allText.includes('sidebar'))) {
          notifyOperation('Save/Create operation', tableName);
        } else if (allText.includes('update') || (allText.includes('edit') && !allText.includes('sidebar')) || allText.includes('modify')) {
          notifyOperation('Update/Edit operation', tableName);
        } else if (allText.includes('delete') || allText.includes('remove') || allText.includes('trash')) {
          notifyOperation('Delete operation', tableName);
        } else if (allText.includes('refresh') || allText.includes('reload')) {
          notifyOperation('Refresh operation', tableName);
        }
      }
    };

    // Add event listener to capture button clicks
    document.addEventListener('click', handleButtonClick, true);

    return () => {
      document.removeEventListener('click', handleButtonClick, true);
    };
  }, [notifyOperation, tableName]);
};