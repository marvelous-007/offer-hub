import { supabase } from "@/lib/supabase/supabase";
import { CreateProjectDTO } from '@/types/project.type';

export const createProject = async (data: CreateProjectDTO) => {
  const { data: project, error } = await supabase
    .from('projects')
    .insert([data])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return project;
};

export const getAllProjects = async (filters: any) => {
  let query = supabase.from('projects').select('*');

  if (filters.category) query = query.eq('category', filters.category);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.budget_min) query = query.gte('budget', filters.budget_min);
  if (filters.budget_max) query = query.lte('budget', filters.budget_max);

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
};