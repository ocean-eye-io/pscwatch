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
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
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

  // Monitor the table's scroll position and implement virtual scrolling
  useEffect(() => {
    const tableWrapper = tableWrapperRef.current;
    if (!tableWrapper) return;

    const handleScroll = () => {
      setScrollData({
        scrollWidth: tableWrapper.scrollWidth,
        scrollLeft: tableWrapper.scrollLeft,
        clientWidth: tableWrapper.clientWidth
      });
      
      // Implement a simple virtualization approach
      if (data.length > 100) {
        const scrollTop = tableWrapper.scrollTop;
        const viewportHeight = tableWrapper.clientHeight;
        const rowHeight = 36; // Adjust this to match your actual row height
        
        // Calculate visible range with buffer rows for smooth scrolling
        const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 20);
        const visibleRows = Math.ceil(viewportHeight / rowHeight) + 40;
        const end = Math.min(data.length, start + visibleRows);
        
        setVisibleRange({ start, end });
      } else {
        setVisibleRange({ start: 0, end: data.length });
      }
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
  }, [data.length]);

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

  // Get visible subset of data to render
  const visibleData = useMemo(() => {
    return sortedData.slice(visibleRange.start, visibleRange.end);
  }, [sortedData, visibleRange]);

  // Calculate if table needs horizontal scrolling
  const needsScroll = scrollData.scrollWidth > scrollData.clientWidth;
  
  // Calculate current scroll percentage for the range input
  const scrollPercentage = needsScroll 
    ? (scrollData.scrollLeft / (scrollData.scrollWidth - scrollData.clientWidth)) * 100 
    : 0;

  // Calculate total height for spacer elements to maintain scrollbar size
  const totalHeight = data.length * parseInt(rowHeight);
  const topSpacerHeight = visibleRange.start * parseInt(rowHeight);
  const bottomSpacerHeight = (data.length - visibleRange.end) * parseInt(rowHeight);

  return (
    <>
      <div className={`data-table-container ${className}`}>
        <div 
          className="data-table-wrapper"
          ref={tableWrapperRef}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            {/* Top spacer */}
            {topSpacerHeight > 0 && (
              <div style={{ height: `${topSpacerHeight}px` }} />
            )}
            
            <table className="data-table" style={{ position: topSpacerHeight > 0 ? 'absolute' : 'relative', top: topSpacerHeight > 0 ? `${topSpacerHeight}px` : 0, width: '100%' }}>
              <thead>
                <tr>
                  {expandedContent && <th key="expand-header" style={{ width: '40px' }}></th>}
                  {columns.map((column) => (
                    <th 
                      key={`header-${column.field}`}  // Add this unique key
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
                  {actions && <th key="actions-header" style={{ width: actions.width || '120px' }}>{actions.label || 'Actions'}</th>}
                </tr>
              </thead>
              <tbody>
                {visibleData.length > 0 ? (
                  visibleData.map((rowData) => (
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
            
            {/* Bottom spacer */}
            {bottomSpacerHeight > 0 && (
              <div style={{ height: `${bottomSpacerHeight}px` }} />
            )}
          </div>
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