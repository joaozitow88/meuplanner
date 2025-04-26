import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { differenceInDays } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'revision' | 'exam' | 'general';
  date: Date;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  examDate: Date | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setExamDate: (date: Date) => Promise<void>;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  examDate: null,
  isLoading: true,
  error: null,
  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ isLoading: false });
        return;
      }

      // Load notifications
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      // Load exam date
      const { data: examDate } = await supabase
        .from('exam_dates')
        .select('date')
        .eq('user_id', user.id)
        .single();

      set({
        notifications: notifications || [],
        examDate: examDate?.date || null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to load data', isLoading: false });
    }
  },
  addNotification: async (notification) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          ...notification,
          read: false,
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        notifications: [data, ...state.notifications],
      }));
    } catch (error) {
      set({ error: 'Failed to add notification' });
    }
  },
  markAsRead: async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to mark notification as read' });
    }
  },
  markAllAsRead: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (error) {
      set({ error: 'Failed to mark all notifications as read' });
    }
  },
  setExamDate: async (date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('exam_dates')
        .upsert({
          user_id: user.id,
          date,
        });

      if (error) throw error;

      set({ examDate: date });

      // Generate milestone notifications
      const today = new Date();
      const daysUntilExam = differenceInDays(date, today);
      
      const milestones = [100, 60, 50, 30, 10, 5, 1, 0];
      
      milestones.forEach(milestone => {
        if (daysUntilExam === milestone) {
          get().addNotification({
            title: 'Contagem Regressiva',
            message: milestone === 0 
              ? 'A prova é hoje! Boa sorte! 🍀'
              : `Faltam ${milestone} dias para a prova!`,
            type: 'exam',
            date: new Date(),
          });
        }
      });
    } catch (error) {
      set({ error: 'Failed to set exam date' });
    }
  },
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));