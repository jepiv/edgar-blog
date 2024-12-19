import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Papa from 'papaparse';
import { ChevronDown } from 'lucide-react';

const Tooltip = ({ content, mousePosition }) => {
  if (!content || !mousePosition) return null;
  
  return createPortal(
    <div 
      className="fixed z-50 px-2 py-1 text-sm bg-gray-900 text-gray-100 rounded shadow-lg pointer-events-none"
      style={{
        left: mousePosition.x + 10,
        top: mousePosition.y + 10,
      }}
    >
      {content}
    </div>,
    document.body
  );
};

const SECFilingsViz = () => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('top10');
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [mousePosition, setMousePosition] = useState(null);
  const scrollContainerRef = useRef(null);
  const chartRef = useRef(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Use import.meta.env.BASE_URL to get the base URL from Vite
        const response = await fetch(import.meta.env.BASE_URL + 'data/filing_forms.csv');
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        const sortedData = parsed.data.sort((a, b) => b.TotalCount - a.TotalCount);
        setData(sortedData);

        const groups = {
          'Ownership Forms': [],
          '8-K Reports': [],
          '10-Series Forms': [],
          'Proxy Materials': [],
          'Registration Forms': [],
          'Investment Company Forms': [],
          'Other Forms': []
        };

        sortedData.forEach(row => {
          const type = String(row.Type);
          if (type.match(/^[345]/)) {
            groups['Ownership Forms'].push(row);
          } else if (type.startsWith('8-K')) {
            groups['8-K Reports'].push(row);
          } else if (type.startsWith('10-')) {
            groups['10-Series Forms'].push(row);
          } else if (type.includes('DEF') || type.includes('PRE') || type.includes('PREC')) {
            groups['Proxy Materials'].push(row);
          } else if (type.startsWith('S-') || type.startsWith('F-')) {
            groups['Registration Forms'].push(row);
          } else if (type.match(/^(485|497|N-|24F)/)) {
            groups['Investment Company Forms'].push(row);
          } else {
            groups['Other Forms'].push(row);
          }
        });

        setGroupedData(groups);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollContainerRef.current;
      const hasScrollContent = scrollHeight > clientHeight;
      setHasScroll(hasScrollContent);
      
      if (hasScrollContent) {
        const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
        setIsAtBottom(isBottom);
      } else {
        setIsAtBottom(true);
      }
    }
  };

  useEffect(() => {
    checkScrollable();
    const handleResize = () => checkScrollable();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedGroup]);

  const handleScroll = () => {
    checkScrollable();
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setIsAtBottom(false);
    checkScrollable();
  }, [selectedGroup]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const clearTooltip = () => {
    setTooltipContent(null);
    setMousePosition(null);
  };

  useEffect(() => {
    // Clear tooltip when component unmounts
    return () => clearTooltip();
  }, []);

  const BarChart = ({ data, maxValue }) => {
    const percentage = (data.TotalCount / maxValue) * 100;
    const actualWidth = Math.max(percentage, 2);

    return (
      <div 
        className="chart-bar group"
        onMouseEnter={(e) => {
          setTooltipContent(`${formatNumber(data.TotalCount)} filings`);
          setMousePosition({ x: e.clientX, y: e.clientY });
        }}
        onMouseMove={(e) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }}
        onMouseLeave={clearTooltip}
      >
        <div className="w-32 truncate pr-4 text-sm text-gray-300">{data.Type}</div>
        <div className="flex-1 relative h-5">
          <div className="absolute inset-0 bg-gray-800 rounded-sm" />
          
          <div className="relative h-full">
            <div 
              className="bg-blue-500 h-full rounded-sm transition-all duration-300 origin-left
                         group-hover:bg-blue-400 group-hover:scale-x-[1.02]"
              style={{ width: `${actualWidth}%` }}
            />
            
            <div 
              className="absolute inset-0 bg-blue-400/20 blur-sm rounded-sm transition-all duration-300 opacity-0 
                         group-hover:opacity-100 group-hover:scale-x-[1.04]"
              style={{ width: `${actualWidth}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const getDisplayData = () => {
    if (selectedGroup === 'top10') {
      return data.slice(0, 10);
    }
    return groupedData[selectedGroup] || [];
  };

  const maxValue = data.length > 0 ? data[0].TotalCount : 0;
  const displayData = getDisplayData();

  return (
    <div 
      ref={chartRef}
      className="chart-container"
      onMouseLeave={clearTooltip}
    >
      <div className="mb-8">
        <h2 className="chart-title">Most Frequent SEC Filings</h2>
        <div className="relative">
          {hasScroll && (
            <div className={`chart-scroll-fade ${isAtBottom ? 'opacity-0' : 'opacity-100'}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-chart-bg to-transparent" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2">
                <ChevronDown 
                  size={24} 
                  className="text-gray-400 animate-bounce"
                />
              </div>
            </div>
          )}
          
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseLeave={clearTooltip}
            className="chart-scrollable scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
          >
            {displayData.map((item, idx) => (
              <BarChart key={idx} data={item} maxValue={maxValue} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-chart-border pt-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`chart-button ${
              selectedGroup === 'top10'
                ? 'chart-button-active'
                : 'chart-button-inactive'
            }`}
            onClick={() => setSelectedGroup('top10')}
          >
            Top 10 Overall
          </button>
          {Object.entries(groupedData).map(([group, items]) => (
            <button
              key={group}
              className={`chart-button ${
                selectedGroup === group
                  ? 'chart-button-active'
                  : 'chart-button-inactive'
              }`}
              onClick={() => setSelectedGroup(group)}
            >
              {group} ({items.length})
            </button>
          ))}
        </div>
      </div>

      <Tooltip content={tooltipContent} mousePosition={mousePosition} />
    </div>
  );
};

export default SECFilingsViz;
