
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface College {
  id: string;
  name: string;
  location: string;
  category: string;
  college_type: string;
  description?: string;
  established?: number;
  total_students?: number;
  total_courses?: number;
  national_ranking?: number;
  fees_range?: string;
  cutoff_info?: string;
  rating?: number;
  image_url?: string;
  youtube_video_url?: string;
  created_at: string;
  updated_at: string;
}

export const useColleges = () => {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as College[];
    }
  });
};

export const useCollege = (id: string) => {
  return useQuery({
    queryKey: ['college', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as College | null;
    },
    enabled: !!id
  });
};

export const useCreateCollege = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (college: Omit<College, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('colleges')
        .insert([college])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      toast({
        title: "Success",
        description: "College added successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Create college error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add college",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateCollege = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<College> & { id: string }) => {
      console.log('Updating college with data:', { id, updates });
      
      const { data, error } = await supabase
        .from('colleges')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      console.log('Update result:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      toast({
        title: "Success",
        description: "College updated successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Update college error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update college",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteCollege = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('colleges')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      toast({
        title: "Success",
        description: "College deleted successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Delete college error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete college",
        variant: "destructive"
      });
    }
  });
};
