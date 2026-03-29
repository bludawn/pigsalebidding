import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OrderDetailInfo, OrderStatus } from '../types';
import { cancelOrder, confirmReceipt, getOrderDetail, payOrder } from '../AppApi';

interface OrderDetailViewProps {
  params: { orderId: string };
  onBack: () => void;
}

const statusMetaMap: Record<OrderStatus, { label: string; desc: string; badgeClass: string }> = {
  ORDER_PAYMENT: { label: '待付款', desc: '请尽快完成支付', badgeClass: 'bg-industry-red/10 text-industry-red' },
  ORDER_SHIPMENT: { label: '待发货', desc: '场点正在安排发货', badgeClass: 'bg-amber-100 text-amber-700' },
  ORDER_RECEIPT: { label: '待收货', desc: '运输途中，请注意查收', badgeClass: 'bg-blue-100 text-blue-700' },
  ORDER_COMPLETED: { label: '已完成', desc: '订单已完成', badgeClass: 'bg-emerald-100 text-emerald-700' },
  ORDER_CANCELLED: { label: '已取消', desc: '订单已取消，可重新下单', badgeClass: 'bg-slate-200 text-slate-600' },
};

const OrderDetailView: React.FC<OrderDetailViewProps> = ({ params, onBack }) => {
  const [detail, setDetail] = useState<OrderDetailInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const amapRef = useRef<any>(null);
  const amapOverlaysRef = useRef<any[]>([]);
  const amapReadyRef = useRef(false);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrderDetail({ orderId: params.orderId });
      if (res.errcode === 0 && res.data) {
        setDetail(res.data);
      }
    } catch (error) {
      console.error('Failed to load order detail:', error);
    } finally {
      setLoading(false);
    }
  }, [params.orderId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const statusMeta = useMemo(() => (detail ? statusMetaMap[detail.status] : null), [detail]);
  const deliveryInfos = useMemo(() => (detail?.deliveryInfos || []).filter(Boolean), [detail]);

  const ensureAmap = useCallback(() => {
    if ((window as any).AMap) {
      return Promise.resolve((window as any).AMap);
    }
    if ((window as any)._amapLoading) {
      return (window as any)._amapLoading;
    }
    const amapKey = (window as any).AMAP_KEY || '';
    if (!amapKey) {
      setMapError('未配置高德地图 Key');
      return Promise.reject(new Error('Missing AMap key'));
    }
    const securityJsCode = (window as any).AMAP_SECURITY_JS_CODE || '';
    if (securityJsCode && !(window as any)._AMapSecurityConfig) {
      (window as any)._AMapSecurityConfig = { securityJsCode };
    }
    (window as any)._amapLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}&plugin=AMap.Geocoder,AMap.ToolBar,AMap.Scale`;
      script.onload = () => {
        if ((window as any).AMap) {
          resolve((window as any).AMap);
        } else {
          (window as any)._amapLoading = null;
          reject(new Error('AMap load failed'));
        }
      };
      script.onerror = () => {
        (window as any)._amapLoading = null;
        reject(new Error('AMap load failed'));
      };
      document.body.appendChild(script);
    });
    return (window as any)._amapLoading;
  }, []);

  const clearAmapOverlays = useCallback(() => {
    if (amapRef.current && amapOverlaysRef.current.length) {
      amapOverlaysRef.current.forEach((overlay) => {
        try {
          amapRef.current.remove(overlay);
        } catch (error) {
          // ignore
        }
      });
      amapOverlaysRef.current = [];
    }
  }, []);

  const geocodeAddress = useCallback((AMap: any, address?: string) => {
    return new Promise<[number, number] | null>((resolve) => {
      if (!address) {
        resolve(null);
        return;
      }
      const geocoder = new AMap.Geocoder({ city: '' });
      geocoder.getLocation(address, (status: string, result: any) => {
        if (status === 'complete' && result?.geocodes?.length) {
          const location = result.geocodes[0].location;
          resolve([location.lng, location.lat]);
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  const resolveLngLat = useCallback((lng?: string, lat?: string) => {
    const lngNum = Number(lng);
    const latNum = Number(lat);
    if (Number.isFinite(lngNum) && Number.isFinite(latNum)) {
      return [lngNum, latNum] as [number, number];
    }
    return null;
  }, []);

  const renderAmap = useCallback(async () => {
    if (!detail || deliveryInfos.length === 0) {
      return;
    }
    const container = document.getElementById('order-delivery-map');
    mapRef.current = container as HTMLDivElement | null;
    if (!container) {
      return;
    }
    try {
      const AMap = await ensureAmap();
      if (!amapRef.current) {
        amapRef.current = new AMap.Map(container, {
          zoom: 11,
          center: [116.397428, 39.90923],
        });
        amapRef.current.addControl(new AMap.ToolBar());
        amapRef.current.addControl(new AMap.Scale());
      }
      clearAmapOverlays();

      const shipFromAddress = detail.farmAddress || detail.farmName;
      const shipToAddress = detail.deliveryInfo?.address;
      const fallbackFromPoint = await geocodeAddress(AMap, shipFromAddress);
      const fallbackToPoint = await geocodeAddress(AMap, shipToAddress);
      const fromPoint = resolveLngLat(detail.farmLongitude, detail.farmLatitude) || fallbackFromPoint;
      const toPoint =
        resolveLngLat(detail.deliveryInfo?.longitude, detail.deliveryInfo?.latitude) || fallbackToPoint;

      const bounds: any[] = [];
      const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

      if (fromPoint) {
        const marker = new AMap.Marker({
          position: fromPoint,
          label: { content: '发货', direction: 'top' },
        });
        amapRef.current.add(marker);
        amapOverlaysRef.current.push(marker);
        bounds.push(fromPoint);
      }

      if (toPoint) {
        const marker = new AMap.Marker({
          position: toPoint,
          label: { content: '收货', direction: 'top' },
        });
        amapRef.current.add(marker);
        amapOverlaysRef.current.push(marker);
        bounds.push(toPoint);
      }

      deliveryInfos.forEach((info, index) => {
        const currentPoint = resolveLngLat(info.currentLongitude, info.currentLatitude);

        if (currentPoint) {
          const marker = new AMap.Marker({
            position: currentPoint,
            label: { content: `当前${index + 1}`, direction: 'top' },
          });
          amapRef.current.add(marker);
          amapOverlaysRef.current.push(marker);
          bounds.push(currentPoint);
        }

        const path = [fromPoint, currentPoint, toPoint].filter(Boolean);
        if (path.length >= 2) {
          const polyline = new AMap.Polyline({
            path,
            strokeColor: colors[index % colors.length],
            strokeWeight: 4,
          });
          amapRef.current.add(polyline);
          amapOverlaysRef.current.push(polyline);
        }
      });

      if (bounds.length) {
        amapRef.current.setFitView(bounds);
      }
      amapReadyRef.current = true;
      setMapError(null);
    } catch (error) {
      setMapError('地图加载失败');
    }
  }, [clearAmapOverlays, deliveryInfos, detail, ensureAmap, geocodeAddress, resolveLngLat]);

  useEffect(() => {
    renderAmap();
  }, [renderAmap]);

  const handleCancel = async () => {
    if (!detail) return;
    setActionLoading(true);
    try {
      const res = await cancelOrder({ orderId: detail.orderId });
      if (res.errcode === 0) {
        alert('订单已取消');
        await loadDetail();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handlePay = async () => {
    if (!detail) return;
    setActionLoading(true);
    try {
      const res = await payOrder({ orderId: detail.orderId });
      if (res.errcode === 0) {
        alert('支付完成');
        await loadDetail();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!detail) return;
    setActionLoading(true);
    try {
      const res = await confirmReceipt({ orderId: detail.orderId });
      if (res.errcode === 0) {
        alert('已确认收货');
        await loadDetail();
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !detail || !statusMeta) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <div className="sticky top-0 bg-white px-4 py-4 border-b border-slate-100 flex items-center z-10">
          <button onClick={onBack} className="absolute left-4">
            <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-sm font-bold">订单详情</h1>
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
        <h1 className="flex-1 text-center text-sm font-bold">订单详情</h1>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-custom p-4 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${statusMeta.badgeClass}`}>
              {statusMeta.label}
            </span>
            <span className="text-[10px] text-slate-400">订单号：{detail.orderId}</span>
          </div>
          <div className="text-sm font-bold text-slate-800">{statusMeta.desc}</div>
        </div>

        <div className="bg-white rounded-custom p-4 mt-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold mb-3">商品信息</h2>
          <div className="text-xs text-slate-500 space-y-2">
            <div className="flex justify-between"><span>场点</span><span className="text-slate-800 font-bold">{detail.farmName}</span></div>
            <div className="flex justify-between"><span>品种</span><span className="text-slate-800 font-bold">{detail.pigTypeName}</span></div>
            <div className="flex justify-between"><span>体重段</span><span className="text-slate-800 font-bold">{detail.weightRange}</span></div>
            <div className="flex justify-between"><span>数量</span><span className="text-slate-800 font-bold">{detail.quantity}头</span></div>
            <div className="flex justify-between"><span>单价</span><span className="text-slate-800 font-bold">¥{detail.price.toFixed(2)}/kg</span></div>
          </div>
        </div>

        <div className="bg-white rounded-custom p-4 mt-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold mb-3">价格明细</h2>
          <div className="text-xs text-slate-500 space-y-2">
            <div className="flex justify-between"><span>保证金</span><span className="text-slate-800 font-bold">¥{detail.priceInfo.depositAmount.toLocaleString('zh-CN')}</span></div>
            <div className="flex justify-between"><span>货款</span><span className="text-slate-800 font-bold">¥{detail.priceInfo.goodsAmount.toLocaleString('zh-CN')}</span></div>
            {detail.priceInfo.freightAmount !== undefined && (
              <div className="flex justify-between"><span>运费</span><span className="text-slate-800 font-bold">¥{detail.priceInfo.freightAmount.toLocaleString('zh-CN')}</span></div>
            )}
            <div className="flex justify-between"><span>合计</span><span className="text-industry-red font-black">¥{detail.priceInfo.totalAmount.toLocaleString('zh-CN')}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-custom p-4 mt-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold mb-3">收货信息</h2>
          <div className="text-xs text-slate-500 space-y-2">
            <div className="flex justify-between"><span>联系人</span><span className="text-slate-800 font-bold">{detail.deliveryInfo.contactName}</span></div>
            <div className="flex justify-between"><span>联系电话</span><span className="text-slate-800 font-bold">{detail.deliveryInfo.contactPhone}</span></div>
            <div className="flex justify-between"><span>收货地址</span><span className="text-slate-800 font-bold text-right">{detail.deliveryInfo.address}</span></div>
            {detail.deliveryInfo.deliveryTime && (
              <div className="flex justify-between"><span>装猪时间</span><span className="text-slate-800 font-bold">{detail.deliveryInfo.deliveryTime}</span></div>
            )}
          </div>
        </div>

        {deliveryInfos.length > 0 && (
          <div className="bg-white rounded-custom p-4 mt-4 shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold mb-3">物流信息</h2>
            <div className="space-y-3">
              {deliveryInfos.map((info, index) => (
                <div key={`${info.transportCode || 'delivery'}-${index}`} className="border border-slate-100 rounded-custom p-3">
                  <div className="text-xs text-slate-500 space-y-2">
                    {info.transportCode && (
                      <div className="flex justify-between"><span>运输编码</span><span className="text-slate-800 font-bold">{info.transportCode}</span></div>
                    )}
                    {info.vehicleNo && (
                      <div className="flex justify-between"><span>车牌号</span><span className="text-slate-800 font-bold">{info.vehicleNo}</span></div>
                    )}
                    {info.driverName && (
                      <div className="flex justify-between"><span>司机</span><span className="text-slate-800 font-bold">{info.driverName}</span></div>
                    )}
                    {info.driverPhone && (
                      <div className="flex justify-between"><span>联系电话</span><span className="text-slate-800 font-bold">{info.driverPhone}</span></div>
                    )}
                    {info.deliveryStatus && (
                      <div className="flex justify-between"><span>状态</span><span className="text-slate-800 font-bold">{info.deliveryStatus}</span></div>
                    )}
                    {info.remark && (
                      <div className="flex justify-between"><span>备注</span><span className="text-slate-800 font-bold">{info.remark}</span></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <div id="order-delivery-map" className="h-64 w-full rounded-custom border border-slate-100" />
              {mapError && (
                <div className="text-[10px] text-amber-600 mt-2">{mapError}</div>
              )}
            </div>
          </div>
        )}

        {detail.contractName && (
          <div className="bg-white rounded-custom p-4 mt-4 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold">合同/协议</h2>
              <button className="text-xs text-industry-red font-bold" onClick={() => alert('查看合同')}>
                查看
              </button>
            </div>
            <div className="text-xs text-slate-500 mt-2">{detail.contractName}</div>
          </div>
        )}

        <div className="bg-white rounded-custom p-4 mt-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold mb-3">订单状态</h2>
          <div className="space-y-3">
            {detail.timeline.map((node, index) => (
              <div key={`${node.label}-${index}`} className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-industry-red mt-1.5" />
                <div>
                  <div className="text-xs font-bold text-slate-700">{node.label}</div>
                  {node.time && <div className="text-[10px] text-slate-400 mt-0.5">{node.time}</div>}
                  {node.desc && <div className="text-[10px] text-slate-500 mt-0.5">{node.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 max-w-md mx-auto">
        <div className="flex gap-3">
          {detail.status === 'ORDER_PAYMENT' && (
            <>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-custom font-bold disabled:opacity-60"
              >
                取消订单
              </button>
              <button
                onClick={handlePay}
                disabled={actionLoading}
                className="flex-1 py-2 bg-industry-red text-white rounded-custom font-bold disabled:opacity-60"
              >
                去支付
              </button>
            </>
          )}
          {detail.status === 'ORDER_SHIPMENT' && (
            <button
              onClick={() => alert('联系场点')}
              className="flex-1 py-2 bg-industry-red text-white rounded-custom font-bold"
            >
              联系场点
            </button>
          )}
          {detail.status === 'ORDER_RECEIPT' && (
            <button
              onClick={handleConfirm}
              disabled={actionLoading}
              className="flex-1 py-2 bg-industry-red text-white rounded-custom font-bold disabled:opacity-60"
            >
              确认收货
            </button>
          )}
          {detail.status === 'ORDER_COMPLETED' && (
            <button
              onClick={() => alert('再次采购')}
              className="flex-1 py-2 bg-industry-red text-white rounded-custom font-bold"
            >
              再次采购
            </button>
          )}
          {detail.status === 'ORDER_CANCELLED' && (
            <button
              onClick={() => alert('重新下单')}
              className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-custom font-bold"
            >
              重新下单
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
