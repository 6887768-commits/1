
import { supabase } from '../supabaseClient';
import { User } from '../types';

export const storage = {
  // Database Operations
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  updateUser: async (updatedUser: Partial<User> & { id: string }) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: updatedUser.name,
        role: updatedUser.role
      })
      .eq('id', updatedUser.id);
    
    if (error) throw error;
  },

  deleteUser: async (id: string) => {
    // Note: In a real app, you might want to delete from auth.users via an edge function
    // For this demo, we delete the profile record
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Session Management (Supabase Auth)
  getCurrentSession: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    return profile;
  },

  logout: async () => {
    await supabase.auth.signOut();
  }
};
