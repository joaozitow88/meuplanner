import React, { useState } from 'react';
import { X, Calendar, AlertCircle, Check } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Topic } from '../lib/types';

interface StudyRecordModalProps {
  topic: Topic;
  onClose: () => void;
  onSave: (data: {
    date: Date;
    relevance: number;
    majorArea: string;
    subjectName: string;
    correctAnswers: number;
  }) => void;
}

const relevanceColors = [
  { value: 1, color: '#60A5FA', questions: 15 }, // Light Blue
  { value: 2, color: '#34D399', questions: 20 }, // Light Green
  { value: 3, color: '#FBBF24', questions: 30 }, // Yellow
  { value: 4, color: '#F97316', questions: 40 }, // Orange
  { value: 5, color: '#EF4444', questions: 50 }, // Red
  { value: 6, color: '#A855F7', questions: 60 }, // Purple
  { value: 7, color: '#1F2937', questions: 100 }, // Black
];

const majorAreas = [
  { value: 'CIR', label: 'Cirurgia' },
  { value: 'CLM', label: 'Clínica Médica' },
  { value: 'GO', label: 'Ginecologia e Obstetrícia' },
  { value: 'PREV', label: 'Medicina Preventiva' },
  { value: 'PED', label: 'Pediatria' },
];

export function StudyRecordModal({ topic, onClose, onSave }: StudyRecordModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [relevance, setRelevance] = useState(1);
  const [majorArea, setMajorArea] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const selectedRelevance = relevanceColors.find(r => r.value === relevance);
  const totalQuestions = selectedRelevance?.questions || 0;
  const wrongAnswers = totalQuestions - correctAnswers;
  const accuracyPercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const isValidAccuracy = accuracyPercentage >= 65;

  const handleSave = () => {
    if (!isValidAccuracy) return;

    onSave({
      date,
      relevance,
      majorArea,
      subjectName,
      correctAnswers,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold">Registro de Estudo: {topic.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-4">
            {/* Date Picker */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Data do Estudo</label>
              <div className="relative">
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-left flex items-center gap-2"
                >
                  <Calendar size={20} />
                  <span>{format(date, 'dd/MM/yyyy')}</span>
                </button>
                
                {isCalendarOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-gray-700 rounded-lg p-4 shadow-lg z-50">
                    <DayPicker
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        if (d) {
                          setDate(d);
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

            {/* Relevance */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Relevância</label>
              <div className="flex gap-2">
                {relevanceColors.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRelevance(r.value)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white transition-transform ${
                      relevance === r.value ? 'transform scale-110 ring-2 ring-white' : ''
                    }`}
                    style={{ backgroundColor: r.color }}
                  >
                    {r.value}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Meta de questões: {selectedRelevance?.questions}
              </p>
            </div>

            {/* Major Area */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Grande Área</label>
              <select
                value={majorArea}
                onChange={(e) => setMajorArea(e.target.value)}
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
              >
                <option value="">Selecione uma área</option>
                {majorAreas.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nome da Matéria</label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
                placeholder="Ex: Anatomia"
              />
            </div>

            {/* Questions Stats */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Número de Acertos</label>
                <input
                  type="number"
                  value={correctAnswers}
                  onChange={(e) => setCorrectAnswers(Math.max(0, Math.min(totalQuestions, parseInt(e.target.value) || 0)))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  max={totalQuestions}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Número de Erros</label>
                <div className="w-full bg-gray-700 rounded-lg px-4 py-2">
                  {wrongAnswers}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Desempenho</label>
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">Percentual de Acertos</span>
                    <span className={`text-sm font-semibold ${
                      accuracyPercentage >= 75 ? 'text-green-400' :
                      accuracyPercentage >= 65 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {accuracyPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        accuracyPercentage >= 75 ? 'bg-green-500' :
                        accuracyPercentage >= 65 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, accuracyPercentage)}%` }}
                    />
                  </div>
                </div>

                {accuracyPercentage >= 75 && (
                  <p className="flex items-center gap-2 mt-2 text-green-400 text-sm">
                    <Check size={16} />
                    <span>Excelente!</span>
                  </p>
                )}
                {accuracyPercentage >= 65 && accuracyPercentage < 75 && (
                  <p className="flex items-center gap-2 mt-2 text-yellow-400 text-sm">
                    <AlertCircle size={16} />
                    <span>Bom, mas pode melhorar</span>
                  </p>
                )}
                {accuracyPercentage < 65 && (
                  <p className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    <span>Reforçar Estudo</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 p-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!isValidAccuracy || !majorArea || !subjectName}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isValidAccuracy && majorArea && subjectName
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}