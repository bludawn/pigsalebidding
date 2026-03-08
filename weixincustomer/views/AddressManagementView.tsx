import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AddressItem } from '../types';
import {
  createAddress,
  deleteAddress,
  getAddressList,
  setDefaultAddress,
  updateAddress,
} from '../AppApi';
import RegionPicker from './RegionPicker';

interface AddressManagementViewProps {
  onBack: () => void;
}

const PAGE_SIZE = 50;

const EMPTY_FORM: Omit<AddressItem, 'id'> = {
  contactName: '',
  contactPhone: '',
  regionCode: '',
  regionName: '',
  detailAddress: '',
  isDefault: false,
};

const AddressManagementView: React.FC<AddressManagementViewProps> = ({ onBack }) => {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [error, setError] = useState('');

  const hasSingleAddress = addresses.length === 1;

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAddressList({ current: 1, size: PAGE_SIZE, searchCount: false });
      if (res.errcode === 0 && res.data) {
        setAddresses(res.data.records || []);

        if (res.data.records?.length === 1 && !res.data.records[0].isDefault) {
          await setDefaultAddress({ id: res.data.records[0].id });
          setAddresses(prev => prev.map(item => ({ ...item, isDefault: true })));
        }
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const openCreateForm = () => {
    setEditingAddress(null);
    setFormData(EMPTY_FORM);
    setError('');
    setShowForm(true);
  };

  const openEditForm = (item: AddressItem) => {
    setEditingAddress(item);
    setFormData({
      contactName: item.contactName,
      contactPhone: item.contactPhone,
      regionCode: item.regionCode,
      regionName: item.regionName,
      detailAddress: item.detailAddress,
      isDefault: item.isDefault,
    });
    setError('');
    setShowForm(true);
  };

  const validateForm = () => {
    if (!formData.contactName.trim()) return '请填写联系人';
    if (!formData.contactPhone.trim()) return '请填写联系电话';
    if (!/^[0-9+-]+$/.test(formData.contactPhone.trim())) return '联系电话仅支持数字、+、-';
    if (!formData.regionName.trim()) return '请选择省市区';
    if (!formData.detailAddress.trim()) return '请填写详细地址';
    return '';
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    const payload = {
      contactName: formData.contactName.trim(),
      contactPhone: formData.contactPhone.trim(),
      regionCode: formData.regionCode,
      regionName: formData.regionName,
      detailAddress: formData.detailAddress.trim(),
      isDefault: formData.isDefault,
    };

    try {
      let targetId: string | null = null;

      if (editingAddress) {
        const res = await updateAddress({ ...payload, id: editingAddress.id });
        if (res.errcode === 0) {
          setAddresses(prev => prev.map(item => item.id === editingAddress.id ? { ...item, ...payload } : item));
          targetId = editingAddress.id;
        }
      } else {
        const res = await createAddress(payload);
        if (res.errcode === 0 && res.data) {
          const newAddress: AddressItem = {
            ...payload,
            id: res.data.id,
            isDefault: payload.isDefault,
          };
          setAddresses(prev => [newAddress, ...prev]);
          targetId = res.data.id;
        }
      }

      if (payload.isDefault && targetId) {
        await setDefaultAddress({ id: targetId });
        setAddresses(prev => prev.map(item => ({ ...item, isDefault: item.id === targetId })));
      }

      setShowForm(false);
    } catch (err) {
      console.error('Failed to submit address:', err);
    }
  };

  const handleDelete = async (item: AddressItem) => {
    if (!window.confirm('确认删除该地址吗？')) return;

    try {
      const res = await deleteAddress({ id: item.id });
      if (res.errcode === 0) {
        setAddresses(prev => prev.filter(address => address.id !== item.id));
      }
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const handleSetDefault = async (item: AddressItem) => {
    if (item.isDefault || hasSingleAddress) return;

    try {
      const res = await setDefaultAddress({ id: item.id });
      if (res.errcode === 0) {
        setAddresses(prev => prev.map(address => ({ ...address, isDefault: address.id === item.id })));
      }
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  const displayAddresses = useMemo(() => {
    return addresses.map(address => ({
      ...address,
      isDefault: address.isDefault || (hasSingleAddress && addresses[0]?.id === address.id),
    }));
  }, [addresses, hasSingleAddress]);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <div className="sticky top-0 bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
        <button onClick={onBack} className="absolute left-4">
          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-sm font-bold">收货地址</h1>
        <button onClick={openCreateForm} className="text-xs font-bold text-industry-red">新增</button>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {loading && (
          <div className="py-6 flex justify-center">
            <div className="w-6 h-6 border-2 border-industry-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && displayAddresses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">暂无收货地址</p>
            <button onClick={openCreateForm} className="mt-4 px-4 py-2 bg-industry-red text-white rounded-custom text-xs font-bold">
              添加地址
            </button>
          </div>
        )}

        {displayAddresses.map(address => (
          <div key={address.id} className="bg-white rounded-custom p-4 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">{address.contactName}</span>
                  <span className="text-xs text-slate-500">{address.contactPhone}</span>
                  {address.isDefault && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-industry-red/10 text-industry-red rounded-sm font-bold">默认</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {address.regionName} {address.detailAddress}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => openEditForm(address)} className="text-[10px] text-slate-500">编辑</button>
                <button onClick={() => handleDelete(address)} className="text-[10px] text-rose-500">删除</button>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center text-[10px] text-slate-500">
              <span>{address.updatedAt ? `更新于 ${address.updatedAt}` : ''}</span>
              <button
                onClick={() => handleSetDefault(address)}
                className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-colors ${
                  address.isDefault || hasSingleAddress
                    ? 'border-slate-200 text-slate-300'
                    : 'border-industry-red/40 text-industry-red'
                }`}
              >
                设为默认
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-end">
          <div className="bg-white w-full rounded-t-xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold">{editingAddress ? '编辑地址' : '新增地址'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[11px] text-slate-500 mb-1">联系人</div>
                <input
                  value={formData.contactName}
                  onChange={e => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                  placeholder="请输入联系人"
                  className="w-full bg-slate-50 rounded-custom px-3 py-2 text-sm border border-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <div className="text-[11px] text-slate-500 mb-1">联系电话</div>
                <input
                  value={formData.contactPhone}
                  onChange={e => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="请输入联系电话"
                  className="w-full bg-slate-50 rounded-custom px-3 py-2 text-sm border border-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <div className="text-[11px] text-slate-500 mb-1">省市区</div>
                <button
                  onClick={() => setShowRegionPicker(true)}
                  className="w-full bg-slate-50 rounded-custom px-3 py-2 text-sm border border-slate-100 text-left"
                >
                  {formData.regionName || '请选择省市区'}
                </button>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 mb-1">详细地址</div>
                <textarea
                  value={formData.detailAddress}
                  onChange={e => setFormData(prev => ({ ...prev, detailAddress: e.target.value }))}
                  placeholder="请输入详细地址"
                  className="w-full bg-slate-50 rounded-custom px-3 py-2 text-sm border border-slate-100 focus:outline-none min-h-[80px]"
                />
              </div>

              {!hasSingleAddress && (
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={e => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="accent-industry-red"
                  />
                  设为默认地址
                </label>
              )}

              {error && <div className="text-xs text-rose-500">{error}</div>}

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-industry-red text-white rounded-custom text-sm font-bold"
              >
                保存地址
              </button>
            </div>
          </div>
        </div>
      )}

      {showRegionPicker && (
        <RegionPicker
          visible={showRegionPicker}
          onClose={() => setShowRegionPicker(false)}
          onConfirm={(code, name) => {
            setFormData(prev => ({ ...prev, regionCode: code, regionName: name }));
          }}
          defaultValue={formData.regionCode ? { code: formData.regionCode, name: formData.regionName } : undefined}
        />
      )}
    </div>
  );
};

export default AddressManagementView;
