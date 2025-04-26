import React, { useState } from 'react';
import { Settings, Check, X } from 'lucide-react';
import { useStudyGoalsStore } from '../store/studyGoalsStore';

export function StudyGoals() {
  const { studyHours, questions, updateStudyHoursTarget, updateStudyHoursCurrent, updateQuestionsTarget, updateQuestionsCurrent } = useStudyGoalsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoals, setTempGoals] = useState({
    studyHours: { ...studyHours },
    questions: { ...questions }
  });

  const hoursPercentage = (studyHours.current / studyHours.target) * 100;
  const questionsPercentage = (questions.current / questions.target) * 100;

  const handleSave = () => {
    updateStudyHoursTarget(tempGoals.studyHours.target);
    updateStudyHoursCurrent(tempGoals.studyHours.current);
    updateQuestionsTarget(tempGoals.questions.target);
    updateQuestionsCurrent(tempGoals.questions.current);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-0 right-0 -mt-10 text-gray-400 hover:text-white transition-colors"
      >
        <Settings size={20} />
      </button>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Editar Metas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Horas de Estudo</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={tempGoals.studyHours.current}
                    onChange={(e) => setTempGoals(prev => ({
                      ...prev,
                      studyHours: { ...prev.studyHours, current: Math.max(0, Number(e.target.value)) }
                    }))}
                    className="w-24 bg-gray-700 rounded px-3 py-2"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={tempGoals.studyHours.target}
                    onChange={(e) => setTempGoals(prev => ({
                      ...prev,
                      studyHours: { ...prev.studyHours, target: Math.max(1, Number(e.target.value)) }
                    }))}
                    className="w-24 bg-gray-700 rounded px-3 py-2"
                  />
                  <span>h</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Questões</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={tempGoals.questions.current}
                    onChange={(e) => setTempGoals(prev => ({
                      ...prev,
                      questions: { ...prev.questions, current: Math.max(0, Number(e.target.value)) }
                    }))}
                    className="w-24 bg-gray-700 rounded px-3 py-2"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={tempGoals.questions.target}
                    onChange={(e) => setTempGoals(prev => ({
                      ...prev,
                      questions: { ...prev.questions, target: Math.max(1, Number(e.target.value)) }
                    }))}
                    className="w-24 bg-gray-700 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2"
              >
                <Check size={18} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span>Horas de Estudo</span>
            <span className="font-semibold">{studyHours.current}/{studyHours.target}h</span>
          </div>
          <div className="relative w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, hoursPercentage)}%` }}
            />
            <span className="absolute right-0 -bottom-6 text-sm text-gray-400">
              {hoursPercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span>Questões</span>
            <span className="font-semibold">{questions.current}/{questions.target}</span>
          </div>
          <div className="relative w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, questionsPercentage)}%` }}
            />
            <span className="absolute right-0 -bottom-6 text-sm text-gray-400">
              {questionsPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}