
import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { storage } from '../services/storage';
import { User as UserIcon, Calendar, Mail, Shield, Search, Users, Edit2, Trash2, Plus, X, Loader2 } from 'lucide-react';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  user?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'User' as 'Admin' | 'User' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, role: user.role });
    } else {
      setFormData({ name: '', email: '', role: 'User' });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{user ? 'Edit Member' : 'Add Member (Demo Only)'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          await onSubmit(formData);
          setLoading(false);
        }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none bg-white" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as any })}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex justify-center">
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const data = await storage.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshUsers(); }, []);

  const handleCreateOrUpdate = async (formData: Partial<User>) => {
    try {
      if (editingUser) {
        await storage.updateUser({ ...editingUser, ...formData } as User);
      }
      await refreshUsers();
      setIsModalOpen(false);
    } catch (e) {
      alert('Action failed. Check console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this profile?')) {
      try {
        await storage.deleteUser(id);
        await refreshUsers();
      } catch (e) {
        alert('Deletion failed');
      }
    }
  };

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cloud Users</h1>
          <p className="text-gray-500">Live data from Supabase backend.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Search size={18} /></div>
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none w-64 shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p>Syncing with cloud database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">{user.name[0]}</div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingUser(user); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="py-20 text-center text-gray-400">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateOrUpdate} user={editingUser} />
    </div>
  );
};

export default UsersList;
