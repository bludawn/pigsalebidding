import React, { useEffect, useMemo, useState } from 'react';
import { loginByPhonePassword, setAuthToken } from '../AppApi';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

const REMEMBER_PHONE_KEY = 'customer-login-phone';

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_PHONE_KEY);
    if (saved) {
      setPhone(saved);
      setRemember(true);
    }
  }, []);

  const canSubmit = useMemo(() => phone.trim().length > 0 && password.trim().length > 0 && !loading, [phone, password, loading]);

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    const res = await loginByPhonePassword({ phone: phone.trim(), password: password.trim() });
    if (res.errcode === 0 && res.data?.token) {
      setAuthToken(res.data.token);
      if (remember) {
        localStorage.setItem(REMEMBER_PHONE_KEY, phone.trim());
      } else {
        localStorage.removeItem(REMEMBER_PHONE_KEY);
      }
      onLoginSuccess();
    } else {
      setError('账号或密码错误');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-slate-50 flex flex-col px-6 py-10">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-industry-red/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-industry-red" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h16a1 1 0 011 1v5a3 3 0 01-3 3H6a3 3 0 01-3-3V5a1 1 0 011-1zm0 12a1 1 0 011-1h14a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800">生猪竞价客户端</h1>
          <p className="text-xs text-slate-400 mt-2">登录后即可参与竞价与订单管理</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-red-100/40 p-6 border border-red-50">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400">手机号</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="请输入手机号"
                className="w-full mt-2 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-industry-red text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">密码</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full mt-2 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-industry-red text-sm"
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="accent-industry-red"
              />
              记住账号
            </label>
          </div>

          {error && <div className="mt-3 text-[11px] text-industry-red">{error}</div>}

          <button
            onClick={handleLogin}
            disabled={!canSubmit}
            className="w-full mt-5 bg-industry-red text-white py-3 rounded-custom font-bold shadow-lg shadow-industry-red/20 disabled:opacity-60"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-400">登录即表示同意平台服务协议与隐私政策</div>
    </div>
  );
};

export default LoginView;
