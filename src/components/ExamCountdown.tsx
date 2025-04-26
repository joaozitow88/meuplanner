import React, { useState, useEffect } from 'react';
import { Database } from '../lib/types';
import { CalendarDays } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ExamCountdown() {
  const [nextExam, setNextExam] = useState<Database['public']['Tables']['exam_dates']['Row'] | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const fetchNextExam = async () => {
      const { data, error } = await supabase
        .from('exam_dates')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(1)
        .single();

      if (!error && data) {
        setNextExam(data);
      }
    };

    fetchNextExam();
  }, []);

  useEffect(() => {
    if (!nextExam?.date) {
      setTimeLeft('No upcoming exams');
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const examDate = new Date(nextExam.date).getTime();
      const distance = examDate - now;

      if (distance < 0) {
        setTimeLeft('Exam has passed');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextExam]);

  if (!nextExam) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Próxima Prova</h3>
          <CalendarDays className="text-blue-500" size={24} />
        </div>
        <p className="text-gray-400">No upcoming exams scheduled</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Próxima Prova</h3>
        <CalendarDays className="text-blue-500" size={24} />
      </div>
      <p className="text-3xl font-bold">{timeLeft}</p>
      <p className="text-gray-400 text-sm mt-2">
        {new Date(nextExam.date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })}
      </p>
    </div>
  );
}