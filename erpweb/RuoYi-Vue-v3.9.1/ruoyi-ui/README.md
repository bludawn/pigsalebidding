## 开发

```bash
# 克隆项目
git clone https://gitee.com/y_project/RuoYi-Vue

# 进入项目目录
cd ruoyi-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

### `src` 文件说明
- **`src/main.js`**: 前端应用入口。
- **`src/App.vue`**: 根组件。
- **`src/permission.js`**: 路由权限守卫与鉴权逻辑。
- **`src/settings.js`**: 系统 UI 配置。

## `src/api`
- **`src/api/login.js`**: 登录相关接口封装。
- **`src/api/menu.js`**: 菜单与路由接口封装。
- **`src/api/monitor/cache.js`**: 缓存监控接口封装。
- **`src/api/monitor/job.js`**: 定时任务接口封装。
- **`src/api/monitor/jobLog.js`**: 任务日志接口封装。
- **`src/api/monitor/logininfor.js`**: 登录日志接口封装。
- **`src/api/monitor/online.js`**: 在线用户接口封装。
- **`src/api/monitor/operlog.js`**: 操作日志接口封装。
- **`src/api/monitor/server.js`**: 服务器信息接口封装。
- **`src/api/pig/address.js`**: 地址管理接口封装。
- **`src/api/pig/bidProduct.js`**: 竞价商品接口封装。
- **`src/api/pig/businessMessage.js`**: 业务消息接口封装。
- **`src/api/pig/deliveryInfo.js`**: 送货信息接口封装。
- **`src/api/pig/enterprise.js`**: 企业接口封装。
- **`src/api/pig/enterpriseGroup.js`**: 企业分组接口封装。
- **`src/api/pig/pigOrder.js`**: 生猪订单接口封装。
- **`src/api/pig/pigResource.js`**: 生猪资源接口封装。
- **`src/api/pig/pigTag.js`**: 生猪标签接口封装。
- **`src/api/pig/pigType.js`**: 生猪类型接口封装。
- **`src/api/pig/site.js`**: 场地信息接口封装。
- **`src/api/pig/userBid.js`**: 用户出价接口封装。
- **`src/api/pig/userBidInfo.js`**: 用户出价详情接口封装。
- **`src/api/pig/userExt.js`**: 用户扩展信息接口封装。
- **`src/api/system/config.js`**: 系统配置接口封装。
- **`src/api/system/dept.js`**: 部门管理接口封装。
- **`src/api/system/menu.js`**: 菜单管理接口封装。
- **`src/api/system/notice.js`**: 通知公告接口封装。
- **`src/api/system/post.js`**: 岗位管理接口封装。
- **`src/api/system/role.js`**: 角色管理接口封装。
- **`src/api/system/user.js`**: 用户管理接口封装。
- **`src/api/system/dict/data.js`**: 字典数据接口封装。
- **`src/api/system/dict/type.js`**: 字典类型接口封装。
- **`src/api/tool/gen.js`**: 代码生成接口封装。

## `src/components`
- **`src/components/Breadcrumb/index.vue`**: 面包屑组件。
- **`src/components/Crontab/day.vue`**: Cron 日选择组件。
- **`src/components/Crontab/hour.vue`**: Cron 时选择组件。
- **`src/components/Crontab/index.vue`**: Cron 组合组件。
- **`src/components/Crontab/min.vue`**: Cron 分选择组件。
- **`src/components/Crontab/month.vue`**: Cron 月选择组件。
- **`src/components/Crontab/result.vue`**: Cron 结果展示组件。
- **`src/components/Crontab/second.vue`**: Cron 秒选择组件。
- **`src/components/Crontab/week.vue`**: Cron 周选择组件。
- **`src/components/Crontab/year.vue`**: Cron 年选择组件。
- **`src/components/DictData/index.js`**: 字典数据组件注册。
- **`src/components/DictTag/index.vue`**: 字典标签组件。
- **`src/components/Editor/index.vue`**: 富文本编辑器组件。
- **`src/components/FileUpload/index.vue`**: 文件上传组件。
- **`src/components/Hamburger/index.vue`**: 折叠按钮组件。
- **`src/components/HeaderSearch/index.vue`**: 顶部搜索组件。
- **`src/components/IconSelect/index.vue`**: 图标选择组件。
- **`src/components/IconSelect/requireIcons.js`**: 图标引入脚本。
- **`src/components/iFrame/index.vue`**: 内嵌页面组件。
- **`src/components/ImagePreview/index.vue`**: 图片预览组件。
- **`src/components/ImageUpload/index.vue`**: 图片/文件上传组件。
- **`src/components/Pagination/index.vue`**: 分页组件。
- **`src/components/PanThumb/index.vue`**: 头像缩略组件。
- **`src/components/ParentView/index.vue`**: 路由占位组件。
- **`src/components/RightToolbar/index.vue`**: 列表工具栏组件。
- **`src/components/RuoYi/Doc/index.vue`**: 文档入口组件。
- **`src/components/RuoYi/Git/index.vue`**: GitHub 入口组件。
- **`src/components/Screenfull/index.vue`**: 全屏切换组件。
- **`src/components/SizeSelect/index.vue`**: 组件尺寸切换。
- **`src/components/SvgIcon/index.vue`**: SVG 图标组件。
- **`src/components/ThemePicker/index.vue`**: 主题选择组件。
- **`src/components/TopNav/index.vue`**: 顶部导航组件。

## `src/layout`
- **`src/layout/index.vue`**: 布局入口。
- **`src/layout/mixin/ResizeHandler.js`**: 布局尺寸监听。
- **`src/layout/components/AppMain.vue`**: 主内容容器。
- **`src/layout/components/Navbar.vue`**: 顶部导航栏。
- **`src/layout/components/index.js`**: 布局组件注册。
- **`src/layout/components/Copyright/index.vue`**: 页脚版权组件。
- **`src/layout/components/IframeToggle/index.vue`**: 内嵌页面切换组件。
- **`src/layout/components/InnerLink/index.vue`**: 外链容器组件。
- **`src/layout/components/Settings/index.vue`**: 主题与布局设置。
- **`src/layout/components/TopBar/index.vue`**: 顶部条组件。
- **`src/layout/components/Sidebar/index.vue`**: 侧边栏容器。
- **`src/layout/components/Sidebar/Item.vue`**: 侧边栏菜单项。
- **`src/layout/components/Sidebar/Link.vue`**: 侧边栏链接。
- **`src/layout/components/Sidebar/Logo.vue`**: 侧边栏 Logo。
- **`src/layout/components/Sidebar/SidebarItem.vue`**: 侧边栏递归项。
- **`src/layout/components/Sidebar/FixiOSBug.js`**: iOS 侧边栏兼容处理。
- **`src/layout/components/TagsView/index.vue`**: 标签页容器。
- **`src/layout/components/TagsView/ScrollPane.vue`**: 标签页滚动容器。

## `src/router`
- **`src/router/index.js`**: 前端路由配置。

## `src/store`
- **`src/store/index.js`**: Vuex 入口。
- **`src/store/getters.js`**: 全局 getters。
- **`src/store/modules/app.js`**: 应用状态模块。
- **`src/store/modules/dict.js`**: 字典状态模块。
- **`src/store/modules/permission.js`**: 权限状态模块。
- **`src/store/modules/settings.js`**: 设置状态模块。
- **`src/store/modules/tagsView.js`**: 标签页状态模块。
- **`src/store/modules/user.js`**: 用户状态模块。

## `src/utils`
- **`src/utils/auth.js`**: Token 管理。
- **`src/utils/dynamicTitle.js`**: 动态标题设置。
- **`src/utils/errorCode.js`**: 后端错误码映射。
- **`src/utils/index.js`**: 通用工具函数集合。
- **`src/utils/jsencrypt.js`**: RSA 加解密封装。
- **`src/utils/permission.js`**: 权限判断工具。
- **`src/utils/request.js`**: Axios 请求封装。
- **`src/utils/ruoyi.js`**: RuoYi 前端工具。
- **`src/utils/scroll-to.js`**: 滚动工具。
- **`src/utils/validate.js`**: 表单校验工具。
- **`src/utils/dict/Dict.js`**: 字典管理类。
- **`src/utils/dict/DictConverter.js`**: 字典转换器。
- **`src/utils/dict/DictData.js`**: 字典数据模型。
- **`src/utils/dict/DictMeta.js`**: 字典元信息。
- **`src/utils/dict/DictOptions.js`**: 字典选项。
- **`src/utils/dict/index.js`**: 字典工具入口。
- **`src/utils/generator/config.js`**: 代码生成器配置。
- **`src/utils/generator/css.js`**: 生成 CSS 工具。
- **`src/utils/generator/drawingDefault.js`**: 生成器默认绘制配置。
- **`src/utils/generator/html.js`**: 生成 HTML 工具。
- **`src/utils/generator/icon.json`**: 生成器图标配置。
- **`src/utils/generator/js.js`**: 生成 JS 工具。
- **`src/utils/generator/render.js`**: 生成器渲染工具。

## `src/directive`
- **`src/directive/index.js`**: 指令注册入口。
- **`src/directive/dialog/drag.js`**: 弹窗拖拽指令。
- **`src/directive/dialog/dragHeight.js`**: 弹窗高度拖拽指令。
- **`src/directive/dialog/dragWidth.js`**: 弹窗宽度拖拽指令。
- **`src/directive/module/clipboard.js`**: 复制指令。
- **`src/directive/permission/hasPermi.js`**: 权限指令（权限码）。
- **`src/directive/permission/hasRole.js`**: 权限指令（角色）。

## `src/plugins`
- **`src/plugins/auth.js`**: 权限相关插件。
- **`src/plugins/cache.js`**: 页面缓存插件。
- **`src/plugins/download.js`**: 文件下载插件。
- **`src/plugins/index.js`**: 插件入口。
- **`src/plugins/modal.js`**: 弹窗插件。
- **`src/plugins/tab.js`**: 标签页插件。

## `src/views`
- **`src/views/index.vue`**: 默认首页（仪表盘）。
- **`src/views/index_v1.vue`**: 备用首页样式。
- **`src/views/login.vue`**: 登录页。
- **`src/views/register.vue`**: 注册页。
- **`src/views/redirect.vue`**: 路由重定向页。
- **`src/views/error/401.vue`**: 401 页面。
- **`src/views/error/404.vue`**: 404 页面。
- **`src/views/dashboard/BarChart.vue`**: 仪表盘柱状图。
- **`src/views/dashboard/LineChart.vue`**: 仪表盘折线图。
- **`src/views/dashboard/PanelGroup.vue`**: 仪表盘指标卡片。
- **`src/views/dashboard/PieChart.vue`**: 仪表盘饼图。
- **`src/views/dashboard/RaddarChart.vue`**: 仪表盘雷达图。
- **`src/views/dashboard/mixins/resize.js`**: 图表自适应混入。
- **`src/views/monitor/cache/index.vue`**: 缓存监控页。
- **`src/views/monitor/cache/list.vue`**: 缓存明细页。
- **`src/views/monitor/druid/index.vue`**: Druid 监控页。
- **`src/views/monitor/job/index.vue`**: 任务管理页。
- **`src/views/monitor/job/log.vue`**: 任务日志页。
- **`src/views/monitor/logininfor/index.vue`**: 登录日志页。
- **`src/views/monitor/online/index.vue`**: 在线用户页。
- **`src/views/monitor/operlog/index.vue`**: 操作日志页。
- **`src/views/monitor/server/index.vue`**: 服务器监控页。
- **`src/views/pig/address/index.vue`**: 地址管理页。
- **`src/views/pig/bidProduct/index.vue`**: 竞价商品页。
- **`src/views/pig/businessMessage/index.vue`**: 业务消息页。
- **`src/views/pig/deliveryInfo/index.vue`**: 送货信息页。
- **`src/views/pig/enterprise/index.vue`**: 企业信息页。
- **`src/views/pig/enterpriseGroup/index.vue`**: 企业分组页。
- **`src/views/pig/pigOrder/index.vue`**: 生猪订单页。
- **`src/views/pig/pigResource/index.vue`**: 生猪资源页。
- **`src/views/pig/pigTag/index.vue`**: 生猪标签页。
- **`src/views/pig/pigType/index.vue`**: 生猪类型页。
- **`src/views/pig/site/index.vue`**: 场地信息页。
- **`src/views/pig/userBid/index.vue`**: 用户出价页。
- **`src/views/pig/userBidInfo/index.vue`**: 用户出价详情页。
- **`src/views/pig/userExt/index.vue`**: 用户扩展信息页。
- **`src/views/system/config/index.vue`**: 系统配置页。
- **`src/views/system/dept/index.vue`**: 部门管理页。
- **`src/views/system/dict/index.vue`**: 字典类型页。
- **`src/views/system/dict/data.vue`**: 字典数据页。
- **`src/views/system/menu/index.vue`**: 菜单管理页。
- **`src/views/system/notice/index.vue`**: 通知公告页。
- **`src/views/system/post/index.vue`**: 岗位管理页。
- **`src/views/system/role/index.vue`**: 角色管理页。
- **`src/views/system/role/authUser.vue`**: 角色授权用户页。
- **`src/views/system/role/selectUser.vue`**: 角色选择用户页。
- **`src/views/system/user/index.vue`**: 用户管理页。
- **`src/views/system/user/authRole.vue`**: 用户授权角色页。
- **`src/views/system/user/profile/index.vue`**: 个人中心页。
- **`src/views/system/user/profile/resetPwd.vue`**: 修改密码页。
- **`src/views/system/user/profile/userAvatar.vue`**: 头像修改页。
- **`src/views/system/user/profile/userInfo.vue`**: 个人资料页。
- **`src/views/tool/build/index.vue`**: 表单构建页。
- **`src/views/tool/build/CodeTypeDialog.vue`**: 构建器代码类型弹窗。
- **`src/views/tool/build/DraggableItem.vue`**: 构建器拖拽项。
- **`src/views/tool/build/IconsDialog.vue`**: 构建器图标弹窗。
- **`src/views/tool/build/RightPanel.vue`**: 构建器右侧面板。
- **`src/views/tool/build/TreeNodeDialog.vue`**: 构建器树节点弹窗。
- **`src/views/tool/gen/index.vue`**: 代码生成页。
- **`src/views/tool/gen/basicInfoForm.vue`**: 生成基础信息表单。
- **`src/views/tool/gen/createTable.vue`**: 导入表单。
- **`src/views/tool/gen/editTable.vue`**: 编辑表单。
- **`src/views/tool/gen/genInfoForm.vue`**: 生成信息表单。
- **`src/views/tool/gen/importTable.vue`**: 表导入页。
- **`src/views/tool/swagger/index.vue`**: Swagger 文档页。

## `src/assets`
- **`src/assets/pcas-code.json`**: 省市区数据。
- **`src/assets/icons/index.js`**: SVG 图标注册。
- **`src/assets/icons/svgo.yml`**: SVG 压缩配置。
- **`src/assets/icons/svg/404.svg`**: 图标资源。
- **`src/assets/icons/svg/bug.svg`**: 图标资源。
- **`src/assets/icons/svg/build.svg`**: 图标资源。
- **`src/assets/icons/svg/button.svg`**: 图标资源。
- **`src/assets/icons/svg/cascader.svg`**: 图标资源。
- **`src/assets/icons/svg/chart.svg`**: 图标资源。
- **`src/assets/icons/svg/checkbox.svg`**: 图标资源。
- **`src/assets/icons/svg/clipboard.svg`**: 图标资源。
- **`src/assets/icons/svg/code.svg`**: 图标资源。
- **`src/assets/icons/svg/color.svg`**: 图标资源。
- **`src/assets/icons/svg/component.svg`**: 图标资源。
- **`src/assets/icons/svg/dashboard.svg`**: 图标资源。
- **`src/assets/icons/svg/date-range.svg`**: 图标资源。
- **`src/assets/icons/svg/date.svg`**: 图标资源。
- **`src/assets/icons/svg/dict.svg`**: 图标资源。
- **`src/assets/icons/svg/documentation.svg`**: 图标资源。
- **`src/assets/icons/svg/download.svg`**: 图标资源。
- **`src/assets/icons/svg/drag.svg`**: 图标资源。
- **`src/assets/icons/svg/druid.svg`**: 图标资源。
- **`src/assets/icons/svg/edit.svg`**: 图标资源。
- **`src/assets/icons/svg/education.svg`**: 图标资源。
- **`src/assets/icons/svg/email.svg`**: 图标资源。
- **`src/assets/icons/svg/enter.svg`**: 图标资源。
- **`src/assets/icons/svg/example.svg`**: 图标资源。
- **`src/assets/icons/svg/excel.svg`**: 图标资源。
- **`src/assets/icons/svg/exit-fullscreen.svg`**: 图标资源。
- **`src/assets/icons/svg/eye-open.svg`**: 图标资源。
- **`src/assets/icons/svg/eye.svg`**: 图标资源。
- **`src/assets/icons/svg/form.svg`**: 图标资源。
- **`src/assets/icons/svg/fullscreen.svg`**: 图标资源。
- **`src/assets/icons/svg/github.svg`**: 图标资源。
- **`src/assets/icons/svg/guide.svg`**: 图标资源。
- **`src/assets/icons/svg/icon.svg`**: 图标资源。
- **`src/assets/icons/svg/input.svg`**: 图标资源。
- **`src/assets/icons/svg/international.svg`**: 图标资源。
- **`src/assets/icons/svg/job.svg`**: 图标资源。
- **`src/assets/icons/svg/language.svg`**: 图标资源。
- **`src/assets/icons/svg/link.svg`**: 图标资源。
- **`src/assets/icons/svg/list.svg`**: 图标资源。
- **`src/assets/icons/svg/lock.svg`**: 图标资源。
- **`src/assets/icons/svg/log.svg`**: 图标资源。
- **`src/assets/icons/svg/logininfor.svg`**: 图标资源。
- **`src/assets/icons/svg/message.svg`**: 图标资源。
- **`src/assets/icons/svg/money.svg`**: 图标资源。
- **`src/assets/icons/svg/monitor.svg`**: 图标资源。
- **`src/assets/icons/svg/more-up.svg`**: 图标资源。
- **`src/assets/icons/svg/nested.svg`**: 图标资源。
- **`src/assets/icons/svg/number.svg`**: 图标资源。
- **`src/assets/icons/svg/online.svg`**: 图标资源。
- **`src/assets/icons/svg/password.svg`**: 图标资源。
- **`src/assets/icons/svg/pdf.svg`**: 图标资源。
- **`src/assets/icons/svg/people.svg`**: 图标资源。
- **`src/assets/icons/svg/peoples.svg`**: 图标资源。
- **`src/assets/icons/svg/phone.svg`**: 图标资源。
- **`src/assets/icons/svg/post.svg`**: 图标资源。
- **`src/assets/icons/svg/qq.svg`**: 图标资源。
- **`src/assets/icons/svg/question.svg`**: 图标资源。
- **`src/assets/icons/svg/radio.svg`**: 图标资源。
- **`src/assets/icons/svg/rate.svg`**: 图标资源。
- **`src/assets/icons/svg/redis-list.svg`**: 图标资源。
- **`src/assets/icons/svg/redis.svg`**: 图标资源。
- **`src/assets/icons/svg/row.svg`**: 图标资源。
- **`src/assets/icons/svg/search.svg`**: 图标资源。
- **`src/assets/icons/svg/select.svg`**: 图标资源。
- **`src/assets/icons/svg/server.svg`**: 图标资源。
- **`src/assets/icons/svg/shopping.svg`**: 图标资源。
- **`src/assets/icons/svg/size.svg`**: 图标资源。
- **`src/assets/icons/svg/skill.svg`**: 图标资源。
- **`src/assets/icons/svg/slider.svg`**: 图标资源。
- **`src/assets/icons/svg/star.svg`**: 图标资源。
- **`src/assets/icons/svg/swagger.svg`**: 图标资源。
- **`src/assets/icons/svg/switch.svg`**: 图标资源。
- **`src/assets/icons/svg/system.svg`**: 图标资源。
- **`src/assets/icons/svg/tab.svg`**: 图标资源。
- **`src/assets/icons/svg/table.svg`**: 图标资源。
- **`src/assets/icons/svg/textarea.svg`**: 图标资源。
- **`src/assets/icons/svg/theme.svg`**: 图标资源。
- **`src/assets/icons/svg/time-range.svg`**: 图标资源。
- **`src/assets/icons/svg/time.svg`**: 图标资源。
- **`src/assets/icons/svg/tool.svg`**: 图标资源。
- **`src/assets/icons/svg/tree-table.svg`**: 图标资源。
- **`src/assets/icons/svg/tree.svg`**: 图标资源。
- **`src/assets/icons/svg/upload.svg`**: 图标资源。
- **`src/assets/icons/svg/user.svg`**: 图标资源。
- **`src/assets/icons/svg/validCode.svg`**: 图标资源。
- **`src/assets/icons/svg/wechat.svg`**: 图标资源。
- **`src/assets/icons/svg/zip.svg`**: 图标资源。
- **`src/assets/401_images/401.gif`**: 401 页面图片。
- **`src/assets/404_images/404.png`**: 404 页面图片。
- **`src/assets/404_images/404_cloud.png`**: 404 页面云图。
- **`src/assets/images/dark.svg`**: 深色主题图标。
- **`src/assets/images/light.svg`**: 浅色主题图标。
- **`src/assets/images/login-background.jpg`**: 登录背景图。
- **`src/assets/images/pay.png`**: 支付示例图。
- **`src/assets/images/profile.jpg`**: 个人头像示例。
- **`src/assets/logo/logo.png`**: 系统 Logo。
- **`src/assets/styles/btn.scss`**: 按钮样式。
- **`src/assets/styles/element-ui.scss`**: Element UI 覆盖样式。
- **`src/assets/styles/element-variables.scss`**: Element 变量。
- **`src/assets/styles/index.scss`**: 全局样式入口。
- **`src/assets/styles/mixin.scss`**: SCSS mixin。
- **`src/assets/styles/ruoyi.scss`**: RuoYi 主题样式。
- **`src/assets/styles/sidebar.scss`**: 侧边栏样式。
- **`src/assets/styles/transition.scss`**: 动画过渡样式。
- **`src/assets/styles/variables.scss`**: 全局变量。
