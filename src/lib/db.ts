import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function initializeDatabase() {
  // Database is initialized through Supabase migrations
  return;
}

// Plans
export async function createPlan(name: string) {
  const { data, error } = await supabase
    .from('plans')
    .insert([{ name }])
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function getPlans() {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Weeks
export async function createWeek(planId: number, name: string) {
  const { data, error } = await supabase
    .from('weeks')
    .insert([{ plan_id: planId, name }])
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function getWeeksByPlan(planId: number) {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('plan_id', planId)
    .order('created_at');

  if (error) throw error;
  return data;
}

// Topics
export async function createTopic(weekId: number, name: string) {
  const { data, error } = await supabase
    .from('topics')
    .insert([{ week_id: weekId, name }])
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function getTopicsByWeek(weekId: number) {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('week_id', weekId);

  if (error) throw error;
  return data;
}

// Study Records
export async function createStudyRecord(
  topicId: number,
  studyDate: string,
  relevance: number,
  majorArea: string,
  subjectName: string,
  correctAnswers: number
) {
  // Get questions target based on relevance
  const { data: relevanceData, error: relevanceError } = await supabase
    .from('relevance_colors')
    .select('questions_target')
    .eq('relevance', relevance)
    .single();

  if (relevanceError) throw relevanceError;
  
  const questionsTarget = relevanceData.questions_target;
  const wrongAnswers = questionsTarget - correctAnswers;
  const accuracyPercentage = (correctAnswers / questionsTarget) * 100;

  // Only proceed if accuracy is >= 65%
  if (accuracyPercentage < 65) {
    throw new Error('Accuracy must be at least 65% to save the record');
  }

  const { error: recordError } = await supabase
    .from('study_records')
    .insert([{
      topic_id: topicId,
      study_date: studyDate,
      relevance,
      major_area: majorArea,
      subject_name: subjectName,
      questions_completed: questionsTarget,
      correct_answers: correctAnswers,
      wrong_answers: wrongAnswers,
      accuracy_percentage: accuracyPercentage
    }]);

  if (recordError) throw recordError;

  // Update topic statistics
  await updateTopicStats(topicId);
}

async function updateTopicStats(topicId: number) {
  const { data: records, error: recordsError } = await supabase
    .from('study_records')
    .select('questions_completed, correct_answers, wrong_answers, accuracy_percentage')
    .eq('topic_id', topicId);

  if (recordsError) throw recordsError;

  const stats = records.reduce((acc, record) => ({
    total_questions: (acc.total_questions || 0) + record.questions_completed,
    correct_answers: (acc.correct_answers || 0) + record.correct_answers,
    wrong_answers: (acc.wrong_answers || 0) + record.wrong_answers,
    accuracy_percentage: records.reduce((sum, r) => sum + r.accuracy_percentage, 0) / records.length
  }), {});

  const { error: updateError } = await supabase
    .from('topics')
    .update({
      ...stats,
      completed: stats.accuracy_percentage >= 75
    })
    .eq('id', topicId);

  if (updateError) throw updateError;
}

// Types
export interface Plan {
  id: number;
  name: string;
  created_at: string;
}

export interface Week {
  id: number;
  plan_id: number;
  name: string;
  created_at: string;
}

export interface Topic {
  id: number;
  week_id: number;
  name: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  accuracy_percentage: number;
  study_time_minutes: number;
  completed: boolean;
}

export interface StudyRecord {
  id: number;
  topic_id: number;
  study_date: string;
  relevance: number;
  major_area: string;
  subject_name: string;
  questions_completed: number;
  correct_answers: number;
  wrong_answers: number;
  accuracy_percentage: number;
}

export interface RelevanceColor {
  relevance: number;
  color: string;
  questions_target: number;
}