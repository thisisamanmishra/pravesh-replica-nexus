
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface CollegeViewSettings {
  id?: string;
  show_image_carousel: boolean;
  show_quick_stats: boolean;
  show_facilities: boolean;
  show_placement_stats: boolean;
  show_courses: boolean;
  show_video: boolean;
  hero_gradient: string;
  primary_color: string;
  card_style: string;
  animation_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

// For now, we'll store settings in localStorage since we don't have a database table
export const useCollegeViewSettings = () => {
  return useQuery({
    queryKey: ['college-view-settings'],
    queryFn: async () => {
      const saved = localStorage.getItem('college-view-settings');
      if (saved) {
        return JSON.parse(saved) as CollegeViewSettings;
      }
      
      // Default settings
      return {
        show_image_carousel: true,
        show_quick_stats: true,
        show_facilities: true,
        show_placement_stats: true,
        show_courses: true,
        show_video: true,
        hero_gradient: 'from-black/70 via-black/50 to-transparent',
        primary_color: 'blue',
        card_style: 'gradient',
        animation_enabled: true
      } as CollegeViewSettings;
    }
  });
};

export const useUpdateCollegeViewSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: CollegeViewSettings) => {
      localStorage.setItem('college-view-settings', JSON.stringify(settings));
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['college-view-settings'] });
      toast({
        title: "Success",
        description: "College view settings updated successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Update settings error:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    }
  });
};
