// src/components/common/Table/TableRow.jsx
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const TableRow = ({ 
  rowData, 
  columns, 
  isExpanded, 
  onToggleExpand, 
  expandedContent,
  actions,
  onRowClick
}) => {
  const renderCellContent = (column, value) => {
    // If the column has a custom renderer, use it
    if (column.render) {
      return column.render(value, rowData);
    }
    
    // Default rendering based on type
    if (value === null || value === undefined) {
      return column.emptyValue || '-';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Handle Date objects safely
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    
    // Ensure we return a string
    return String(value);
  };

  return (
    <>
      <tr 
        className={`data-row ${isExpanded ? 'expanded' : ''} ${onRowClick ? 'clickable' : ''}`}
        onClick={onRowClick}
      >
        {expandedContent && (
          <td>
            <button
              className="expand-button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              aria-label={isExpanded ? "Collapse row" : "Expand row"}
            >
              {isExpanded ? 
                <ChevronDown size={16} /> : 
                <ChevronRight size={16} />
              }
            </button>
          </td>
        )}
        
        {columns.map((column) => (
          <td 
            key={column.field} 
            className={column.cellClassName ? 
              (typeof column.cellClassName === 'function' ? 
                column.cellClassName(rowData[column.field], rowData) : 
                column.cellClassName) : 
              ''}
          >
            {renderCellContent(column, rowData[column.field])}
          </td>
        ))}

        {actions && (
          <td className="actions-cell">
            {actions}
          </td>
        )}
      </tr>

      {isExpanded && expandedContent && (
        <tr className="expanded-row">
          <td colSpan={columns.length + (actions ? 2 : 1)}>
            <div className="expanded-content">
              {expandedContent}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default TableRow;