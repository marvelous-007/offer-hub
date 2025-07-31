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