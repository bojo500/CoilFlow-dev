import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './axios';

// Types
export interface Coil {
  id: string;
  coil_id: string;
  width: number;
  weight: number;
  status: 'WIP' | 'RTS' | 'scrap' | 'onhold' | 'rework';
  location: string;
  section: number;
  column: number;
  row: number;
  scheduled_for_date?: string;
  load_id?: string;
}

export interface Load {
  id: string;
  load_number: number;
  customer_name: string;
  scheduled_time: string;
  status: 'ready' | 'missing' | 'shipped';
  created_for_date: string;
  coils: Coil[];
}

export interface LoadCard {
  id: string;
  last4: string;
  full_load_number: number;
  customer_name: string;
  scheduled_time: string;
  total_coils: number;
  ready_coils: number;
  readyFraction: string;
  statusDot: 'green' | 'red' | 'grey';
  status: string;
  isShipped: boolean;
}

export interface DashboardData {
  loads: LoadCard[];
  quick_counts: {
    totalLoads: number;
    readyLoads: number;
    missingLoads: number;
  };
}

// Dashboard
export const useDashboardToday = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', 'today'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/dashboard/today');
      return data;
    },
  });
};

// Loads
export const useLoads = (date?: string) => {
  return useQuery<Load[]>({
    queryKey: ['loads', date],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/loads', {
        params: { date },
      });
      return data;
    },
  });
};

export const useLoadById = (id: string) => {
  return useQuery<Load>({
    queryKey: ['load', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/loads/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateLoad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (load: any) => {
      const { data } = await apiClient.post('/api/loads', load);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateLoad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...load }: any) => {
      const { data } = await apiClient.put(`/api/loads/${id}`, load);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useAssignCoil = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ loadId, coilId }: { loadId: string; coilId: string }) => {
      const { data } = await apiClient.post(`/api/loads/${loadId}/assign-coil`, {
        coil_id: coilId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['coils'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUnassignCoil = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ loadId, coilId }: { loadId: string; coilId: string }) => {
      const { data } = await apiClient.post(`/api/loads/${loadId}/unassign-coil`, {
        coil_id: coilId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['coils'] });
    },
  });
};

// Coils
export const useCoils = (query?: any) => {
  return useQuery<Coil[]>({
    queryKey: ['coils', query],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/coils', {
        params: query,
      });
      return data;
    },
  });
};

export const useUnassignedCoils = (date: string) => {
  return useQuery<Coil[]>({
    queryKey: ['coils', 'unassigned', date],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/coils/unassigned', {
        params: { date },
      });
      return data;
    },
  });
};

export const useCreateCoil = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (coil: any) => {
      const { data } = await apiClient.post('/api/coils', coil);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coils'] });
    },
  });
};

export const useUpdateCoil = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...coil }: any) => {
      const { data } = await apiClient.put(`/api/coils/${id}`, coil);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coils'] });
      queryClient.invalidateQueries({ queryKey: ['loads'] });
    },
  });
};

// Locations
export const useSections = () => {
  return useQuery({
    queryKey: ['locations', 'sections'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/locations/sections');
      return data;
    },
  });
};

export const useSectionGrid = (section: number) => {
  return useQuery({
    queryKey: ['locations', 'grid', section],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/locations/${section}/grid`);
      return data;
    },
  });
};

// Stats
export const useStats = (from: string, to: string, groupBy: 'week' | 'month' | 'year') => {
  return useQuery({
    queryKey: ['stats', from, to, groupBy],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/stats/summary', {
        params: { from, to, groupBy },
      });
      return data;
    },
    enabled: !!from && !!to,
  });
};
