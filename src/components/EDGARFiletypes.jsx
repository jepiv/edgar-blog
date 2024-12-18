import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const colorPalette = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#6366F1', // indigo-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
  '#84CC16', // lime-500
];

const EDGARFiletypes = () => {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [formTypes, setFormTypes] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [chartType, setChartType] = useState('pie');
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(import.meta.env.BASE_URL + 'data/edgar_filetypes_breakdown.csv');
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        const years = [...new Set(parsed.data.map(row => row.year))].sort((a, b) => b - a);
        // Convert form types to strings for consistent comparison
        const formTypes = [...new Set(parsed.data.map(row => String(row.formType)))].sort();
        
        setData(parsed.data);
        setYears(years);
        setFormTypes(formTypes);
        setSelectedYear(years[0]);
        setSelectedForm(formTypes[0]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedYear && selectedForm && data.length > 0) {
      const filteredData = data
        .filter(row => {
          return row.year === selectedYear && String(row.formType) === selectedForm;
        })
        .map(row => ({
          ...row,
          value: row.count,
          name: row.fileExtension.toUpperCase()
        }))
        .sort((a, b) => b.value - a.value);
      
      setCurrentData(filteredData);
    }
  }, [selectedYear, selectedForm, data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-chart-button-hover text-chart-text-primary px-3 py-2 rounded shadow-lg">
          <div className="font-medium">{data.name}</div>
          <div className="text-sm">
            Count: {new Intl.NumberFormat().format(data.count)}
          </div>
          <div className="text-sm">
            {data.percentage.toFixed(1)}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="chart-title">EDGAR Filing Extensions</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('pie')}
              className={`chart-button ${
                chartType === 'pie'
                  ? 'chart-button-active'
                  : 'chart-button-inactive'
              }`}
            >
              Pie
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`chart-button ${
                chartType === 'bar'
                  ? 'chart-button-active'
                  : 'chart-button-inactive'
              }`}
            >
              Bar
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <select
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="chart-select"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedForm || ''}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="chart-select"
          >
            {formTypes.map(form => (
              <option key={form} value={form}>{form}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center items-center h-96">
          {chartType === 'pie' ? (
            <PieChart width={400} height={400}>
              <Pie
                data={currentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return currentData[index].percentage > 5 ? (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      className="text-sm"
                    >
                      {currentData[index].name}
                    </text>
                  ) : null;
                }}
              >
                {currentData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colorPalette[index % colorPalette.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <RechartsBarChart
              width={600}
              height={400}
              data={currentData}
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              layout="vertical"
            >
              <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
              <YAxis 
                dataKey="name" 
                type="category"
                tick={{ fill: '#9CA3AF' }}
                width={60}
              />
              <Bar dataKey="value">
                {currentData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colorPalette[index % colorPalette.length]}
                  />
                ))}
              </Bar>
              <Tooltip content={<CustomTooltip />} />
            </RechartsBarChart>
          )}
        </div>
      </div>

      <div className="border-t border-chart-border pt-6">
        <div className="text-sm text-chart-text-secondary">
          Select a year and filing type to see the breakdown of file extensions used.
        </div>
      </div>
    </div>
  );
};

export default EDGARFiletypes;
