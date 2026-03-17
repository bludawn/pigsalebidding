import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AddressItem, AuctionMaintenanceInfo } from '../types';
import { getAuctionMaintenance, saveAuctionMaintenance } from '../AppApi';

interface AuctionMaintenanceViewProps {
  auctionId: string;
  onBack: () => void;
  onSaved: () => void;
  onNavigate?: (route: string, params?: any) => void;
}

type SelectedAddress = Pick<AddressItem, 'id' | 'contactName' | 'contactPhone' | 'regionName' | 'detailAddress'>;

type TimePickerState = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

const WHEEL_ITEM_HEIGHT = 36;
const WHEEL_VISIBLE_COUNT = 5;
const WHEEL_CONTAINER_HEIGHT = WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_COUNT;
const WHEEL_PADDING = (WHEEL_CONTAINER_HEIGHT - WHEEL_ITEM_HEIGHT) / 2;

const pad2 = (value: number) => String(value).padStart(2, '0');

const formatDateTime = (state: TimePickerState) => {
  return `${state.year}-${pad2(state.month)}-${pad2(state.day)} ${pad2(state.hour)}:${pad2(state.minute)}`;
};

const parseDateTime = (value?: string) => {
  if (!value) return null;
  const normalized = value.replace('T', ' ');
  const [datePart, timePart] = normalized.split(' ');
  if (!datePart || !timePart) return null;
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  if ([year, month, day, hour, minute].some(n => Number.isNaN(n))) return null;
  return { year, month, day, hour, minute } as TimePickerState;
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const AuctionMaintenanceView: React.FC<AuctionMaintenanceViewProps> = ({ auctionId, onBack, onSaved, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const [appointmentTime, setAppointmentTime] = useState('');
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePicker, setTimePicker] = useState<TimePickerState>(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
    };
  });

  const yearWheelRef = useRef<HTMLDivElement>(null);
  const monthWheelRef = useRef<HTMLDivElement>(null);
  const dayWheelRef = useRef<HTMLDivElement>(null);
  const hourWheelRef = useRef<HTMLDivElement>(null);
  const minuteWheelRef = useRef<HTMLDivElement>(null);
  const wheelRafRef = useRef<Record<'year' | 'month' | 'day' | 'hour' | 'minute', number | null>>({
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null,
  });

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);
  }, []);
  const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
  const dayOptions = useMemo(
    () => Array.from({ length: getDaysInMonth(timePicker.year, timePicker.month) }, (_, index) => index + 1),
    [timePicker.year, timePicker.month]
  );
  const hourOptions = useMemo(() => Array.from({ length: 24 }, (_, index) => index), []);
  const minuteOptions = useMemo(() => Array.from({ length: 60 }, (_, index) => index), []);

  useEffect(() => {
    const loadMaintenance = async () => {
      setLoading(true);
      try {
        const res = await getAuctionMaintenance({ auctionId });
        if (res.errcode === 0 && res.data) {
          const data = res.data as AuctionMaintenanceInfo;
          setSelectedAddress({
            id: data.addressId,
            contactName: data.contactName,
            contactPhone: data.contactPhone,
            regionName: data.regionName,
            detailAddress: data.detailAddress,
          });
          const normalizedTime = data.appointmentTime ? data.appointmentTime.replace('T', ' ').slice(0, 16) : '';
          setAppointmentTime(normalizedTime);
          setRemark(data.remark || '');
        }
      } catch (err) {
        console.error('Failed to load maintenance info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMaintenance();
  }, [auctionId]);

  const getNearestIndex = (options: number[], value: number) => {
    const exactIndex = options.indexOf(value);
    if (exactIndex >= 0) return exactIndex;
    return options.reduce((closestIndex, option, index) =>
      Math.abs(option - value) < Math.abs(options[closestIndex] - value) ? index : closestIndex
    , 0);
  };

  const scrollWheelTo = (ref: React.RefObject<HTMLDivElement>, index: number) => {
    if (!ref.current) return;
    ref.current.scrollTo({ top: index * WHEEL_ITEM_HEIGHT, behavior: 'auto' });
  };

  useEffect(() => () => {
    (['year', 'month', 'day', 'hour', 'minute'] as const).forEach(type => {
      const rafId = wheelRafRef.current[type];
      if (rafId) cancelAnimationFrame(rafId);
    });
  }, []);

  useEffect(() => {
    const maxDay = dayOptions.length;
    if (timePicker.day > maxDay) {
      setTimePicker(prev => ({ ...prev, day: maxDay }));
    }
  }, [dayOptions.length, timePicker.day]);

  useEffect(() => {
    if (!showTimePicker) return;
    const yearIndex = getNearestIndex(yearOptions, timePicker.year);
    const monthIndex = getNearestIndex(monthOptions, timePicker.month);
    const dayIndex = getNearestIndex(dayOptions, timePicker.day);
    const hourIndex = getNearestIndex(hourOptions, timePicker.hour);
    const minuteIndex = getNearestIndex(minuteOptions, timePicker.minute);
    requestAnimationFrame(() => {
      scrollWheelTo(yearWheelRef, yearIndex);
      scrollWheelTo(monthWheelRef, monthIndex);
      scrollWheelTo(dayWheelRef, dayIndex);
      scrollWheelTo(hourWheelRef, hourIndex);
      scrollWheelTo(minuteWheelRef, minuteIndex);
    });
  }, [showTimePicker, timePicker, yearOptions, monthOptions, dayOptions, hourOptions, minuteOptions]);

  const openTimePicker = () => {
    const parsed = parseDateTime(appointmentTime);
    const nextState = parsed || (() => {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
      };
    })();
    setTimePicker(nextState);
    setShowTimePicker(true);
  };

  const handleWheelScroll = (
    type: 'year' | 'month' | 'day' | 'hour' | 'minute',
    options: number[],
    ref: React.RefObject<HTMLDivElement>
  ) => {
    const target = ref.current;
    if (!target) return;

    const rafId = wheelRafRef.current[type];
    if (rafId) cancelAnimationFrame(rafId);
    wheelRafRef.current[type] = requestAnimationFrame(() => {
      const index = Math.round(target.scrollTop / WHEEL_ITEM_HEIGHT);
      const safeIndex = Math.min(Math.max(index, 0), options.length - 1);
      const value = options[safeIndex];
      setTimePicker(prev => (prev[type] === value ? prev : { ...prev, [type]: value }));
    });
  };

  const handleWheelSnap = (options: number[], ref: React.RefObject<HTMLDivElement>) => {
    const target = ref.current;
    if (!target) return;
    const index = Math.round(target.scrollTop / WHEEL_ITEM_HEIGHT);
    const safeIndex = Math.min(Math.max(index, 0), options.length - 1);
    scrollWheelTo(ref, safeIndex);
  };

  const handleWheelClick = (
    type: 'year' | 'month' | 'day' | 'hour' | 'minute',
    value: number,
    index: number,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    setTimePicker(prev => ({ ...prev, [type]: value }));
    scrollWheelTo(ref, index);
  };

  const canSubmit = useMemo(() => {
    return Boolean(selectedAddress && appointmentTime && !submitting);
  }, [appointmentTime, selectedAddress, submitting]);

  const handleSubmit = async () => {
    if (!selectedAddress) {
      setError('请选择收货地址');
      return;
    }
    if (!appointmentTime) {
      setError('请选择装猪时间');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await saveAuctionMaintenance({
        auctionId,
        addressId: selectedAddress.id,
        appointmentTime: appointmentTime,
        remark: remark.trim(),
      });
      if (res.errcode === 0) {
        onSaved();
      }
    } catch (err) {
      console.error('Failed to save maintenance info:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-10">
      <div className="sticky top-0 bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
        <button onClick={onBack} className="absolute left-4">
          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-sm font-bold">信息维护</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-2 border-industry-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="px-4 py-4 space-y-4">
          <div className="bg-white rounded-custom p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold">收货地址</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">请选择用于装猪的收货地址</p>
              </div>
              <button
                onClick={() => onNavigate?.('address-management', {
                  mode: 'select',
                  onSelect: (address: AddressItem) => setSelectedAddress(address),
                })}
                className="text-xs font-bold text-industry-red"
              >
                选择地址
              </button>
            </div>
            {selectedAddress ? (
              <div className="text-[11px] text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span>{selectedAddress.contactName}</span>
                  <span>{selectedAddress.contactPhone}</span>
                </div>
                <div className="mt-1">
                  {selectedAddress.regionName} {selectedAddress.detailAddress}
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400">尚未选择地址</div>
            )}
          </div>

          <div className="bg-white rounded-custom p-4 shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold mb-3">装猪时间</h2>
            <button
              type="button"
              onClick={openTimePicker}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-custom flex items-center justify-between"
            >
              <span className={appointmentTime ? 'text-slate-700' : 'text-slate-400'}>
                {appointmentTime || '请选择年月日时分'}
              </span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="text-[11px] text-slate-400 mt-2">请选择年月日与具体时分</div>
          </div>

          <div className="bg-white rounded-custom p-4 shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold mb-3">备注</h2>
            <textarea
              value={remark}
              onChange={e => setRemark(e.target.value)}
              placeholder="可填写装猪要求、车辆信息等"
              className="w-full min-h-[90px] px-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-custom"
            />
          </div>

          {error && <div className="text-xs text-rose-500">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3 bg-industry-red text-white rounded-custom text-sm font-bold shadow-lg shadow-industry-red/20 disabled:opacity-60"
          >
            {submitting ? '提交中...' : '确认维护'}
          </button>
        </div>
      )}

      {showTimePicker && (
        <div
          className="fixed inset-0 bg-black/40 z-[120] flex items-end animate-in fade-in duration-200"
          onClick={() => setShowTimePicker(false)}
        >
          <div
            className="bg-white w-full rounded-t-xl p-4 max-h-[70vh] overflow-y-auto"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">选择装猪时间</h3>
              <button onClick={() => setShowTimePicker(false)} className="text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-50 rounded-custom p-4">
              <div className="text-xs text-slate-400 mb-2">选择日期与时分</div>
              <div className="text-sm font-bold text-slate-800">{formatDateTime(timePicker)}</div>
              <div className="mt-4 relative">
                <div className="flex">
                  {[
                    { type: 'year' as const, options: yearOptions, ref: yearWheelRef, label: '年' },
                    { type: 'month' as const, options: monthOptions, ref: monthWheelRef, label: '月' },
                    { type: 'day' as const, options: dayOptions, ref: dayWheelRef, label: '日' },
                    { type: 'hour' as const, options: hourOptions, ref: hourWheelRef, label: '时' },
                    { type: 'minute' as const, options: minuteOptions, ref: minuteWheelRef, label: '分' },
                  ].map(column => (
                    <div key={column.label} className="flex-1 flex flex-col items-center">
                      <div className="text-[10px] text-slate-400 mb-2">{column.label}</div>
                      <div
                        ref={column.ref}
                        onScroll={() => handleWheelScroll(column.type, column.options, column.ref)}
                        onTouchEnd={() => handleWheelSnap(column.options, column.ref)}
                        onMouseUp={() => handleWheelSnap(column.options, column.ref)}
                        onMouseLeave={() => handleWheelSnap(column.options, column.ref)}
                        className="w-full overflow-y-auto overscroll-contain snap-y snap-mandatory hide-scrollbar"
                        style={{
                          height: WHEEL_CONTAINER_HEIGHT,
                          paddingTop: WHEEL_PADDING,
                          paddingBottom: WHEEL_PADDING,
                        }}
                      >
                        {column.options.map((value, index) => (
                          <button
                            key={`${column.label}-${value}`}
                            onClick={() => handleWheelClick(column.type, value, index, column.ref)}
                            className={`w-full flex items-center justify-center text-sm snap-center transition-colors ${
                              timePicker[column.type] === value ? 'text-industry-red font-bold' : 'text-slate-600'
                            }`}
                            style={{ height: WHEEL_ITEM_HEIGHT }}
                          >
                            {column.type === 'hour' || column.type === 'minute' ? pad2(value) : value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowTimePicker(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-custom font-bold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setAppointmentTime(formatDateTime(timePicker));
                  setShowTimePicker(false);
                }}
                className="flex-1 py-3 bg-industry-red text-white rounded-custom font-bold"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionMaintenanceView;
