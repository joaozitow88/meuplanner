import React from 'react';
import { Clock, BookOpen, AlertCircle, Timer } from 'lucide-react';
import { PomodoroTimer } from '../components/PomodoroTimer';

export function History() {
  const [isPomodoroOpen, setIsPomodoroOpen] = React.useState(false);

  return (
    <div className="relative">
      <h2 className="text-3xl font-bold mb-8">Histórico</h2>

      {/* Today's Activities */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Hoje</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
            <Clock className="text-indigo-500" size={24} />
            <div>
              <p className="font-medium">Registro de Estudo - Ventilação Mecânica</p>
              <p className="text-sm text-gray-400">14:30 - CLM</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
            <BookOpen className="text-green-500" size={24} />
            <div>
              <p className="font-medium">Revisão - Anestesia Geral</p>
              <p className="text-sm text-gray-400">16:45 - CIR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Yesterday's Activities */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Ontem</h3>
        <div className="flex items-center justify-center py-8 text-gray-400">
          <AlertCircle className="mr-2" size={20} />
          <p>Nenhuma atividade registrada ontem.</p>
        </div>
      </div>

      {/* Last Week */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Última Semana</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-2">Registros de Estudo</h4>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-2">Revisões</h4>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-2">Erros Registrados</h4>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>
      </div>

      {/* Last Month */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Último Mês</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-2">Total de Atividades</h4>
            <p className="text-2xl font-bold">45</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-2">Horas de Estudo</h4>
            <p className="text-2xl font-bold">68h</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-2">Questões</h4>
            <p className="text-2xl font-bold">320</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-2">Desempenho</h4>
            <p className="text-2xl font-bold">76%</p>
          </div>
        </div>
      </div>

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