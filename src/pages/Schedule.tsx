import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, Clock, Target, CheckCircle, Timer } from 'lucide-react';
import { TopicViewModal } from '../components/TopicViewModal';
import { StudyRecordModal } from '../components/StudyRecordModal';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { usePlannerStore } from '../store/plannerStore';
import type { WeekWithStats, Topic } from '../lib/types';

export function Schedule() {
  const { weeks, addWeek, deleteWeek, updateWeekName, updateTopicStats } = usePlannerStore();
  const [selectedWeek, setSelectedWeek] = useState<WeekWithStats | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isNewWeekModalOpen, setIsNewWeekModalOpen] = useState(false);
  const [newWeekName, setNewWeekName] = useState('');
  const [newTopics, setNewTopics] = useState('');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [weekToDelete, setWeekToDelete] = useState<WeekWithStats | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  const handleCreateWeek = () => {
    if (!newWeekName.trim() || !newTopics.trim()) return;
    const topicsList = newTopics.split('\n').filter(t => t.trim());
    addWeek(newWeekName.trim(), topicsList);
    setIsNewWeekModalOpen(false);
    setNewWeekName('');
    setNewTopics('');
  };

  const handleViewWeek = (week: WeekWithStats) => {
    setSelectedWeek(week);
  };

  const handleConfirmDelete = () => {
    if (!weekToDelete) return;
    deleteWeek(weekToDelete.id);
    setIsConfirmDeleteOpen(false);
    setWeekToDelete(null);
  };

  const handleEditWeek = (weekId: string, name: string, topics: string[]) => {
    updateWeekName(weekId, name, topics);
  };

  const handleSaveStudyRecord = (data: {
    date: Date;
    relevance: number;
    majorArea: string;
    subjectName: string;
    correctAnswers: number;
  }) => {
    if (!selectedTopic || !selectedWeek) return;

    const questionsTarget = data.relevance * 10;
    const wrongAnswers = questionsTarget - data.correctAnswers;
    const accuracyPercentage = (data.correctAnswers / questionsTarget) * 100;

    updateTopicStats(selectedWeek.id, selectedTopic.id, {
      total_questions: questionsTarget,
      correct_answers: data.correctAnswers,
      wrong_answers: wrongAnswers,
      accuracy_percentage: accuracyPercentage,
      completed: accuracyPercentage >= 75,
    });

    setSelectedTopic(null);
  };

  const totalWeeks = weeks.length;
  const totalTopics = weeks.reduce((acc, week) => acc + week.totalTopics, 0);
  const totalQuestionsCompleted = weeks.reduce((acc, week) => acc + week.questionsCompleted, 0);
  const totalCompletedTopics = weeks.reduce((acc, week) => acc + week.completedTopics, 0);
  const averageAccuracy = weeks.length > 0
    ? weeks.reduce((acc, week) => acc + (week.accuracy_percentage || 0), 0) / weeks.length
    : 0;

  return (
    <div className="min-h-screen relative">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Plano Residência Médica - Anestesiologia
        </h1>
        <div className="flex items-center gap-8 mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <span>Semanas:</span>
            <span className="font-semibold text-white">{totalWeeks}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>Tópicos:</span>
            <span className="font-semibold text-white">{totalTopics}</span>
          </div>
        </div>
        <button
          onClick={() => setIsNewWeekModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nova Semana
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Progresso</h3>
            <Target className="text-emerald-500" size={24} />
          </div>
          <p className="text-3xl font-bold">
            {totalCompletedTopics}/{totalTopics}
          </p>
          <p className="text-gray-400 text-sm mt-2">Tópicos concluídos</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Questões</h3>
            <CheckCircle className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold">{totalQuestionsCompleted}</p>
          <p className="text-gray-400 text-sm mt-2">Questões resolvidas</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Desempenho</h3>
            <Clock className="text-purple-500" size={24} />
          </div>
          <p className="text-3xl font-bold">{averageAccuracy.toFixed(1)}%</p>
          <p className="text-gray-400 text-sm mt-2">Média geral</p>
        </div>
      </div>

      {/* Weeks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weeks.map((week) => (
          <div
            key={week.id}
            className="bg-gray-800 rounded-lg p-6 group relative hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-4">{week.name}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Progresso</span>
                  <span>{week.completedTopics}/{week.totalTopics} tópicos</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${(week.completedTopics / week.totalTopics) * 100}%` }}
                  />
                </div>
              </div>
              
              <p className="text-gray-400">
                {week.questionsCompleted} questões resolvidas
              </p>
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <button
                onClick={() => handleViewWeek(week)}
                className="p-2 hover:bg-indigo-600 rounded-full transition-colors"
              >
                <Eye size={20} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setSelectedWeek(week);
                  setNewWeekName(week.name);
                }}
                className="p-2 hover:bg-indigo-600 rounded-full transition-colors"
              >
                <Pencil size={20} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setWeekToDelete(week);
                  setIsConfirmDeleteOpen(true);
                }}
                className="p-2 hover:bg-red-600 rounded-full transition-colors"
              >
                <Trash2 size={20} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Week Modal */}
      {isNewWeekModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Nova Semana</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome da Semana</label>
                <input
                  type="text"
                  value={newWeekName}
                  onChange={(e) => setNewWeekName(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  placeholder="Ex: Semana 1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tópicos</label>
                <textarea
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  rows={4}
                  placeholder="Digite os tópicos (um por linha)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsNewWeekModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateWeek}
                disabled={!newWeekName.trim() || !newTopics.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topic View Modal */}
      {selectedWeek && (
        <TopicViewModal
          weekName={selectedWeek.name}
          topics={selectedWeek.topics}
          onClose={() => setSelectedWeek(null)}
          onTopicClick={(topic) => setSelectedTopic(topic)}
          onEditWeek={(name, topics) => handleEditWeek(selectedWeek.id, name, topics)}
        />
      )}

      {/* Study Record Modal */}
      {selectedTopic && (
        <StudyRecordModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
          onSave={handleSaveStudyRecord}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmDeleteOpen && weekToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-400 mb-6">
              Tem certeza que deseja excluir a semana "{weekToDelete.name}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
              >
                Excluir
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