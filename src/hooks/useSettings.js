import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../utils/api';

export const useSettings = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const updateProfile = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/v1/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.success) {
        updateUser(res.data.user);
        toast.success('Profile updated successfully!');
        return true;
      } else {
        toast.error(res.error || 'Failed to update profile');
        return false;
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateUser, toast]);

  const updatePreferences = useCallback(async (notification_preferences) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/v1/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_preferences }),
      });

      if (res.success) {
        updateUser(res.data.user);
        toast.success('Preferences updated successfully!');
        return true;
      } else {
        toast.error(res.error || 'Failed to update preferences');
        return false;
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateUser, toast]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/v1/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.success) {
        toast.success('Password changed successfully!');
        return true;
      } else {
        toast.error(res.error || 'Failed to change password');
        return false;
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    updateProfile,
    updatePreferences,
    changePassword,
  };
};
