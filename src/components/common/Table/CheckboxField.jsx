// src/components/common/Table/CheckboxField.jsx
import React, { useState, useEffect } from 'react';

const CheckboxField = ({ 
  value, 
  vessel, 
  onUpdate,
  className = ''
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [checked, setChecked] = useState(value === true);

  // Update local state if prop value changes (e.g. after data refresh)
  useEffect(() => {
    setChecked(value === true);
  }, [value]);

  const handleToggle = async (e) => {
    e.stopPropagation(); // Prevent row click events
    
    // Get the new value from the event directly
    const newValue = e.target.checked;
    
    setIsUpdating(true);
    
    try {
      console.log(`Toggling checklist for vessel ${vessel.imo_no} from ${checked} to ${newValue}`);
      
      // Prepare updated vessel data
      const updatedVessel = {
        ...vessel,
        checklist_received: newValue,
        id: vessel.id
      };
      
      // Call the update function passed from the parent
      const success = await onUpdate(updatedVessel);
      
      if (success) {
        // Update local state only after successful update
        setChecked(newValue);
        console.log(`Successfully updated checklist to ${newValue}`);
      } else {
        console.warn('Update was not successful');
      }
    } catch (error) {
      console.error('Failed to update checklist status:', error);
      // Keep the previous state on error
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className={`checkbox-field ${className}`} onClick={e => e.stopPropagation()}>
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          disabled={isUpdating}
        />
        <span className="checkmark"></span>
      </label>
      {isUpdating && <div className="checkbox-spinner"></div>}
    </div>
  );
};

export default CheckboxField;