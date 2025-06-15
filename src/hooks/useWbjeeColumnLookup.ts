
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch all colleges and branches to build name->id map
export function useWbjeeReferenceMaps() {
  // Get all colleges
  const collegesQ = useQuery({
    queryKey: ["all_wbjee_colleges"],
    queryFn: async () => {
      const { data, error } = await supabase.from("wbjee_colleges").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  // Get all branches
  const branchesQ = useQuery({
    queryKey: ["all_wbjee_branches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("wbjee_branches").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  // Build lookup maps
  const collegeNameToId = useMemo(() => {
    if (!collegesQ.data) return {};
    // Lowercase match for best effort
    const map: Record<string, string> = {};
    collegesQ.data.forEach((c: any) => {
      map[c.name.toLowerCase().trim()] = c.id;
    });
    return map;
  }, [collegesQ.data]);

  const branchNameToId = useMemo(() => {
    if (!branchesQ.data) return {};
    const map: Record<string, string> = {};
    branchesQ.data.forEach((b: any) => {
      map[b.branch_name.toLowerCase().trim()] = b.id;
    });
    return map;
  }, [branchesQ.data]);

  return {
    collegeNameToId,
    branchNameToId,
    collegesLoading: collegesQ.isLoading,
    branchesLoading: branchesQ.isLoading,
  };
}
