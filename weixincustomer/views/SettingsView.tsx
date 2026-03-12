import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserSettingsProfile, VerificationStatus } from '../types';
import {
  getUserSettings,
  logout,
  saveUserProfile,
  submitCompanyVerification,
  uploadImage,
  verifyPersonalIdentity,
} from '../AppApi';

interface SettingsViewProps {
  onBack: () => void;
}

const statusMeta: Record<VerificationStatus, { label: string; badgeClass: string }> = {
  VERIFIED: { label: '已认证', badgeClass: 'bg-emerald-100 text-emerald-700' },
  PENDING: { label: '审核中', badgeClass: 'bg-amber-100 text-amber-700' },
  UNVERIFIED: { label: '未认证', badgeClass: 'bg-slate-100 text-slate-500' },
};

const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [profile, setProfile] = useState<UserSettingsProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [companySubmitting, setCompanySubmitting] = useState(false);
  const [identitySubmitting, setIdentitySubmitting] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [nameEditing, setNameEditing] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [licensePreviews, setLicensePreviews] = useState<string[]>([]);
  const [materialPreviews, setMaterialPreviews] = useState<string[]>([]);
  const [licenseUploading, setLicenseUploading] = useState(false);
  const [materialUploading, setMaterialUploading] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const materialInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await getUserSettings();
        if (res.errcode === 0 && res.data) {
          setProfile(res.data);
          setName(res.data.name);
          setAvatar(res.data.avatar);
          setLicensePreviews(res.data.companyVerification.licenseUrls || []);
          setMaterialPreviews(res.data.companyVerification.materialUrls || []);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    return () => {
      [...licensePreviews, ...materialPreviews, avatar].forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [licensePreviews, materialPreviews, avatar]);

  const companyStatus = profile?.companyVerification.status || 'UNVERIFIED';
  const identityStatus = profile?.personalVerification.status || 'UNVERIFIED';

  const canSubmitCompany = useMemo(() => {
    if (companyStatus !== 'UNVERIFIED') return false;
    return licensePreviews.length > 0;
  }, [companyStatus, licensePreviews.length]);

  const handleAvatarChange = async (files: FileList | null) => {
    if (!files || files.length === 0 || !profile) return;
    const file = files[0];
    setAvatarSaving(true);
    try {
      const uploadRes = await uploadImage({ file, scene: 'avatar' });
      if (uploadRes.errcode !== 0 || !uploadRes.data?.url) return;
      const uploadedUrl = uploadRes.data.url;
      setAvatar(uploadedUrl);
      const res = await saveUserProfile({ name: name.trim() || profile.name, avatar: uploadedUrl });
      if (res.errcode === 0 && res.data) {
        setProfile(res.data);
        setName(res.data.name);
        setAvatar(res.data.avatar);
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      setAvatarSaving(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleAddImages = async (
    files: FileList | null,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    scene: 'license' | 'material',
    setUploading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadResults = await Promise.all(
        Array.from(files).map(file => uploadImage({ file, scene }))
      );
      const urls = uploadResults
        .filter(result => result.errcode === 0 && result.data?.url)
        .map(result => result.data.url);
      if (urls.length > 0) {
        setter(prev => [...prev, ...urls]);
      }
    } catch (error) {
      console.error('Failed to upload images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveName = async () => {
    if (!profile) return;
    const nextName = name.trim() || profile.name;
    if (nextName === profile.name) {
      setNameEditing(false);
      return;
    }
    setNameSaving(true);
    try {
      const res = await saveUserProfile({ name: nextName, avatar: avatar || profile.avatar });
      if (res.errcode === 0 && res.data) {
        setProfile(res.data);
        setName(res.data.name);
        setAvatar(res.data.avatar);
        setNameEditing(false);
      }
    } catch (error) {
      console.error('Failed to save name:', error);
    } finally {
      setNameSaving(false);
    }
  };

  const handleSubmitCompany = async () => {
    if (!profile || !canSubmitCompany) return;
    setCompanySubmitting(true);
    try {
      const res = await submitCompanyVerification({
        companyName: companyName.trim(),
        licenseUrls: licensePreviews,
        materialUrls: materialPreviews,
      });
      if (res.errcode === 0 && res.data) {
        setProfile(res.data);
        alert('认证资料已提交');
      }
    } catch (error) {
      console.error('Failed to submit company verification:', error);
    } finally {
      setCompanySubmitting(false);
    }
  };

  const handleVerifyIdentity = async () => {
    if (!profile) return;
    setIdentitySubmitting(true);
    try {
      const res = await verifyPersonalIdentity();
      if (res.errcode === 0 && res.data) {
        setProfile(res.data);
        alert('认证成功');
      }
    } catch (error) {
      console.error('Failed to verify identity:', error);
    } finally {
      setIdentitySubmitting(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await logout();
      if (res.errcode === 0) {
        alert('已退出登录');
        onBack();
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const renderImageList = (urls: string[], setter?: React.Dispatch<React.SetStateAction<string[]>>) => (
    <div className="flex flex-wrap gap-3">
      {urls.map((url, index) => (
        <div key={`${url}-${index}`} className="relative">
          <img src={url} alt="资料" className="w-20 h-20 rounded-lg object-cover border border-slate-100" />
          {setter && companyStatus === 'UNVERIFIED' && (
            <button
              onClick={() => handleRemoveImage(index, setter)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-900/70 text-white text-[10px]"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );

  if (loading || !profile) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <div className="sticky top-0 bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
          <button onClick={onBack} className="absolute left-4">
            <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-sm font-bold">设置</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-industry-red border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="sticky top-0 bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
        <button onClick={onBack} className="absolute left-4">
          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-sm font-bold">设置</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-custom p-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold mb-4">个人信息</h2>
          <div className="flex items-start gap-4">
            <div className="relative">
              <img src={avatar || profile.avatar} alt="头像" className="w-16 h-16 rounded-full object-cover border border-slate-100" />
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-white border border-slate-200 rounded-full p-1 shadow"
                disabled={avatarSaving}
              >
                {avatarSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                  </svg>
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatarChange(e.target.files)}
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-1">名称</div>
                  {nameEditing ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-custom"
                      placeholder="请输入名称"
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-700">{name || profile.name}</div>
                  )}
                </div>
                <button
                  onClick={() => (nameEditing ? handleSaveName() : setNameEditing(true))}
                  disabled={nameSaving}
                  className="ml-3 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600"
                >
                  {nameSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : nameEditing ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                    </svg>
                  )}
                </button>
              </div>
              <div>
                <div className="text-xs text-slate-400">手机号</div>
                <div className="text-sm font-bold text-slate-700 mt-1">{profile.phone}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-custom p-4 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold">公司认证</h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${statusMeta[companyStatus].badgeClass}`}>
              {statusMeta[companyStatus].label}
            </span>
          </div>
          {companyStatus === 'VERIFIED' && (
            <div className="text-sm text-slate-700 font-bold mb-3">{profile.companyVerification.companyName}</div>
          )}
          {companyStatus === 'UNVERIFIED' && (
            <div className="text-xs text-slate-400 mb-3">请上传营业执照与补充资料完成认证</div>
          )}
          {companyStatus === 'PENDING' && (
            <div className="text-xs text-amber-600 mb-3">认证审核中，请耐心等待</div>
          )}

          {companyStatus === 'UNVERIFIED' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">营业执照（必传，系统将自动识别公司名称）</span>
                  <button
                    onClick={() => licenseInputRef.current?.click()}
                    className="text-xs text-industry-red font-bold"
                  >
                    上传
                  </button>
                  <input
                    ref={licenseInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleAddImages(e.target.files, setLicensePreviews, 'license', setLicenseUploading);
                      e.target.value = '';
                    }}
                  />
                </div>
                {licenseUploading ? (
                  <div className="text-xs text-slate-400">上传中...</div>
                ) : licensePreviews.length > 0 ? renderImageList(licensePreviews, setLicensePreviews) : (
                  <div className="text-xs text-slate-400">暂无上传</div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">其他资料（可选，多图）</span>
                  <button
                    onClick={() => materialInputRef.current?.click()}
                    className="text-xs text-industry-red font-bold"
                  >
                    上传
                  </button>
                  <input
                    ref={materialInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleAddImages(e.target.files, setMaterialPreviews, 'material', setMaterialUploading);
                      e.target.value = '';
                    }}
                  />
                </div>
                {materialUploading ? (
                  <div className="text-xs text-slate-400">上传中...</div>
                ) : materialPreviews.length > 0 ? renderImageList(materialPreviews, setMaterialPreviews) : (
                  <div className="text-xs text-slate-400">暂无上传</div>
                )}
              </div>
              <button
                onClick={handleSubmitCompany}
                disabled={!canSubmitCompany || companySubmitting}
                className="w-full py-2 bg-industry-red text-white rounded-custom font-bold disabled:opacity-60"
              >
                {companySubmitting ? '提交中...' : '提交认证'}
              </button>
            </div>
          )}

          {companyStatus === 'VERIFIED' && (
            <div className="text-xs text-slate-500">企业认证已通过，资料已归档。</div>
          )}
          {companyStatus === 'PENDING' && (
            <div className="text-xs text-slate-500">资料已提交，审核通过后将展示企业名称。</div>
          )}
        </div>

        <div className="bg-white rounded-custom p-4 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold">个人身份认证</h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${statusMeta[identityStatus].badgeClass}`}>
              {statusMeta[identityStatus].label}
            </span>
          </div>
          {identityStatus === 'VERIFIED' ? (
            <div className="text-xs text-slate-500">
              已通过微信实名认证{profile.personalVerification.wechatName ? `（${profile.personalVerification.wechatName}）` : ''}
              {profile.personalVerification.verifiedAt ? ` · ${profile.personalVerification.verifiedAt}` : ''}
            </div>
          ) : (
            <div className="text-xs text-slate-500">请完成微信实名认证以提升账户安全</div>
          )}
          {identityStatus !== 'VERIFIED' && (
            <button
              onClick={handleVerifyIdentity}
              disabled={identitySubmitting}
              className="mt-3 w-full py-2 bg-slate-100 text-slate-600 rounded-custom font-bold disabled:opacity-60"
            >
              {identitySubmitting ? '认证中...' : '微信实名认证'}
            </button>
          )}
        </div>

        <div className="bg-white rounded-custom p-4 shadow-sm border border-slate-100">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            disabled={logoutLoading}
            className="w-full py-2 bg-slate-900 text-white rounded-custom font-bold disabled:opacity-60"
          >
            {logoutLoading ? '退出中...' : '退出登录'}
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white w-[78%] rounded-custom p-4">
            <div className="text-sm font-bold text-slate-800">确认退出登录？</div>
            <div className="text-xs text-slate-500 mt-2">退出后需要重新登录才能继续使用。</div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-custom bg-slate-100 text-slate-600 font-bold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="flex-1 py-2 rounded-custom bg-slate-900 text-white font-bold"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
