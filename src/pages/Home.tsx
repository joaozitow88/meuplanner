import React, { useState } from 'react';
import { BarChart2, Clock, Target, TrendingUp, CheckCircle, XCircle, Percent, Timer, BookOpen, AlertCircle, ClipboardList, History, Plus, Pencil, Trash2, Check } from 'lucide-react';
import { useReminderStore } from '../store/reminderStore';
import { StudyGoals } from '../components/StudyGoals';
import { StudyCalendar } from '../components/StudyCalendar';
import { WeeklyStudyChart } from '../components/WeeklyStudyChart';
import { DailyStudyPieChart } from '../components/DailyStudyPieChart';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { ExamCountdown } from '../components/ExamCountdown';

export function Home() {
  const { checklists, addChecklist, toggleChecklist, removeChecklist, editChecklist } = useReminderStore();
  const [newChecklist, setNewChecklist] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklist.trim()) {
      addChecklist(newChecklist.trim());
      setNewChecklist('');
    }
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleEdit = (id: string) => {
    if (editingText.trim()) {
      editChecklist(id, editingText.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <h1 className="text-3xl font-bold mb-8">Bem vindo, João</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ExamCountdown />
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tempo Total de Estudo</h3>
            <Clock className="text-indigo-500" size={24} />
          </div>
          <p className="text-3xl font-bold">0h 00min</p>
          <p className="text-gray-400 text-sm mt-2">Total acumulado</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Desempenho</h3>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold">0%</p>
          <p className="text-gray-400 text-sm mt-2">Média geral</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Progresso</h3>
            <Target className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold">0%</p>
          <p className="text-gray-400 text-sm mt-2">Do edital</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Painel de Disciplinas</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-6 text-sm font-medium text-gray-400 pb-2 border-b border-gray-700">
              <div className="col-span-2">Disciplina</div>
              <div className="text-center">Tempo</div>
              <div className="text-center">Acertos</div>
              <div className="text-center">Erros</div>
              <div className="text-center">%</div>
            </div>
            {['Português', 'Matemática', 'Direito Constitucional', 'Direito Administrativo'].map((disciplina) => (
              <div key={disciplina} className="grid grid-cols-6 items-center text-sm">
                <div className="col-span-2">{disciplina}</div>
                <div className="text-center flex justify-center"><Timer size={16} className="mr-1" /> 0h</div>
                <div className="text-center flex justify-center"><CheckCircle size={16} className="text-green-500 mr-1" /> 0</div>
                <div className="text-center flex justify-center"><XCircle size={16} className="text-red-500 mr-1" /> 0</div>
                <div className="text-center flex justify-center"><Percent size={16} className="text-blue-500 mr-1" /> 0%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Metas de Estudo Semanal</h3>
          <StudyGoals />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Revisões para Hoje</h3>
            <BookOpen className="text-indigo-500" size={24} />
          </div>
          <div className="flex items-center justify-center py-8 text-gray-400">
            <AlertCircle className="mr-2" size={20} />
            <p>Você não tem revisões agendadas para hoje.</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Estudos do Dia</h3>
            <BookOpen className="text-blue-500" size={24} />
          </div>
          <DailyStudyPieChart />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Estudo Semanal</h3>
        <WeeklyStudyChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Lembretes</h3>
            <ClipboardList className="text-yellow-500" size={24} />
          </div>
          
          <form onSubmit={handleAddChecklist} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklist}
                onChange={(e) => setNewChecklist(e.target.value)}
                placeholder="Adicionar novo lembrete..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {checklists.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-gray-400">
                <AlertCircle className="mr-2" size={20} />
                <p>Você ainda não criou nenhum lembrete.</p>
              </div>
            ) : (
              checklists.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 bg-gray-700 rounded-lg p-3"
                >
                  <button
                    onClick={() => toggleChecklist(item.id)}
                    className={`flex-shrink-0 w-5 h-5 border-2 rounded ${
                      item.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-400'
                    } flex items-center justify-center`}
                  >
                    {item.completed && <Check size={14} className="text-white" />}
                  </button>
                  
                  {editingId === item.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="flex-1 bg-gray-600 text-white rounded px-2 py-1"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-green-500 hover:text-green-400"
                      >
                        <Check size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                        {item.text}
                      </span>
                      <button
                        onClick={() => startEditing(item.id, item.text)}
                        className="text-blue-500 hover:text-blue-400"
                      >
                        <Pencil size={16} />
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => removeChecklist(item.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Últimas Atividades</h3>
            <History className="text-purple-500" size={24} />
          </div>
          <div className="flex items-center justify-center py-8 text-gray-400">
            <AlertCircle className="mr-2" size={20} />
            <p>Nenhuma atividade registrada ontem.</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsPomodoroOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
      >
        <Timer size={24} />
      </button>

      {isPomodoroOpen && (
        <PomodoroTimer onClose={() => setIsPomodoroOpen(false)} />
      )}
    </div>
  );
}