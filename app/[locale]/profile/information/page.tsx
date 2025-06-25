'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Camera,
  Edit,
  Save,
  X,
  User,
  Mail,
  Calendar,
  Crown,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import { useLocale } from '@/contexts/LanguageContext';

export default function ProfileInformationPage() {
  const router = useRouter();
  const { user, updateProfile, getCurrentUser } = useAuthStore();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { dictionary } = useLocale();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    avatar: user?.avatar || null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Stop loading when component mounts
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  // Check for changes
  useEffect(() => {
    const hasFormChanges =
      formData.firstName !== (user?.firstName || '') ||
      formData.lastName !== (user?.lastName || '') ||
      formData.bio !== (user?.bio || '');
    setHasChanges(hasFormChanges);
  }, [formData, user]);

  const handleBack = () => {
    if (hasChanges && isEditing) {
      if (confirm(dictionary.profileInfo.unsavedChanges)) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      }).then(() => {
        // Here you would update the user profile
        console.log('Saving profile:', formData);
        getCurrentUser()
        setIsEditing(false);
        setHasChanges(false);
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      avatar: user?.avatar || null,
    });
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          avatar: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-zinc-900/80 border-b border-zinc-800/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
            >
              <ArrowLeft size={20} className="text-zinc-300" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              {dictionary.profileInfo.profileInformation}
            </h1>
          </div>

          {!isEditing ? (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit size={16} />
              {dictionary.profileInfo.editProfile}
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleCancel}
                className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-300 border border-zinc-700/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} className="text-zinc-400" />
              </motion.button>
              <motion.button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  hasChanges && !isSaving
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-emerald-500/25'
                    : 'bg-zinc-700/50 text-zinc-500 cursor-not-allowed'
                }`}
                whileHover={hasChanges ? { scale: 1.02 } : {}}
                whileTap={hasChanges ? { scale: 0.98 } : {}}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isSaving
                  ? dictionary.profileInfo.saving
                  : dictionary.profileInfo.save}
              </motion.button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Profile Header Card */}
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-600/10 to-indigo-700/10 backdrop-blur-xl border border-zinc-800/50 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background decorations */}
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/5 rounded-full blur-xl" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-zinc-700/50 shadow-2xl">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                    <User size={48} className="text-zinc-400" />
                  </div>
                )}
              </div>

              {/*{isEditing && (*/}
              {/*  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-pink-500/25 transition-all duration-300 group-hover:scale-110">*/}
              {/*    <Camera size={18} className="text-white" />*/}
              {/*    <input*/}
              {/*      type="file"*/}
              {/*      accept="image/*"*/}
              {/*      onChange={handleImageUpload}*/}
              {/*      className="hidden"*/}
              {/*    />*/}
              {/*  </label>*/}
              {/*)}*/}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h2 className="text-3xl font-bold text-white">
                    {user?.firstName || formData.firstName || ''}{' '}
                    {user?.lastName || formData.lastName || ''}
                  </h2>
                  {user?.isPremium && (
                    <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-yellow-400/30">
                      <Crown size={16} className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-yellow-300">
                        {dictionary.profile.premium}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 text-zinc-400">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} />
                  <span>{user?.email || 'user@example.com'}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar size={16} />
                  <span>
                    {dictionary.profileInfo.memberSince}{' '}
                    {`${user?.createdAt.split('-')[0]}.${user?.createdAt.split('-')[1]}` || 'January 2023'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User size={20} className="text-pink-500" />
            {dictionary.profileInfo.personalInformation}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                {dictionary.profileInfo.firstName}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                  placeholder={dictionary.profileInfo.enterFirstName}
                />
              ) : (
                <div className="w-full bg-zinc-800/30 border border-zinc-700/30 rounded-xl px-4 py-3 text-white">
                  {formData.firstName || dictionary.profileInfo.notSet}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                {dictionary.profileInfo.lastName}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                  placeholder={dictionary.profileInfo.enterLastName}
                />
              ) : (
                <div className="w-full bg-zinc-800/30 border border-zinc-700/30 rounded-xl px-4 py-3 text-white">
                  {formData.lastName || dictionary.profileInfo.notSet}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* About Me */}
        {/*<motion.div*/}
        {/*  className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-6"*/}
        {/*  initial={{ opacity: 0, y: 20 }}*/}
        {/*  animate={{ opacity: 1, y: 0 }}*/}
        {/*  transition={{ duration: 0.5, delay: 0.2 }}*/}
        {/*>*/}
        {/*  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">*/}
        {/*    <Edit size={20} className="text-purple-500" />*/}
        {/*    {dictionary.profileInfo.aboutMe}*/}
        {/*  </h3>*/}

        {/*  {isEditing ? (*/}
        {/*    <textarea*/}
        {/*      value={formData.bio}*/}
        {/*      onChange={(e) =>*/}
        {/*        setFormData((prev) => ({ ...prev, bio: e.target.value }))*/}
        {/*      }*/}
        {/*      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 resize-none h-32"*/}
        {/*      placeholder={dictionary.profileInfo.tellAboutYourself}*/}
        {/*    />*/}
        {/*  ) : (*/}
        {/*    <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl px-4 py-3 text-zinc-300 min-h-[8rem] flex items-start">*/}
        {/*      {formData.bio || dictionary.profileInfo.defaultBio}*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</motion.div>*/}

        {/* Account Statistics */}
        {/*<motion.div*/}
        {/*  className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-6"*/}
        {/*  initial={{ opacity: 0, y: 20 }}*/}
        {/*  animate={{ opacity: 1, y: 0 }}*/}
        {/*  transition={{ duration: 0.5, delay: 0.3 }}*/}
        {/*>*/}
        {/*  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">*/}
        {/*    <Crown size={20} className="text-amber-500" />*/}
        {/*    {dictionary.profileInfo.accountDetails}*/}
        {/*  </h3>*/}

        {/*  <div className="grid md:grid-cols-3 gap-6">*/}
        {/*    <div className="text-center p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">*/}
        {/*      <div className="text-2xl font-bold text-white mb-1">*/}
        {/*        {user?.isPremium*/}
        {/*          ? dictionary.profile.premium*/}
        {/*          : dictionary.profileInfo.free}*/}
        {/*      </div>*/}
        {/*      <div className="text-sm text-zinc-400">*/}
        {/*        {dictionary.profileInfo.subscription}*/}
        {/*      </div>*/}
        {/*    </div>*/}

        {/*    <div className="text-center p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">*/}
        {/*      <div className="text-2xl font-bold text-white mb-1">*/}
        {/*        {user?.tokens?.toLocaleString() || '0'}*/}
        {/*      </div>*/}
        {/*      <div className="text-sm text-zinc-400">*/}
        {/*        {dictionary.profile.tokens}*/}
        {/*      </div>*/}
        {/*    </div>*/}

        {/*    <div className="text-center p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">*/}
        {/*      <div className="text-2xl font-bold text-white mb-1">4.9</div>*/}
        {/*      <div className="text-sm text-zinc-400">*/}
        {/*        {dictionary.profile.rating}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}

        {/* Save Changes Banner */}
        <AnimatePresence>
          {hasChanges && isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-4 shadow-2xl shadow-emerald-500/25 border border-emerald-400/30 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {dictionary.profileInfo.unsavedChangesTitle}
                    </p>
                    <p className="text-emerald-100 text-sm">
                      {dictionary.profileInfo.dontForgetSave}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-all duration-300"
                >
                  {isSaving
                    ? dictionary.profileInfo.saving
                    : dictionary.profileInfo.save}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
