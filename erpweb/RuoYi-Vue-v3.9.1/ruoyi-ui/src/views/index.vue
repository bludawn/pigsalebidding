<template>
  <div class="app-container dashboard-home">
    <div class="dashboard-header">
      <div>
        <h2>生猪贸易信息聚合大屏</h2>
        <p>订单、收款、竞拍关键指标总览</p>
      </div>
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="loadOverview">刷新数据</el-button>
    </div>

    <el-row :gutter="16" class="mb16">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="kpi-card amount-card">
          <div class="kpi-title">待收款</div>
          <div class="kpi-value">¥{{ formatMoney(overview.pendingReceivableAmount) }}</div>
          <div class="kpi-desc">未完成订单待收总额</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="kpi-card income-card">
          <div class="kpi-title">本月收款</div>
          <div class="kpi-value">¥{{ formatMoney(overview.monthlyCompletedIncome) }}</div>
          <div class="kpi-desc">本月已完成订单收入</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="kpi-card order-card" @click="goOrderList()">
          <div class="kpi-title">订单总数</div>
          <div class="kpi-value clickable">{{ overview.orderTotalCount || 0 }}</div>
          <div class="kpi-desc">点击进入订单列表</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="kpi-card today-card">
          <div class="kpi-title">今日新增</div>
          <div class="kpi-value">{{ overview.todayNewOrderCount || 0 }}</div>
          <div class="kpi-desc">今日新增订单</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mb16">
      <el-col :xs="24" :lg="14">
        <el-card shadow="never" class="panel-card">
          <div slot="header" class="panel-header">
            <span>订单状态分布（点击跳转）</span>
          </div>
          <el-row :gutter="12">
            <el-col :xs="12" :sm="8" :md="6" v-for="item in orderStatusCards" :key="item.status">
              <div class="status-card" @click="goOrderList(item.status)">
                <div class="status-label">{{ item.label }}</div>
                <div class="status-value">{{ item.value }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card shadow="never" class="panel-card bidding-panel">
          <div slot="header" class="panel-header">
            <span>竞拍聚合（点击数字查看竞价商品）</span>
          </div>
          <div class="metric-row">
            <span>当前竞拍商品</span>
            <span class="metric-value" @click="goBidProductList('BIDDING')">{{ overview.currentBiddingProductCount || 0 }}</span>
          </div>
          <div class="metric-row">
            <span>参与出价总数</span>
            <span class="metric-value" @click="goBidProductList()">{{ overview.totalBidRecordCount || 0 }}</span>
          </div>
          <div class="metric-row">
            <span>竞拍总猪数量</span>
            <span class="metric-value" @click="goBidProductList('BIDDING')">{{ overview.currentBiddingPigCount || 0 }}</span>
          </div>
          <div class="metric-row">
            <span>参与客户数</span>
            <span>{{ overview.participantUserCount || 0 }}</span>
          </div>
          <div class="metric-row">
            <span>今日新增出价</span>
            <span>{{ overview.todayBidCount || 0 }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="24">
        <el-card shadow="never" class="panel-card quick-panel">
          <div slot="header" class="panel-header">
            <span>快捷入口</span>
          </div>
          <el-button type="text" @click="goOrderList('WAIT_PAY')">待付款订单</el-button>
          <el-button type="text" @click="goOrderList('WAIT_RECEIVE')">待收货订单</el-button>
          <el-button type="text" @click="goOrderList('WAIT_FINAL_PAY')">待尾款订单</el-button>
          <el-button type="text" @click="goBidProductList('BIDDING')">竞价中商品</el-button>
          <el-button type="text" @click="goBidProductList()">全部竞价商品</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPigDashboardOverview } from '@/api/pig/dashboard'

export default {
  name: 'Index',
  data() {
    return {
      loading: false,
      overview: {
        orderStatusCounts: {},
        pendingReceivableAmount: 0,
        monthlyCompletedIncome: 0,
        orderTotalCount: 0,
        todayNewOrderCount: 0,
        currentBiddingProductCount: 0,
        totalBidRecordCount: 0,
        currentBiddingPigCount: 0,
        participantUserCount: 0,
        todayBidCount: 0
      },
      orderStatusLabelMap: {
        WAIT_CONFIRM: '待确认',
        WAIT_PAY: '待付款',
        WAIT_SHIP: '待发货',
        WAIT_RECEIVE: '待收货',
        WAIT_FINAL_PAY: '待尾款',
        COMPLETED: '已完成',
        CANCELED: '已取消'
      }
    }
  },
  computed: {
    orderStatusCards() {
      const counts = this.overview.orderStatusCounts || {}
      return Object.keys(this.orderStatusLabelMap).map((status) => ({
        status,
        label: this.orderStatusLabelMap[status],
        value: counts[status] || 0
      }))
    }
  },
  created() {
    this.loadOverview()
  },
  methods: {
    async loadOverview() {
      this.loading = true
      try {
        const res = await getPigDashboardOverview()
        this.overview = {
          ...this.overview,
          ...(res.data || {})
        }
      } finally {
        this.loading = false
      }
    },
    formatMoney(value) {
      const amount = Number(value || 0)
      if (Number.isNaN(amount)) return '0.00'
      return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    resolveRoutePath(candidates) {
      for (let i = 0; i < candidates.length; i++) {
        const resolved = this.$router.resolve({ path: candidates[i] })
        if (resolved && resolved.resolved && resolved.resolved.matched && resolved.resolved.matched.length > 0) {
          return candidates[i]
        }
      }
      return candidates[0]
    },
    goOrderList(status) {
      const path = this.resolveRoutePath(['/orderManage/pigOrder', '/pig/pigOrder'])
      const query = status ? { orderStatus: status } : {}
      this.$router.push({ path, query })
    },
    goBidProductList(status) {
      const path = this.resolveRoutePath(['/bidding/bidProduct', '/pig/bidProduct'])
      const query = status ? { bidStatus: status } : {}
      this.$router.push({ path, query })
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-home {
  background: #f5f7fb;
  min-height: calc(100vh - 84px);

  .mb16 {
    margin-bottom: 16px;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h2 {
      margin: 0;
      font-size: 24px;
      color: #1f2d3d;
    }

    p {
      margin: 6px 0 0;
      color: #8492a6;
      font-size: 13px;
    }
  }

  .kpi-card {
    border-radius: 14px;
    padding: 16px;
    color: #fff;
    margin-bottom: 12px;
    box-shadow: 0 10px 24px rgba(35, 45, 65, 0.12);

    .kpi-title {
      font-size: 13px;
      opacity: 0.9;
    }

    .kpi-value {
      margin-top: 8px;
      font-size: 30px;
      font-weight: 700;
      line-height: 1.2;
    }

    .kpi-desc {
      margin-top: 8px;
      font-size: 12px;
      opacity: 0.9;
    }

    .clickable {
      cursor: pointer;
      text-decoration: underline;
      text-decoration-style: dashed;
    }
  }

  .amount-card { background: linear-gradient(135deg, #f97316, #fb923c); }
  .income-card { background: linear-gradient(135deg, #10b981, #34d399); }
  .order-card { background: linear-gradient(135deg, #3b82f6, #60a5fa); cursor: pointer; }
  .today-card { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }

  .panel-card {
    border-radius: 14px;
    border: 1px solid #edf2f7;

    .panel-header {
      font-size: 15px;
      font-weight: 600;
      color: #1f2d3d;
    }
  }

  .status-card {
    background: #f8fafc;
    border: 1px solid #e8eef7;
    border-radius: 10px;
    padding: 14px 10px;
    margin-bottom: 12px;
    text-align: center;
    cursor: pointer;
    transition: all .2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(58, 76, 102, 0.12);
      border-color: #cdd9ef;
    }

    .status-label {
      color: #6b7280;
      font-size: 12px;
    }

    .status-value {
      margin-top: 8px;
      color: #1d4ed8;
      font-size: 24px;
      font-weight: 700;
    }
  }

  .bidding-panel {
    .metric-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed #e5e7eb;
      padding: 10px 0;
      color: #4b5563;

      &:last-child {
        border-bottom: none;
      }

      .metric-value {
        color: #2563eb;
        font-weight: 700;
        cursor: pointer;
      }
    }
  }

  .quick-panel {
    .el-button {
      margin-right: 16px;
      padding-left: 0;
      color: #2563eb;
    }
  }
}
</style>
