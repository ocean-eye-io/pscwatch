// src/components/common/Table/Table.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import TableRow from './TableRow';
import { ChevronDown } from 'lucide-react';

const Table = ({ 
  data, 
  columns, 
  expandedContent,
  actions,
  uniqueIdField = 'id',
  defaultSortKey,
  defaultSortDirection = 'asc',
  className = '',
  emptyMessage = 'No data available',
  rowHeight = '36px'
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ 
    key: defaultSortKey, 
    direction: defaultSortDirection 
  });
  const tableWrapperRef = useRef(null);
  const [scrollData, setScrollData] = useState({
    scrollWidth: 0,
    scrollLeft: 0,
    clientWidth: 0
  });

  const toggleRowExpansion = (rowId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Monitor the table's scroll position and sync with bottom scrollbar
  useEffect(() => {
    const tableWrapper = tableWrapperRef.current;
    if (!tableWrapper) return;

    const handleScroll = () => {
      setScrollData({
        scrollWidth: tableWrapper.scrollWidth,
        scrollLeft: tableWrapper.scrollLeft,
        clientWidth: tableWrapper.clientWidth
      });
    };

    // Update scroll data on mount and when table size changes
    handleScroll();

    // Add event listener for scroll
    tableWrapper.addEventListener('scroll', handleScroll);

    // Create resize observer to detect table size changes
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(tableWrapper);

    return () => {
      tableWrapper.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  // Handle scrolling from the bottom scrollbar
  const handleBottomScroll = (e) => {
    if (tableWrapperRef.current) {
      const scrollPercentage = e.target.value / 100;
      const maxScroll = tableWrapperRef.current.scrollWidth - tableWrapperRef.current.clientWidth;
      tableWrapperRef.current.scrollLeft = maxScroll * scrollPercentage;
    }
  };

  // Sort the data based on sort configuration
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      // Handle null/undefined values
      if (a[sortConfig.key] === null || a[sortConfig.key] === undefined) return 1;
      if (b[sortConfig.key] === null || b[sortConfig.key] === undefined) return -1;
      
      // Compare based on data type
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      let result;
      
      // Date comparison
      if (aValue instanceof Date && bValue instanceof Date) {
        result = aValue.getTime() - bValue.getTime();
      }
      // String comparison
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        result = aValue.localeCompare(bValue);
      }
      // Number comparison
      else {
        result = aValue - bValue;
      }
      
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [data, sortConfig]);

  // Calculate if table needs horizontal scrolling
  const needsScroll = scrollData.scrollWidth > scrollData.clientWidth;
  
  // Calculate current scroll percentage for the range input
  const scrollPercentage = needsScroll 
    ? (scrollData.scrollLeft / (scrollData.scrollWidth - scrollData.clientWidth)) * 100 
    : 0;

  return (
    <>
      <div className={`data-table-container ${className}`}>
        <div 
          className="data-table-wrapper"
          ref={tableWrapperRef}
        >
          <table className="data-table">
            <thead>
              <tr>
                {expandedContent && <th style={{ width: '40px' }}></th>}
                {columns.map((column) => (
                  <th 
                    key={column.field}
                    style={{ 
                      width: column.width,
                      minWidth: column.minWidth,
                      ...(column.style || {})
                    }}
                    onClick={() => column.sortable !== false && handleSort(column.field)}
                  >
                    <div className="table-header-content">
                      {column.label}
                      {column.sortable !== false && sortConfig.key === column.field && (
                        <ChevronDown 
                          size={16} 
                          className="sort-icon"
                          style={{ 
                            transform: sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'none',
                          }} 
                        />
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th style={{ width: actions.width || '120px' }}>{actions.label || 'Actions'}</th>}
              </tr>
            </thead>
            <tbody>
              {sortedData.length > 0 ? (
                sortedData.map((rowData) => (
                  <TableRow
                    key={rowData[uniqueIdField]}
                    rowData={rowData}
                    columns={columns}
                    isExpanded={expandedRows.has(rowData[uniqueIdField])}
                    onToggleExpand={() => toggleRowExpansion(rowData[uniqueIdField])}
                    expandedContent={expandedContent ? expandedContent(rowData) : null}
                    actions={actions ? actions.content(rowData) : null}
                    rowHeight={rowHeight}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (expandedContent ? 1 : 0) + (actions ? 1 : 0)}>
                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--table-muted-text-color)' }}>
                      {emptyMessage}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Bottom scrollbar that appears only when needed */}
      {needsScroll && (
        <div className="horizontal-scroll-container">
          <input
            type="range"
            min="0"
            max="100"
            value={scrollPercentage}
            onChange={handleBottomScroll}
            style={{
              width: '100%',
              height: '8px',
              appearance: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          />
        </div>
      )}
    </>
  );
};

export default Table;