import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ThemeState {
  isDarkMode: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: true,
  isLoading: true,
  error: null,
  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ isLoading: false });
        return;
      }

      const { data: theme } = await supabase
        .from('themes')
        .select('is_dark_mode')
        .eq('user_id', user.id)
        .single();

      if (theme) {
        set({ isDarkMode: theme.is_dark_mode, isLoading: false });
      } else {
        await supabase
          .from('themes')
          .insert([{ user_id: user.id, is_dark_mode: true }]);
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to load theme', isLoading: false });
    }
  },
  toggleTheme: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newValue = !get().isDarkMode;
      
      const { error } = await supabase
        .from('themes')
        .update({ is_dark_mode: newValue })
        .eq('user_id', user.id);

      if (error) throw error;
      set({ isDarkMode: newValue });
    } catch (error) {
      set({ error: 'Failed to update theme' });
    }
  },
}));