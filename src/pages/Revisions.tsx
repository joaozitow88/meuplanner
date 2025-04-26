import React, { useState } from 'react';
import { Clock, AlertCircle, CheckCircle, Timer, ChevronDown, ChevronUp } from 'lucide-react';
import { format, addDays, isBefore, isAfter, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import { PomodoroTimer } from '../components/PomodoroTimer';

type RevisionType = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'RF';

interface Revision {
  id: string;
  type: RevisionType;
  majorArea: string;
  subject: string;
  topic: string;
  dueDate: Date;
  relevance: number;
  completed?: {
    date: Date;
    questions: number;
    correct: number;
    wrong: number;
    accuracy: number;
    timeSpent: number;
  };
}

const revisionColors: Record<RevisionType, string> = {
  R1: '#4F46E5', // Indigo
  R2: '#22C55E', // Green
  R3: '#EAB308', // Yellow
  R4: '#EC4899', // Pink
  R5: '#8B5CF6', // Purple
  RF: '#F97316', // Orange
};

const mockRevisions: Revision[] = [
  {
    id: '1',
    type: 'R1',
    majorArea: 'CIR',
    subject: 'Anestesia Geral',
    topic: 'Farmacologia dos Anestésicos',
    dueDate: new Date(),
    relevance: 3,
  },
  {
    id: '2',
    type: 'R2',
    majorArea: 'CLM',
    subject: 'Ventilação Mecânica',
    topic: 'Modos Ventilatórios',
    dueDate: addDays(new Date(), -2),
    relevance: 4,
  },
  {
    id: '3',
    type: 'R3',
    majorArea: 'GO',
    subject: 'Anestesia Obstétrica',
    topic: 'Cesariana',
    dueDate: addDays(new Date(), 2),
    relevance: 5,
  },
];

export function Revisions() {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'late' | 'completed'>('scheduled');
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);
  const [completionDate, setCompletionDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [expandedTypes, setExpandedTypes] = useState<RevisionType[]>([]);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  const toggleRevisionType = (type: RevisionType) => {
    setExpandedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getQuestionsTarget = (relevance: number) => {
    const targets = [15, 20, 30, 40, 50, 60, 100];
    return targets[relevance - 1] || 15;
  };

  const scheduled = mockRevisions.filter(r => 
    !r.completed && isAfter(r.dueDate, new Date())
  );

  const late = mockRevisions.filter(r =>
    !r.completed && isBefore(r.dueDate, new Date())
  );

  const completed = mockRevisions.filter(r => r.completed);

  const renderRevisionCard = (revision: Revision) => {
    const isLate = isBefore(revision.dueDate, new Date()) && !revision.completed;
    const daysLate = isLate ? differenceInDays(new Date(), revision.dueDate) : 0;

    return (
      <div
        key={revision.id}
        className={`bg-gray-800 rounded-lg p-6 ${
          isLate ? 'border border-red-500/20' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: revisionColors[revision.type] }}
            >
              {revision.type}
            </span>
            <span className="text-gray-400">{revision.majorArea}</span>
          </div>
          {isLate && (
            <div className="flex items-center text-red-500 gap-2">
              <AlertCircle size={16} />
              <span>{daysLate} dias atrasada</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2">{revision.subject}</h3>
        <p className="text-gray-400 mb-4">{revision.topic}</p>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Data prevista: {format(revision.dueDate, 'dd/MM/yyyy')}
          </div>
          {!revision.completed && (
            <button
              onClick={() => setSelectedRevision(revision)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              Concluir Revisão
            </button>
          )}
        </div>

        {revision.completed && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Questões:</span>
                <span className="ml-2">{revision.completed.questions}</span>
              </div>
              <div>
                <span className="text-gray-400">Acertos:</span>
                <span className="ml-2 text-green-500">{revision.completed.correct}</span>
              </div>
              <div>
                <span className="text-gray-400">Erros:</span>
                <span className="ml-2 text-red-500">{revision.completed.wrong}</span>
              </div>
              <div>
                <span className="text-gray-400">Tempo:</span>
                <span className="ml-2">{revision.completed.timeSpent}min</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">Desempenho</span>
                <span className={`text-sm font-semibold ${
                  revision.completed.accuracy >= 75 ? 'text-green-500' :
                  revision.completed.accuracy >= 65 ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {revision.completed.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    revision.completed.accuracy >= 75 ? 'bg-green-500' :
                    revision.completed.accuracy >= 65 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, revision.completed.accuracy)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Revisões</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'scheduled', label: 'Programadas', count: scheduled.length },
          { id: 'late', label: 'Atrasadas', count: late.length },
          { id: 'completed', label: 'Concluídas', count: completed.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.label}
            <span className="px-2 py-0.5 rounded-full bg-gray-700 text-sm">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'scheduled' && scheduled.map(renderRevisionCard)}
        {activeTab === 'late' && late.map(renderRevisionCard)}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {(Object.keys(revisionColors) as RevisionType[]).map((type) => {
              const typeRevisions = completed.filter(r => r.type === type);
              if (typeRevisions.length === 0) return null;

              return (
                <div key={type} className="bg-gray-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleRevisionType(type)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: revisionColors[type] }}
                      >
                        {type}
                      </span>
                      <span className="text-gray-400">
                        {typeRevisions.length} revisões
                      </span>
                    </div>
                    {expandedTypes.includes(type) ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  {expandedTypes.includes(type) && (
                    <div className="p-4 space-y-4">
                      {typeRevisions.map(renderRevisionCard)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {selectedRevision && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              Concluir Revisão: {selectedRevision.subject}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Data da Realização
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-left flex items-center gap-2"
                  >
                    <Clock size={20} />
                    <span>{format(completionDate, 'dd/MM/yyyy')}</span>
                  </button>
                  
                  {isCalendarOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-gray-700 rounded-lg p-4 shadow-lg z-50">
                      <DayPicker
                        mode="single"
                        selected={completionDate}
                        onSelect={(d) => {
                          if (d) {
                            setCompletionDate(d);
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Questões
                  </label>
                  <input
                    type="number"
                    value={getQuestionsTarget(selectedRevision.relevance)}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Acertos
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Tempo de Estudo (minutos)
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setSelectedRevision(null)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
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