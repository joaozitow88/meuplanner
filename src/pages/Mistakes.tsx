import React, { useState } from 'react';
import { Filter, Search, ChevronDown, ChevronUp, Timer, BarChart2, PieChart, Target, AlertCircle, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { PomodoroTimer } from '../components/PomodoroTimer';

interface Mistake {
  id: string;
  weekName: string;
  majorArea: string;
  topicName: string;
  questionNumber: number;
  reason: string;
  errorType: 'attention' | 'knowledge' | 'trick';
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
  date: Date;
}

const mockMistakes: Mistake[] = [
  {
    id: '1',
    weekName: 'Semana 1',
    majorArea: 'CLM',
    topicName: 'Ventilação Mecânica',
    questionNumber: 15,
    reason: 'Confundi os parâmetros de pressão com volume',
    errorType: 'knowledge',
    difficulty: 'hard',
    date: new Date(),
  },
  {
    id: '2',
    weekName: 'Semana 1',
    majorArea: 'CIR',
    topicName: 'Anestesia Geral',
    questionNumber: 23,
    reason: 'Não li o enunciado completo',
    errorType: 'attention',
    difficulty: 'medium',
    date: new Date(),
  },
];

const errorTypeLabels = {
  attention: 'Falta de Atenção',
  knowledge: 'Falta de Conhecimento',
  trick: 'Pegadinha',
};

const difficultyLabels = {
  easy: 'Fácil',
  medium: 'Média',
  hard: 'Difícil',
  'very-hard': 'Muito Difícil',
};

export function Mistakes() {
  const [mistakes, setMistakes] = useState<Mistake[]>(mockMistakes);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [isNewMistakeModalOpen, setIsNewMistakeModalOpen] = useState(false);
  const [isEditMistakeModalOpen, setIsEditMistakeModalOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [mistakeToEdit, setMistakeToEdit] = useState<Mistake | null>(null);
  const [editForm, setEditForm] = useState({
    weekName: '',
    majorArea: '',
    topicName: '',
    questionNumber: 0,
    reason: '',
    errorType: '' as 'attention' | 'knowledge' | 'trick',
    difficulty: '' as 'easy' | 'medium' | 'hard' | 'very-hard',
  });

  const handleEditMistake = (mistake: Mistake) => {
    setMistakeToEdit(mistake);
    setEditForm({
      weekName: mistake.weekName,
      majorArea: mistake.majorArea,
      topicName: mistake.topicName,
      questionNumber: mistake.questionNumber,
      reason: mistake.reason,
      errorType: mistake.errorType,
      difficulty: mistake.difficulty,
    });
    setIsEditMistakeModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!mistakeToEdit) return;
    
    setMistakes(prev => prev.map(mistake => 
      mistake.id === mistakeToEdit.id 
        ? { ...mistake, ...editForm }
        : mistake
    ));
    
    setIsEditMistakeModalOpen(false);
    setMistakeToEdit(null);
  };

  const handleDeleteMistake = (mistakeId: string) => {
    if (confirm('Tem certeza que deseja excluir este erro?')) {
      setMistakes(prev => prev.filter(mistake => mistake.id !== mistakeId));
    }
  };

  const toggleWeek = (weekName: string) => {
    setExpandedWeeks(prev =>
      prev.includes(weekName)
        ? prev.filter(w => w !== weekName)
        : [...prev, weekName]
    );
  };

  // Group mistakes by week
  const mistakesByWeek = mistakes.reduce((acc, mistake) => {
    if (!acc[mistake.weekName]) {
      acc[mistake.weekName] = [];
    }
    acc[mistake.weekName].push(mistake);
    return acc;
  }, {} as Record<string, Mistake[]>);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Erros</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar erros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setIsNewMistakeModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span>Adicionar Erro</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total de Erros</h3>
            <Target className="text-indigo-500" size={24} />
          </div>
          <p className="text-3xl font-bold">24</p>
          <p className="text-gray-400 text-sm mt-2">Últimos 30 dias</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tipo Mais Comum</h3>
            <BarChart2 className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold">Atenção</p>
          <p className="text-gray-400 text-sm mt-2">45% dos erros</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Área Crítica</h3>
            <PieChart className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold">CLM</p>
          <p className="text-gray-400 text-sm mt-2">8 erros esta semana</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Dificuldade Média</h3>
            <Timer className="text-purple-500" size={24} />
          </div>
          <p className="text-3xl font-bold">Média</p>
          <p className="text-gray-400 text-sm mt-2">60% dos casos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2"
        >
          <option value="">Todas as Semanas</option>
          <option value="1">Semana 1</option>
          <option value="2">Semana 2</option>
        </select>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2"
        >
          <option value="">Todas as Áreas</option>
          <option value="CIR">Cirurgia</option>
          <option value="CLM">Clínica Médica</option>
          <option value="GO">GO</option>
          <option value="PREV">Preventiva</option>
          <option value="PED">Pediatria</option>
        </select>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2"
        >
          <option value="">Todos os Tópicos</option>
          <option value="1">Ventilação Mecânica</option>
          <option value="2">Anestesia Geral</option>
        </select>
      </div>

      {/* Mistakes List */}
      <div className="space-y-4">
        {Object.entries(mistakesByWeek).map(([weekName, mistakes]) => (
          <div key={weekName} className="bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleWeek(weekName)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold">{weekName}</span>
                <span className="text-gray-400">
                  {mistakes.length} erros
                </span>
              </div>
              {expandedWeeks.includes(weekName) ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            
            {expandedWeeks.includes(weekName) && (
              <div className="p-4 space-y-4">
                {mistakes.map((mistake) => (
                  <div
                    key={mistake.id}
                    className="bg-gray-700 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{mistake.topicName}</h4>
                        <p className="text-sm text-gray-400">{mistake.majorArea}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-gray-600 px-2 py-1 rounded">
                          Questão {mistake.questionNumber}
                        </span>
                        <button
                          onClick={() => handleEditMistake(mistake)}
                          className="p-1 hover:bg-blue-600 rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMistake(mistake.id)}
                          className="p-1 hover:bg-red-600 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm">{mistake.reason}</p>

                    <div className="flex gap-4 text-sm">
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded">
                        {errorTypeLabels[mistake.errorType]}
                      </span>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded">
                        {difficultyLabels[mistake.difficulty]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {Object.keys(mistakesByWeek).length === 0 && (
          <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center text-gray-400">
            <AlertCircle className="mr-2" size={20} />
            <p>Nenhum erro registrado ainda.</p>
          </div>
        )}
      </div>

      {/* New Mistake Modal */}
      {isNewMistakeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-800 pb-4">
              <h3 className="text-xl font-semibold">Adicionar Erro</h3>
              <button
                onClick={() => setIsNewMistakeModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Semana</label>
                <select className="w-full bg-gray-700 rounded-lg px-4 py-2">
                  <option value="">Selecione uma semana</option>
                  <option value="1">Semana 1</option>
                  <option value="2">Semana 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Grande Área</label>
                <select className="w-full bg-gray-700 rounded-lg px-4 py-2">
                  <option value="">Selecione uma área</option>
                  <option value="CIR">Cirurgia</option>
                  <option value="CLM">Clínica Médica</option>
                  <option value="GO">GO</option>
                  <option value="PREV">Preventiva</option>
                  <option value="PED">Pediatria</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tópico</label>
                <select className="w-full bg-gray-700 rounded-lg px-4 py-2">
                  <option value="">Selecione um tópico</option>
                  <option value="1">Ventilação Mecânica</option>
                  <option value="2">Anestesia Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Número da Questão</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Motivo do Erro</label>
                <textarea
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 h-24 resize-none"
                  placeholder="Descreva o que te levou ao erro..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo de Erro</label>
                <select className="w-full bg-gray-700 rounded-lg px-4 py-2">
                  <option value="">Selecione o tipo</option>
                  <option value="attention">Falta de Atenção</option>
                  <option value="knowledge">Falta de Conhecimento</option>
                  <option value="trick">Pegadinha</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Nível de Dificuldade</label>
                <select className="w-full bg-gray-700 rounded-lg px-4 py-2">
                  <option value="">Selecione a dificuldade</option>
                  <option value="easy">Fácil</option>
                  <option value="medium">Média</option>
                  <option value="hard">Difícil</option>
                  <option value="very-hard">Muito Difícil</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-gray-800 pt-4">
              <button
                onClick={() => setIsNewMistakeModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mistake Modal */}
      {isEditMistakeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-800 pb-4">
              <h3 className="text-xl font-semibold">Editar Erro</h3>
              <button
                onClick={() => setIsEditMistakeModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Semana</label>
                <select
                  value={editForm.weekName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, weekName: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Selecione uma semana</option>
                  <option value="Semana 1">Semana 1</option>
                  <option value="Semana 2">Semana 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Grande Área</label>
                <select
                  value={editForm.majorArea}
                  onChange={(e) => setEditForm(prev => ({ ...prev, majorArea: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Selecione uma área</option>
                  <option value="CIR">Cirurgia</option>
                  <option value="CLM">Clínica Médica</option>
                  <option value="GO">GO</option>
                  <option value="PREV">Preventiva</option>
                  <option value="PED">Pediatria</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tópico</label>
                <select
                  value={editForm.topicName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, topicName: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Selecione um tópico</option>
                  <option value="Ventilação Mecânica">Ventilação Mecânica</option>
                  <option value="Anestesia Geral">Anestesia Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Número da Questão</label>
                <input
                  type="number"
                  value={editForm.questionNumber}
                  onChange={(e) => setEditForm(prev => ({ ...prev, questionNumber: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Motivo do Erro</label>
                <textarea
                  value={editForm.reason}
                  onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo de Erro</label>
                <select
                  value={editForm.errorType}
                  onChange={(e) => setEditForm(prev => ({ ...prev, errorType: e.target.value as typeof editForm.errorType }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="attention">Falta de Atenção</option>
                  <option value="knowledge">Falta de Conhecimento</option>
                  <option value="trick">Pegadinha</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Nível de Dificuldade</label>
                <select
                  value={editForm.difficulty}
                  onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value as typeof editForm.difficulty }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="">Selecione a dificuldade</option>
                  <option value="easy">Fácil</option>
                  <option value="medium">Média</option>
                  <option value="hard">Difícil</option>
                  <option value="very-hard">Muito Difícil</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-gray-800 pt-4">
              <button
                onClick={() => setIsEditMistakeModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Salvar
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