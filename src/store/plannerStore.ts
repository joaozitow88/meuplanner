import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Week, Topic, WeekWithStats } from '../lib/types';

interface PlannerState {
  currentPlan: string | null;
  weeks: WeekWithStats[];
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  addWeek: (name: string, topics: string[]) => Promise<void>;
  deleteWeek: (weekId: string) => Promise<void>;
  updateWeekName: (weekId: string, name: string, topics: string[]) => Promise<void>;
  updateTopicStats: (weekId: string, topicId: string, stats: Partial<Topic>) => Promise<void>;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  currentPlan: null,
  weeks: [],
  isLoading: true,
  error: null,
  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ isLoading: false });
        return;
      }

      // Get or create default plan
      let { data: plan } = await supabase
        .from('plans')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!plan) {
        const { data: newPlan } = await supabase
          .from('plans')
          .insert([{
            user_id: user.id,
            name: 'Default Plan'
          }])
          .select()
          .single();
        plan = newPlan;
      }

      if (!plan) throw new Error('Failed to create plan');

      set({ currentPlan: plan.id });

      // Load weeks with topics
      const { data: weeks } = await supabase
        .from('weeks')
        .select(`
          id,
          name,
          created_at,
          topics (
            id,
            name,
            total_questions,
            correct_answers,
            wrong_answers,
            accuracy_percentage,
            study_time_minutes,
            completed
          )
        `)
        .eq('plan_id', plan.id)
        .order('created_at');

      if (weeks) {
        const weeksWithStats: WeekWithStats[] = weeks.map(week => ({
          id: week.id,
          name: week.name,
          topics: week.topics,
          created_at: week.created_at,
          totalTopics: week.topics.length,
          completedTopics: week.topics.filter(t => t.completed).length,
          questionsCompleted: week.topics.reduce((sum, t) => sum + t.total_questions, 0),
          accuracy_percentage: week.topics.length > 0
            ? week.topics.reduce((sum, t) => sum + t.accuracy_percentage, 0) / week.topics.length
            : 0
        }));

        set({ weeks: weeksWithStats, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to load planner data', isLoading: false });
    }
  },
  addWeek: async (name, topicNames) => {
    try {
      const currentPlan = get().currentPlan;
      if (!currentPlan) throw new Error('No plan selected');

      // Create week
      const { data: week } = await supabase
        .from('weeks')
        .insert([{
          plan_id: currentPlan,
          name
        }])
        .select()
        .single();

      if (!week) throw new Error('Failed to create week');

      // Create topics
      const { data: topics } = await supabase
        .from('topics')
        .insert(
          topicNames.map(topicName => ({
            week_id: week.id,
            name: topicName
          }))
        )
        .select();

      if (!topics) throw new Error('Failed to create topics');

      const newWeek: WeekWithStats = {
        id: week.id,
        name: week.name,
        topics,
        created_at: week.created_at,
        totalTopics: topics.length,
        completedTopics: 0,
        questionsCompleted: 0,
        accuracy_percentage: 0
      };

      set(state => ({
        weeks: [...state.weeks, newWeek]
      }));
    } catch (error) {
      set({ error: 'Failed to add week' });
    }
  },
  deleteWeek: async (weekId) => {
    try {
      const { error } = await supabase
        .from('weeks')
        .delete()
        .eq('id', weekId);

      if (error) throw error;

      set(state => ({
        weeks: state.weeks.filter(week => week.id !== weekId)
      }));
    } catch (error) {
      set({ error: 'Failed to delete week' });
    }
  },
  updateWeekName: async (weekId, name, topics) => {
    try {
      // Update week name
      const { error: weekError } = await supabase
        .from('weeks')
        .update({ name })
        .eq('id', weekId);

      if (weekError) throw weekError;

      // Get existing topics
      const { data: existingTopics } = await supabase
        .from('topics')
        .select('id, name')
        .eq('week_id', weekId);

      if (!existingTopics) throw new Error('Failed to fetch topics');

      // Delete removed topics
      const topicsToKeep = new Set(topics);
      const topicsToDelete = existingTopics.filter(t => !topicsToKeep.has(t.name));

      if (topicsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('topics')
          .delete()
          .in('id', topicsToDelete.map(t => t.id));

        if (deleteError) throw deleteError;
      }

      // Add new topics
      const existingNames = new Set(existingTopics.map(t => t.name));
      const newTopics = topics.filter(t => !existingNames.has(t));

      if (newTopics.length > 0) {
        const { error: insertError } = await supabase
          .from('topics')
          .insert(newTopics.map(topicName => ({
            week_id: weekId,
            name: topicName
          })));

        if (insertError) throw insertError;
      }

      // Reload weeks to get updated data
      await get().initialize();
    } catch (error) {
      set({ error: 'Failed to update week' });
    }
  },
  updateTopicStats: async (weekId, topicId, stats) => {
    try {
      const { error } = await supabase
        .from('topics')
        .update(stats)
        .eq('id', topicId);

      if (error) throw error;

      set(state => ({
        weeks: state.weeks.map(week => {
          if (week.id !== weekId) return week;

          const updatedTopics = week.topics.map(topic =>
            topic.id === topicId ? { ...topic, ...stats } : topic
          );

          return {
            ...week,
            topics: updatedTopics,
            totalTopics: updatedTopics.length,
            completedTopics: updatedTopics.filter(t => t.completed).length,
            questionsCompleted: updatedTopics.reduce((sum, t) => sum + t.total_questions, 0),
            accuracy_percentage: updatedTopics.length > 0
              ? updatedTopics.reduce((sum, t) => sum + t.accuracy_percentage, 0) / updatedTopics.length
              : 0
          };
        })
      }));
    } catch (error) {
      set({ error: 'Failed to update topic stats' });
    }
  }
}));