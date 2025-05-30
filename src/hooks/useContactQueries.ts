
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactQuery {
  id: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useContactQueries = () => {
  return useQuery({
    queryKey: ['contact-queries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_queries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactQuery[];
    }
  });
};

export const useCreateContactQuery = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (query: Omit<ContactQuery, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('contact_queries')
        .insert(query)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your query has been submitted successfully! We'll get back to you soon.",
      });
    },
    onError: (error: any) => {
      console.error('Create contact query error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit query",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateContactQuery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('contact_queries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-queries'] });
      toast({
        title: "Success",
        description: "Query status updated successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Update contact query error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update query status",
        variant: "destructive"
      });
    }
  });
};
