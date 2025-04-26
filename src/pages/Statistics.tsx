import React, { useState, useEffect } from 'react';
import {
  Timer, Calendar, BarChart2, Target, Filter, Download, ChevronDown,
  BookOpen, Clock, TrendingUp, AlertCircle, CheckCircle, XCircle, Book, X
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { format, subDays, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import { PomodoroTimer } from '../components/PomodoroTimer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const majorAreas = [
  { value: 'all', label: 'Todas as Áreas' },
  { value: 'cir', label: 'Cirurgia' },
  { value: 'clm', label: 'Clínica Médica' },
  { value: 'go', label: 'GO' },
  { value: 'prev', label: 'Preventiva' },
  { value: 'ped', label: 'Pediatria' },
];

// Performance Evolution Data
const getPerformanceEvolutionData = (selectedArea: string) => ({
  labels: ['01/01', '02/01', '03/01', '04/01', '05/01', '06/01', '07/01', '08/01', '09/01', '10/01'],
  datasets: [
    {
      label: '% Acertos',
      data: [65, 68, 72, 70, 75, 73, 78, 76, 80, 82],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y'
    },
    {
      label: 'Acertos',
      data: [32, 34, 36, 35, 38, 37, 39, 38, 40, 41],
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y1'
    },
    {
      label: 'Erros',
      data: [18, 16, 14, 15, 12, 13, 11, 12, 10, 9],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y1'
    },
    {
      label: 'Tempo (h)',
      data: [2, 2.5, 3, 2.8, 3.2, 3, 3.5, 3.3, 3.8, 4],
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y2'
    }
  ]
});

// Area Distribution Data
const areaDistributionData = {
  labels: ['Cirurgia', 'Clínica Médica', 'GO', 'Preventiva', 'Pediatria'],
  datasets: [{
    data: [30, 25, 15, 20, 10],
    backgroundColor: [
      '#4F46E5',
      '#22C55E',
      '#EAB308',
      '#EC4899',
      '#8B5CF6'
    ],
  }]
};

// Performance Donut Data
const performanceData = {
  datasets: [{
    data: [76, 24],
    backgroundColor: ['#10B981', '#EF4444'],
    borderWidth: 0,
    cutout: '75%'
  }]
};

// Study Time Evolution Data
const studyTimeEvolutionData = {
  labels: ['01/01', '02/01', '03/01', '04/01', '05/01', '06/01', '07/01', '08/01', '09/01', '10/01'],
  datasets: [
    {
      label: 'Tempo de Estudo (h)',
      data: [2, 2.5, 3, 2.8, 3.2, 3, 3.5, 3.3, 3.8, 4],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Questões',
      data: [50, 55, 60, 58, 65, 62, 70, 68, 75, 80],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        color: '#2D2D2D',
      },
      ticks: {
        color: '#A3A3A3',
      },
    },
    y: {
      grid: {
        color: '#2D2D2D',
      },
      ticks: {
        color: '#A3A3A3',
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: '#A3A3A3',
      },
    },
  },
};

const performanceEvolutionOptions = {
  ...chartOptions,
  scales: {
    x: {
      grid: {
        color: '#2D2D2D',
      },
      ticks: {
        color: '#A3A3A3',
      },
    },
    y: {
      position: 'left' as const,
      grid: {
        color: '#2D2D2D',
      },
      ticks: {
        color: '#A3A3A3',
        callback: (value: number) => `${value}%`
      },
    },
    y1: {
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: '#A3A3A3',
      },
    },
    y2: {
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: '#A3A3A3',
        callback: (value: number) => `${value}h`
      },
    },
  },
};

