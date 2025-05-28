
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HomepageSettings {
  id: string;
  website_name: string;
  logo_url?: string;
  hero_title: string;
  hero_subtitle: string;
  hero_background_image?: string;
  featured_colleges_ids: string[];
  quick_stats: {
    colleges: string;
    courses: string;
    students: string;
    cities: string;
  };
  categories: Array<{
    name: string;
    count: string;
    icon: string;
  }>;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  created_at: string;
  updated_at: string;
}

export const useHomepageSettings = () => {
  return useQuery({
    queryKey: ['homepage-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as HomepageSettings | null;
    }
  });
};

export const useUpdateHomepageSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: Partial<HomepageSettings> & { id: string }) => {
      const { data, error } = await supabase
        .from('homepage_settings')
        .update(settings)
        .eq('id', settings.id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-settings'] });
      toast({
        title: "Success",
        description: "Homepage settings updated successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Update homepage settings error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update homepage settings",
        variant: "destructive"
      });
    }
  });
};
