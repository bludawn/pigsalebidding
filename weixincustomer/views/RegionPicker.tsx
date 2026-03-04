import React, { useState, useEffect } from 'react';
import { RegionItem } from '../types';
import { getRegionList } from '../AppApi';

interface RegionPickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (code: string, name: string) => void;
  defaultValue?: { code: string; name: string };
}

const RegionPicker: React.FC<RegionPickerProps> = ({
  visible,
  onClose,
  onConfirm,
  defaultValue,
}) => {
  // 各级数据
  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [cities, setCities] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);
  const [towns, setTowns] = useState<RegionItem[]>([]);

  // 当前选中
  const [selectedProvince, setSelectedProvince] = useState<RegionItem | null>(null);
  const [selectedCity, setSelectedCity] = useState<RegionItem | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<RegionItem | null>(null);
  const [selectedTown, setSelectedTown] = useState<RegionItem | null>(null);

  // 当前激活的tab
  const [activeTab, setActiveTab] = useState(0);

  // 加载省份数据
  useEffect(() => {
    if (visible && provinces.length === 0) {
      loadProvinces();
    }
  }, [visible]);

  const loadProvinces = async () => {
    const res = await getRegionList();
    if (res.errcode === 0 && res.data) {
      setProvinces(res.data);
    }
  };

  const loadCities = async (parentCode: string) => {
    const res = await getRegionList({ parentCode });
    if (res.errcode === 0 && res.data) {
      setCities(res.data);
    }
  };

  const loadDistricts = async (parentCode: string) => {
    const res = await getRegionList({ parentCode });
    if (res.errcode === 0 && res.data) {
      setDistricts(res.data);
    }
  };

  const loadTowns = async (parentCode: string) => {
    const res = await getRegionList({ parentCode });
    if (res.errcode === 0 && res.data) {
      setTowns(res.data);
    }
  };

  // 选择省份
  const handleSelectProvince = (item: RegionItem) => {
    setSelectedProvince(item);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setSelectedTown(null);
    setCities([]);
    setDistricts([]);
    setTowns([]);
    loadCities(item.code);
    setActiveTab(1);
  };

  // 选择城市
  const handleSelectCity = (item: RegionItem) => {
    setSelectedCity(item);
    setSelectedDistrict(null);
    setSelectedTown(null);
    setDistricts([]);
    setTowns([]);
    loadDistricts(item.code);
    setActiveTab(2);
  };

  // 选择区/县
  const handleSelectDistrict = (item: RegionItem) => {
    setSelectedDistrict(item);
    setSelectedTown(null);
    setTowns([]);
    loadTowns(item.code);
    setActiveTab(3);
  };

  // 选择镇
  const handleSelectTown = (item: RegionItem) => {
    setSelectedTown(item);
  };

  // 确认选择
  const handleConfirm = () => {
    // 返回最深层级的选择
    const selected = selectedTown || selectedDistrict || selectedCity || selectedProvince;
    if (selected) {
      // 构建完整名称
      const names = [
        selectedProvince?.name,
        selectedCity?.name,
        selectedDistrict?.name,
        selectedTown?.name,
      ].filter(Boolean);
      onConfirm(selected.code, names.join(' '));
    }
    onClose();
  };

  // 重置
  const handleReset = () => {
    setSelectedProvince(null);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setSelectedTown(null);
    setActiveTab(0);
  };

  // 获取当前列表
  const getCurrentList = () => {
    switch (activeTab) {
      case 0: return provinces;
      case 1: return cities;
      case 2: return districts;
      case 3: return towns;
      default: return [];
    }
  };

  // 获取当前选中项
  const getCurrentSelected = () => {
    switch (activeTab) {
      case 0: return selectedProvince;
      case 1: return selectedCity;
      case 2: return selectedDistrict;
      case 3: return selectedTown;
      default: return null;
    }
  };

  const tabs = ['省份', '城市', '区/县', '乡镇'];

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-end" onClick={onClose}>
      <div 
        className="bg-white w-full rounded-t-xl max-h-[70vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
          <button onClick={handleReset} className="text-slate-400 text-sm">重置</button>
          <h3 className="font-bold text-slate-800">选择区域</h3>
          <button onClick={onClose} className="text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {tabs.map((tab, index) => {
            const hasData = index === 0 || 
              (index === 1 && selectedProvince) ||
              (index === 2 && selectedCity) ||
              (index === 3 && selectedDistrict);
            
            if (!hasData) return null;
            
            const isSelected = index === activeTab;
            const selectedName = index === 0 ? selectedProvince?.name :
              index === 1 ? selectedCity?.name :
              index === 2 ? selectedDistrict?.name :
              selectedTown?.name;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={`flex-1 py-3 text-center text-sm border-b-2 transition-colors ${
                  isSelected 
                    ? 'text-industry-red border-industry-red font-bold' 
                    : 'text-slate-500 border-transparent'
                }`}
              >
                {selectedName || tab}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {getCurrentList().map((item) => {
            const selected = getCurrentSelected();
            const isSelected = selected?.code === item.code;

            return (
              <button
                key={item.code}
                onClick={() => {
                  switch (activeTab) {
                    case 0: handleSelectProvince(item); break;
                    case 1: handleSelectCity(item); break;
                    case 2: handleSelectDistrict(item); break;
                    case 3: handleSelectTown(item); break;
                  }
                }}
                className={`w-full px-4 py-3 text-left flex justify-between items-center active:bg-slate-50 transition-colors ${
                  isSelected ? 'bg-industry-red/5' : ''
                }`}
              >
                <span className={`text-sm ${isSelected ? 'text-industry-red font-bold' : 'text-slate-700'}`}>
                  {item.name}
                </span>
                {isSelected && (
                  <svg className="w-5 h-5 text-industry-red" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}

          {getCurrentList().length === 0 && activeTab > 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              暂无数据
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-industry-red text-white rounded-custom font-bold"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionPicker;
