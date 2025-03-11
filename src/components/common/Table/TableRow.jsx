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
  onRowClick,
  rowHeight = '36px'
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
    
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    
    return value.toString();
  };

  return (
    <>
      <tr 
        className={`data-row ${isExpanded ? 'expanded' : ''} ${onRowClick ? 'clickable' : ''}`}
        onClick={onRowClick}
        style={{ height: rowHeight }}
      >
        {expandedContent && (
          <td key="expand-button-cell">
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
            key={`cell-${column.field}`}
            className={column.cellClassName ? 
              (typeof column.cellClassName === 'function' ? 
                column.cellClassName(rowData[column.field], rowData) : 
                column.cellClassName) : 
              ''}
            style={{
              maxWidth: column.maxWidth || column.width,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              ...(column.cellStyle ? (typeof column.cellStyle === 'function' ? 
                column.cellStyle(rowData[column.field], rowData) : 
                column.cellStyle) : {})
            }}
          >
            {renderCellContent(column, rowData[column.field])}
          </td>
        ))}

        {actions && (
          <td key="actions-cell" className="actions-cell">
            {actions}
          </td>
        )}
      </tr>

      {isExpanded && expandedContent && (
        <tr key="expanded-row" className="expanded-row">
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