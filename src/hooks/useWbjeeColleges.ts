
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useWbjeeColleges() {
  return useQuery({
    queryKey: ['wbjee_colleges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wbjee_colleges')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
}

export function useWbjeeBranches(collegeId: string) {
  return useQuery({
    queryKey: ['wbjee_branches', collegeId],
    queryFn: async () => {
      if (!collegeId) return [];
      const { data, error } = await supabase
        .from('wbjee_branches')
        .select('*')
        .eq('college_id', collegeId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!collegeId,
  });
}

export function useWbjeeCutoffs({ collegeId, branchId, year }: { collegeId?: string; branchId?: string; year?: number }) {
  return useQuery({
    queryKey: ['wbjee_cutoffs', collegeId, branchId, year],
    queryFn: async () => {
      let query = supabase.from('wbjee_cutoffs').select('*');
      if (collegeId) query = query.eq('college_id', collegeId);
      if (branchId) query = query.eq('branch_id', branchId);
      if (year) query = query.eq('year', year);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!collegeId || !!branchId || !!year,
  });
}