export function Statistics() {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: subDays(new Date(), 7),
    end: new Date(),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('week');
  const [selectedArea, setSelectedArea] = useState('all');
  const [filters, setFilters] = useState({
    disciplines: [] as string[],
    categories: [] as string[],
    performance: [] as string[],
    studyType: 'all',
  });

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    switch (filter) {
      case 'week':
        setDateRange({
          start: subDays(new Date(), 7),
          end: new Date(),
        });
        break;
      case 'month':
        setDateRange({
          start: subMonths(new Date(), 1),
          end: new Date(),
        });
        break;
      case 'quarter':
        setDateRange({
          start: subMonths(new Date(), 3),
          end: new Date(),
        });
        break;
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Estatísticas</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
              <Calendar size={20} />
              <span>
                {format(dateRange.start, 'dd/MM/yyyy')} - {format(dateRange.end, 'dd/MM/yyyy')}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {isCalendarOpen && (
              <div className="absolute top-full right-0 mt-2 bg-gray-800 rounded-lg p-4 shadow-lg z-10">
                <div className="flex gap-4 mb-4">
                  {['week', 'month', 'quarter'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`px-3 py-1 rounded-lg ${
                        selectedFilter === filter
                          ? 'bg-indigo-600'
                          : 'bg-gray-700 hover:bg-gray-600'
                      } transition-colors`}
                    >
                      {filter === 'week' ? '7 dias' : filter === 'month' ? '30 dias' : '90 dias'}
                    </button>
                  ))}
                </div>
                <DayPicker
                  mode="range"
                  selected={{ from: dateRange.start, to: dateRange.end }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ start: range.from, end: range.to });
                      setIsCalendarOpen(false);
                    }
                  }}
                  locale={ptBR}
                  styles={{
                    caption: { color: 'white' },
                    head_cell: { color: 'white' },
                    cell: { color: 'white' },
                    day: { color: 'white' },
                    nav_button: { color: 'white' },
                    nav_button_previous: { color: 'white' },
                    nav_button_next: { color: 'white' },
                  }}
                />
              </div>
            )}
          </div>
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
          >
            <Filter size={20} />
            <span>Filtros</span>
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors">
            <Download size={20} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tempo Total</h3>
            <Timer className="text-indigo-500" size={24} />
          </div>
          <p className="text-3xl font-bold">54h 23min</p>
          <p className="text-gray-400 text-sm mt-2">16.1 páginas por hora</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Videoaulas</h3>
            <Target className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold">0h 27min</p>
          <p className="text-gray-400 text-sm mt-2">Total assistido</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Progresso</h3>
            <BarChart2 className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold">16%</p>
          <p className="text-gray-400 text-sm mt-2">Do edital</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Constância</h3>
            <Book className="text-purple-500" size={24} />
          </div>
          <p className="text-3xl font-bold">58%</p>
          <p className="text-gray-400 text-sm mt-2">33 dias totais</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Donut */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Desempenho Geral</h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-[200px] relative">
              <Doughnut
                data={performanceData}
                options={{
                  ...chartOptions,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">76%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-gray-400">Acertos</p>
              <p className="text-xl font-bold text-green-500">76%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Erros</p>
              <p className="text-xl font-bold text-red-500">24%</p>
            </div>
          </div>
        </div>

        {/* Study Time Evolution */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Evolução no Tempo</h3>
          <div className="h-[300px]">
            <Line data={studyTimeEvolutionData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Performance Evolution and Area Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Evolução do Desempenho</h3>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-gray-700 rounded-lg px-3 py-1 text-sm"
            >
              {majorAreas.map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </div>
          <div className="h-[300px]">
            <Line 
              data={getPerformanceEvolutionData(selectedArea)} 
              options={performanceEvolutionOptions}
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Distribuição por Área</h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-[300px]">
              <Doughnut
                data={areaDistributionData}
                options={{
                  ...chartOptions,
                  cutout: '60%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Topics Table */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Tópicos x Desempenho</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-4 text-gray-400">Disciplina</th>
                  <th className="pb-4 text-gray-400">Tópico</th>
                  <th className="pb-4 text-gray-400 text-center">Questões</th>
                  <th className="pb-4 text-gray-400 text-center">Desempenho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr className="text-sm">
                  <td className="py-4">Direito Civil</td>
                  <td className="py-4">Pessoa Jurídica</td>
                  <td className="py-4 text-center">18</td>
                  <td className="py-4 text-center">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">82%</span>
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="py-4">Direito Processual Civil</td>
                  <td className="py-4">Da jurisdição</td>
                  <td className="py-4 text-center">25</td>
                  <td className="py-4 text-center">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">71%</span>
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="py-4">Direito Constitucional</td>
                  <td className="py-4">Constituição</td>
                  <td className="py-4 text-center">7</td>
                  <td className="py-4 text-center">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">58%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">Pontos Fortes</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Melhor desempenho em Clínica Médica (85%)</li>
                <li>Constância de estudos acima da meta</li>
                <li>Evolução consistente no desempenho</li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">Pontos de Atenção</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Pediatria com desempenho abaixo do esperado</li>
                <li>3 tópicos com taxa de acerto ≤ 64%</li>
                <li>Baixa dedicação à Medicina Preventiva</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2">Recomendações</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Aumentar tempo de estudo em Pediatria</li>
                <li>Revisar tópicos com baixo desempenho</li>
                <li>Manter ritmo atual de questões diárias</li>
                <li>Equilibrar distribuição entre áreas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Modal */}
      {isFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Filtros</h3>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Disciplinas</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Cirurgia', 'Clínica Médica', 'GO', 'Preventiva', 'Pediatria'].map((discipline) => (
                    <label key={discipline} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.disciplines.includes(discipline)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              disciplines: [...prev.disciplines, discipline]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              disciplines: prev.disciplines.filter(d => d !== discipline)
                            }));
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                      />
                      <span>{discipline}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Categorias</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Teoria', 'Questões', 'Revisões', 'Videoaulas'].map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              categories: [...prev.categories, category]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              categories: prev.categories.filter(c => c !== category)
                            }));
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Desempenho</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.performance.includes('high')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            performance: [...prev.performance, 'high']
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            performance: prev.performance.filter(p => p !== 'high')
                          }));
                        }
                      }}
                      className="form-checkbox h-4 w-4 text-green-500 rounded"
                    />
                    <span className="text-green-500">≥75%</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.performance.includes('medium')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            performance: [...prev.performance, 'medium']
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            performance: prev.performance.filter(p => p !== 'medium')
                          }));
                        }
                      }}
                      className="form-checkbox h-4 w-4 text-yellow-500 rounded"
                    />
                    <span className="text-yellow-500">65-74%</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.performance.includes('low')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            performance: [...prev.performance, 'low']
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            performance: prev.performance.filter(p => p !== 'low')
                          }));
                        }
                      }}
                      className="form-checkbox h-4 w-4 text-red-500 rounded"
                    />
                    <span className="text-red-500">≤64%</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo de Estudo</label>
                <select
                  value={filters.studyType}
                  onChange={(e) => setFilters(prev => ({ ...prev, studyType: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="all">Todos</option>
                  <option value="theory">Teoria</option>
                  <option value="questions">Questões</option>
                  <option value="revisions">Revisões</option>
                  <option value="videos">Videoaulas</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setFilters({
                  disciplines: [],
                  categories: [],
                  performance: [],
                  studyType: 'all'
                })}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pomodoro Timer Button */}
      <button
        onClick={() => setIsPomodoroOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
      >
        <Timer size={24} />
      </button>

      {/* Pomodoro Timer Modal */}
      {isPomodoroOpen && (
        <PomodoroTimer onClose={() => setIsPomodoroOpen(false)} />
      )}
    </div>
  );
}