# 生猪贸易软件系统——微信小程序客户端

本工程是项目微信小程序客户端，给企业客户采购生猪使用，使用 Node.js 开发，开发语言是 TypeScript。

## 功能概述

软件功能页面分为 3 大部分，分别是首页、消息、我的：

- **首页（竞价列表）**：筛选排序、查看详情、竞价出价、自由报价
- **消息中心**：商品猪消息、支付消息、商城消息
- **我的**：个人信息、我的订单、收货地址、账户资产、业务统计、功能区

## 本工程必须依赖的规范参考 CODERULE.md 文件

## 技术栈

- React 19
- TypeScript
- Vite 6

---

## 目录结构

```
weixincustomer/
├── dist/                    # 构建输出目录
├── views/                   # 页面视图组件
│   ├── HomeView.tsx         # 首页 - 竞价列表
│   ├── MessageView.tsx      # 消息中心入口
│   ├── ProfileView.tsx      # 个人中心页
│   ├── AuctionDetail.tsx    # 竞价详情页
│   ├── FreeQuote.tsx        # 自由报价页
│   ├── MessageList.tsx      # 消息列表页
│   ├── PaymentDetail.tsx    # 支付明细页
│   ├── MatchDetail.tsx      # 匹配详情页
│   ├── MyBidsView.tsx       # 我的竞拍页
│   └── AddressManagementView.tsx # 收货地址管理页
├── components/              # 通用组件
│   ├── AuctionCard.tsx      # 竞价列表卡片
│   └── CountdownTimer.tsx   # 倒计时组件
├── App.tsx                  # 应用主入口，路由管理
├── AppApi.tsx               # API 接口层
├── index.tsx                # React DOM 挂载入口
├── types.ts                 # TypeScript 类型定义
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── vite.config.ts           # Vite 构建配置
├── tsconfig.json            # TypeScript 配置
├── metadata.json            # 应用元数据
├── CODERULE.md              # 开发规范文档
└── README.md                # 项目说明
```

---

## 各文件功能详解

### 配置文件

| 文件 | 功能 |
|------|------|
| `package.json` | 项目依赖管理，使用 pnpm，包含 react@19、vite@6 |
| `vite.config.ts` | Vite 配置，端口 3000，支持 `@` 路径别名 |
| `tsconfig.json` | TypeScript 编译配置 |
| `metadata.json` | 应用元信息，请求地理位置权限 |
| `CODERULE.md` | 开发规范：SOLID 原则、API 规范（`v1/weixincustomer/` 前缀）、分页格式 |

### 核心入口文件

| 文件 | 功能 |
|------|------|
| `index.tsx` | React 应用挂载入口 |
| `App.tsx` | 主应用组件，实现简易路由系统，管理 4 个 Tab 页面和 5 个子页面 |
| `types.ts` | 定义核心类型：`TabType`、`AuctionItem`、`NewsItem`、`Message` |
| `AppApi.tsx` | API 接口层，统一管理所有后端接口调用 |

### 页面组件 (views/)

| 组件 | 功能 |
|------|------|
| **HomeView.tsx** | 首页，展示竞价列表，支持搜索、筛选（区域/体重/等级/距离），倒计时组件 |
| **MessageView.tsx** | 消息中心入口，三类消息入口：商品猪、支付、商城 |
| **ProfileView.tsx** | 个人中心，展示个人信息、订单数量、资产与统计 |
| **AuctionDetail.tsx** | 竞价详情页，展示竞价参数、委托出价、竞价须知 |
| **FreeQuote.tsx** | 自由报价页，提交报价参与撮合 |
| **MessageList.tsx** | 消息列表，根据类型展示不同消息内容 |
| **PaymentDetail.tsx** | 支付明细，展示账户余额、交易记录 |
| **MatchDetail.tsx** | 匹配详情，展示报单匹配结果 |
| **MyBidsView.tsx** | 我的竞拍页，按状态展示竞拍记录 |
| **AddressManagementView.tsx** | 收货地址管理页，支持增删改查 |

---

## 路由架构

`App.tsx` 实现了简易路由：

```
tabs (主 Tab 页面)
├── home    → HomeView
├── message → MessageView
└── profile → ProfileView

子页面
├── auction-detail      → AuctionDetail
├── free-quote          → FreeQuote
├── msg-list            → MessageList
├── payment-detail      → PaymentDetail
├── match-detail        → MatchDetail
├── my-bids             → MyBidsView
└── address-management  → AddressManagementView
```

---


## API 接口模块

`AppApi.tsx` 是 API 接口层，统一管理所有后端接口调用。

所有接口遵循规范：前缀 `v1/weixincustomer/`，POST 方式，驼峰命名。

---

## weixincustomer_holder是一个微信小程序入口工程，用WebView打开本应用H5页面

## 本地运行

**需要:** Node.js

1. 安装依赖:
   ```bash
   npm install
   # 或
   pnpm install
   ```

2. dev 运行:
   ```bash
   npm run dev
   ```

3. 构建生产版本:
   ```bash
   npm run build
   ```

---

## 开发规范要点 参考 CODERULE.md

