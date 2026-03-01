import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const DataGrid = ({ 
  data, 
  columns,
  searchableKeys, // New prop for targeted searching
  pageSize = 8, 
  emptyMessage = "No results found",
  viewMode = "table",
  renderCard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic (unchanged)
  const sortedData = useMemo(() => {
    let items = [...data];
    if (sortConfig.key) {
      items.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [data, sortConfig]);

  // OPTIMIZED Filtering logic
  const filteredData = useMemo(() => {
    if (!searchQuery) return sortedData;
    return sortedData.filter(item => {
      // If searchableKeys are provided, only check those. Otherwise, fallback to all values.
      if (searchableKeys && searchableKeys.length > 0) {
        return searchableKeys.some(key => 
          item[key] && String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return Object.values(item).some(val => 
        val && String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [sortedData, searchQuery, searchableKeys]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Filter size={14} />
          <span>{filteredData.length} items found</span>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === "table" ? (
        <div className="flex-1 overflow-auto rounded-2xl border border-gray-800 bg-gray-900/20 backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50 sticky top-0">
                {columns.map((col) => (
                  <th 
                    key={col.key}
                    className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => col.sortable !== false && requestSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortConfig.key === col.key && col.sortable !== false && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {paginatedData.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-gray-800/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500 italic">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((item, idx) => (
              <div key={item.id || idx}>
                {renderCard ? renderCard(item) : (
                  <div className="p-4 rounded-2xl border border-gray-800 bg-gray-900/40">
                    <h3 className="font-bold">{item.title}</h3>
                  </div>
                )}
              </div>
            ))}
            {paginatedData.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 italic">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGrid;
