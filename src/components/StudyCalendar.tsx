import React from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

const studiedDays = [
  new Date(2024, 1, 1),
  new Date(2024, 1, 3),
  new Date(2024, 1, 4),
  new Date(2024, 1, 7),
  new Date(2024, 1, 8),
];

export function StudyCalendar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Calendário de Estudos</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <DayPicker
              mode="multiple"
              selected={studiedDays}
              locale={ptBR}
              modifiers={{
                studied: studiedDays,
              }}
              modifiersStyles={{
                studied: {
                  backgroundColor: '#4F46E5',
                  color: 'white',
                },
              }}
              styles={{
                caption: { color: 'white' },
                head_cell: { color: 'white' },
                cell: { color: 'white' },
                day: { color: 'white' },
                nav_button: { color: 'white' },
                nav_button_previous: { color: 'white' },
                nav_button_next: { color: 'white' },
              }}
              className="!bg-gray-800 !text-white rounded-lg"
            />
            <div className="mt-4 flex items-center gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                <span className="text-sm">Dias estudados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                <span className="text-sm">Dias sem estudo</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-full"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-3xl font-bold">5 dias</p>
          <p className="text-gray-400 text-sm mt-2">Sequência de estudos</p>
        </div>
      </button>
    </>
  );
}