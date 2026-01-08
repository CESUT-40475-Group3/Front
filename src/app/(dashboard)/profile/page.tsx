'use client'

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { mockApiClient } from '@/lib/mockApi';
import { Profile, Experience, Education } from '@/types/api';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Section Edit States
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  // Form States
  const [headerForm, setHeaderForm] = useState({ headline: '', location: '' });
  const [aboutForm, setAboutForm] = useState('');
  const [expForm, setExpForm] = useState<Experience | null>(null);
  const [eduForm, setEduForm] = useState<Education | null>(null);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await mockApiClient.getProfile(user!.id);
      setProfile(data);
      setHeaderForm({ headline: data.headline, location: data.location });
      setAboutForm(data.about);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;
    try {
      const updated = await mockApiClient.updateProfile(user.id, updates);
      setProfile(updated);
      // Reset all edit states
      setIsEditingHeader(false);
      setIsEditingAbout(false);
      setEditingExpId(null);
      setEditingEduId(null);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  // --- Experience Handlers ---
  const startEditExp = (exp: Experience) => {
    setEditingExpId(exp.id);
    setExpForm({ ...exp });
  };

  const saveExp = () => {
    if (!expForm || !profile) return;
    const newList = profile.experience.map(e => e.id === expForm.id ? expForm : e);
    handleUpdateProfile({ experience: newList });
  };

  const addExperience = () => {
    const newId = Date.now().toString();
    const newExp: Experience = { id: newId, title: '', company: '', period: '', description: '' };
    setProfile(prev => prev ? { ...prev, experience: [...prev.experience, newExp] } : null);
    startEditExp(newExp);
  };

  // --- Education Handlers ---
  const startEditEdu = (edu: Education) => {
    setEditingEduId(edu.id);
    setEduForm({ ...edu });
  };

  const saveEdu = () => {
    if (!eduForm || !profile) return;
    const newList = profile.education.map(e => e.id === eduForm.id ? eduForm : e);
    handleUpdateProfile({ education: newList });
  };

  const addEducation = () => {
    const newId = Date.now().toString();
    const newEdu: Education = { id: newId, degree: '', school: '', period: '' };
    setProfile(prev => prev ? { ...prev, education: [...prev.education, newEdu] } : null);
    startEditEdu(newEdu);
  };

  // --- Skills Handlers ---
  const addSkill = () => {
    if (!newSkill.trim() || profile?.skills.includes(newSkill.trim())) return;
    handleUpdateProfile({ skills: [...(profile?.skills || []), newSkill.trim()] });
    setNewSkill('');
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-center text-red-500">Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Card */}
      <div className="card relative overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400 -mx-6 -mt-6 mb-12" />
        <div className="relative flex justify-between items-end">
          <div className="flex items-end space-x-4">
            <div className="w-32 h-32 bg-white p-1 rounded-full -mt-16 shadow-lg">
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-500">
                {user?.name.charAt(0)}
              </div>
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              {isEditingHeader ? (
                <div className="space-y-2 mt-2">
                  <input className="input-field text-sm" value={headerForm.headline} onChange={e => setHeaderForm({...headerForm, headline: e.target.value})} placeholder="Headline" />
                  <input className="input-field text-sm" value={headerForm.location} onChange={e => setHeaderForm({...headerForm, location: e.target.value})} placeholder="Location" />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateProfile(headerForm)} className="btn-primary py-1 px-3 text-xs">Save</button>
                    <button onClick={() => setIsEditingHeader(false)} className="btn-secondary py-1 px-3 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600">{profile.headline}</p>
                  <p className="text-sm text-gray-500">{profile.location}</p>
                </>
              )}
            </div>
          </div>
          {!isEditingHeader && <button onClick={() => setIsEditingHeader(true)} className="text-blue-600 hover:underline text-sm font-medium">Edit Header</button>}
        </div>
      </div>

      {/* About Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">About</h2>
          {!isEditingAbout && <button onClick={() => setIsEditingAbout(true)} className="text-blue-600 hover:underline text-sm font-medium">Edit</button>}
        </div>
        {isEditingAbout ? (
          <div className="space-y-3">
            <textarea className="input-field min-h-[120px]" value={aboutForm} onChange={e => setAboutForm(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => handleUpdateProfile({ about: aboutForm })} className="btn-primary">Save</button>
              <button onClick={() => setIsEditingAbout(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{profile.about}</p>
        )}
      </div>

      {/* Experience Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Experience</h2>
          <button onClick={addExperience} className="text-blue-600 hover:underline text-sm font-medium">+ Add</button>
        </div>
        <div className="space-y-6">
          {profile.experience.map((exp) => (
            <div key={exp.id} className="border-l-2 border-gray-100 pl-4 relative group">
              {editingExpId === exp.id ? (
                <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                  <input className="input-field text-sm" placeholder="Job Title" value={expForm?.title} onChange={e => setExpForm(f => f ? {...f, title: e.target.value} : null)} />
                  <input className="input-field text-sm" placeholder="Company" value={expForm?.company} onChange={e => setExpForm(f => f ? {...f, company: e.target.value} : null)} />
                  <input className="input-field text-sm" placeholder="Period (e.g. 2020 - 2022)" value={expForm?.period} onChange={e => setExpForm(f => f ? {...f, period: e.target.value} : null)} />
                  <textarea className="input-field text-sm" placeholder="Description" value={expForm?.description} onChange={e => setExpForm(f => f ? {...f, description: e.target.value} : null)} />
                  <div className="flex gap-2">
                    <button onClick={saveExp} className="btn-primary py-1 px-3 text-xs">Save</button>
                    <button onClick={() => setEditingExpId(null)} className="btn-secondary py-1 px-3 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-900">{exp.title || 'Untitled Role'}</h3>
                    <button onClick={() => startEditExp(exp)} className="text-blue-600 text-xs opacity-0 group-hover:opacity-100">Edit</button>
                  </div>
                  <p className="text-gray-700">{exp.company || 'Company Name'}</p>
                  <p className="text-sm text-gray-500">{exp.period}</p>
                  <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Education</h2>
          <button onClick={addEducation} className="text-blue-600 hover:underline text-sm font-medium">+ Add</button>
        </div>
        <div className="space-y-6">
          {profile.education.map((edu) => (
            <div key={edu.id} className="border-l-2 border-gray-100 pl-4 relative group">
              {editingEduId === edu.id ? (
                <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                  <input className="input-field text-sm" placeholder="Degree" value={eduForm?.degree} onChange={e => setEduForm(f => f ? {...f, degree: e.target.value} : null)} />
                  <input className="input-field text-sm" placeholder="School" value={eduForm?.school} onChange={e => setEduForm(f => f ? {...f, school: e.target.value} : null)} />
                  <input className="input-field text-sm" placeholder="Period" value={eduForm?.period} onChange={e => setEduForm(f => f ? {...f, period: e.target.value} : null)} />
                  <div className="flex gap-2">
                    <button onClick={saveEdu} className="btn-primary py-1 px-3 text-xs">Save</button>
                    <button onClick={() => setEditingEduId(null)} className="btn-secondary py-1 px-3 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-900">{edu.degree || 'Degree'}</h3>
                    <button onClick={() => startEditEdu(edu)} className="text-blue-600 text-xs opacity-0 group-hover:opacity-100">Edit</button>
                  </div>
                  <p className="text-gray-700">{edu.school || 'University'}</p>
                  <p className="text-sm text-gray-500">{edu.period}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.skills.map((skill) => (
            <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {skill}
              <button onClick={() => handleUpdateProfile({ skills: profile.skills.filter(s => s !== skill) })} className="text-gray-400 hover:text-red-500 font-bold">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input-field py-1" placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} />
          <button onClick={addSkill} className="btn-secondary py-1">Add</button>
        </div>
      </div>
    </div>
  );
}
