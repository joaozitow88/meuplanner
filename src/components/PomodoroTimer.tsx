import React, { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, RotateCcw, Timer } from 'lucide-react';

interface PomodoroTimerProps {
  onClose: () => void;
}

export function PomodoroTimer({ onClose }: PomodoroTimerProps) {
  const [mode, setMode] = useState<'up' | 'down'>('down');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [activity, setActivity] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (mode === 'down' && prevTime <= 0) {
            setIsRunning(false);
            return 0;
          }
          return mode === 'up' ? prevTime + 1 : prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const progress = mode === 'up'
    ? (time / initialTime) * 100
    : ((initialTime - time) / initialTime) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Timer className="text-indigo-500" />
            Pomodoro Timer
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-6xl font-bold text-center mb-4">
                {formatTime(time)}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Atividade
              </label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
                placeholder="Nome da atividade..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Tempo (minutos)
                </label>
                <input
                  type="number"
                  value={Math.floor(initialTime / 60)}
                  onChange={(e) => {
                    const newTime = Math.max(1, parseInt(e.target.value) || 0) * 60;
                    setInitialTime(newTime);
                    if (!isRunning) setTime(newTime);
                  }}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Modo
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'up' | 'down')}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="up">Crescente</option>
                  <option value="down">Regressivo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={reset}
              className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}