import React, { useState } from 'react';
import { X, Clock, CheckCircle, XCircle, Percent, Circle } from 'lucide-react';
import type { Topic } from '../lib/types';

interface TopicViewModalProps {
  weekName: string;
  topics: Topic[];
  onClose: () => void;
  onTopicClick: (topic: Topic) => void;
  onEditWeek: (name: string, topics: string[]) => void;
}

const relevanceColors = [
  { value: 1, color: '#60A5FA' }, // Light Blue
  { value: 2, color: '#34D399' }, // Light Green
  { value: 3, color: '#FBBF24' }, // Yellow
  { value: 4, color: '#F97316' }, // Orange
  { value: 5, color: '#EF4444' }, // Red
  { value: 6, color: '#A855F7' }, // Purple
  { value: 7, color: '#1F2937' }, // Black
];

export function TopicViewModal({ weekName, topics, onClose, onTopicClick, onEditWeek }: TopicViewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(weekName);
  const [editedTopics, setEditedTopics] = useState(topics.map(t => t.name).join('\n'));

  const completedTopics = topics.filter(topic => topic.completed).length;
  const progressPercentage = (completedTopics / topics.length) * 100;

  const handleSave = () => {
    const topicsList = editedTopics.split('\n').filter(t => t.trim());
    onEditWeek(editedName, topicsList);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-2xl font-semibold bg-gray-700 rounded px-2 py-1"
            />
          ) : (
            <h3 className="text-2xl font-semibold">{weekName}</h3>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Progresso</span>
            <span className="font-semibold">{completedTopics}/{topics.length} tópicos</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {isEditing ? (
          <div className="mb-6">
            <textarea
              value={editedTopics}
              onChange={(e) => setEditedTopics(e.target.value)}
              className="w-full h-48 bg-gray-700 rounded-lg p-4 mb-4"
              placeholder="Digite os tópicos (um por linha)"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onTopicClick(topic)}
                className="w-full bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors text-left"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{topic.name}</h4>
                    {topic.total_questions > 0 && (
                      <Circle
                        size={12}
                        fill={relevanceColors[Math.floor(topic.total_questions / 15) - 1]?.color}
                        className="flex-shrink-0"
                      />
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    topic.completed ? 'bg-emerald-900 text-emerald-200' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {topic.completed ? 'Concluído' : 'Pendente'}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={16} />
                    <span>{Math.floor(topic.study_time_minutes / 60)}h {topic.study_time_minutes % 60}min</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={16} />
                    <span>{topic.correct_answers}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle size={16} />
                    <span>{topic.wrong_answers}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Percent size={16} />
                    <span>{topic.accuracy_percentage.toFixed(1)}%</span>
                  </div>
                </div>

                {topic.total_questions > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          topic.accuracy_percentage >= 75 ? 'bg-green-500' :
                          topic.accuracy_percentage >= 65 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, topic.accuracy_percentage)}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Editar Semana
          </button>
        )}
      </div>
    </div>
  );
}