<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?logo=springboot" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk" alt="Java">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TS">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PG">
  <img src="https://img.shields.io/badge/Docker-🐳-2496ED?logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

<h1 align="center">📸 ShotLink 摄链</h1>
<p align="center"><strong>摄影师综合服务平台 — 作品展示 · 在线预约 · 社区交流 · CRM 管理</strong></p>

---

## 🎯 项目简介

ShotLink 是一个全栈摄影师服务平台，连接**客户**与**摄影师**，覆盖从作品展示、在线预约、社区交流到合同发票、照片交付的完整业务闭环。

| 角色 | 功能 |
|------|------|
| 🧑 客户 | 浏览作品、筛选摄影师、发起预约、支付评价 |
| 📸 摄影师 | 展示作品集、管理档期、处理预约、CRM工具、合同发票、照片交付 |
| 🛡️ 管理员 | 摄影师审核、用户管理、内容管理、数据统计 |

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────┐
│       React 18 + TypeScript + Vite      │  前端
│    Ant Design · Zustand · Axios         │  Port 5173
└──────────────┬──────────────────────────┘
               │ REST API / SSE
┌──────────────▼──────────────────────────┐
│      Spring Boot 3.3 + Java 17          │  后端
│  Spring Security · JPA · Flyway         │  Port 9090
└──────┬───────┬────────┬────────┬────────┘
       │       │        │        │
  PostgreSQL  Redis  RabbitMQ  MinIO   基础设施
    :5432     :6379    :5672    :9000   (Docker)
```

### 核心设计
- **分层架构**: Controller → Service → Repository，职责清晰
- **无状态认证**: JWT Access Token (15min) + Refresh Token (7day) + Token 黑名单
- **双角色 RBAC**: CLIENT / PHOTOGRAPHER / ADMIN，Spring Security 方法级权限
- **异步处理**: RabbitMQ 消息队列处理文档/图片/通知
- **对象存储**: MinIO (S3 兼容) 存储用户上传的图片和文件
- **数据库迁移**: Flyway 管理 9 张表的版本化迁移

---

## 📊 数据库设计

| 表 | 用途 |
|----|------|
| `users` | 用户基础信息 + 角色 |
| `photographer_profiles` | 摄影师资料（风格、价格、服务区域） |
| `portfolios` + `portfolio_images` | 作品集 + 图片 |
| `bookings` + `photographer_schedules` | 预约 + 档期 |
| `community_posts` + `community_comments` | 社区帖子 + 评论 |
| `contracts` · `invoices` · `photo_deliveries` | CRM 业务工具 |
| `reviews` · `notifications` · `likes_favorites` · `refresh_tokens` | 评价 · 通知 · 点赞 · Token |

---

## 🚀 快速启动

### 前提
```bash
Docker Desktop  (运行中)
JDK 17          (C:\Program Files\Amazon Corretto\jdk17.0.19_10)
Node.js 20+     (pnpm 9+)
```

### 1. 启动基础设施
```bash
docker compose up -d
# PostgreSQL · Redis · RabbitMQ · MinIO
```

### 2. 启动后端
```bash
cd backend
set JAVA_HOME=C:\Program Files\Amazon Corretto\jdk17.0.19_10
mvnw.cmd spring-boot:run
# → http://localhost:9090
```

### 3. 启动前端
```bash
cd frontend
pnpm dev
# → http://localhost:5173
```

### 一键检测
```bash
check.bat    # 双击运行，自动检测所有服务状态
```

---

## 📡 API 概览

```
Base URL: /api/v1

POST   /auth/register         # 注册（选择角色）
POST   /auth/login            # 登录（返回 JWT）

GET    /photographers         # 摄影师搜索（地区/风格/价格/评分）
POST   /portfolios            # 创建作品集 [PHOTOGRAPHER]
POST   /portfolios/{id}/images # 上传作品图片
GET    /portfolios            # 作品广场（瀑布流）

POST   /bookings              # 发起预约
PUT    /bookings/{id}/status  # 确认/拒绝/完成 [PHOTOGRAPHER]
GET    /schedules/{id}        # 查询摄影师档期

GET    /posts                 # 社区帖子列表
POST   /posts/{id}/comments   # 发表评论
POST   /likes                 # 点赞

POST   /crm/contracts         # 创建合同 [PHOTOGRAPHER]
POST   /crm/invoices          # 开发票 [PHOTOGRAPHER]
POST   /reviews               # 评价摄影师
GET    /notifications         # 通知中心

GET    /admin/dashboard       # 管理后台 [ADMIN]
```

---

## 📁 项目结构

```
shotlink/
├── backend/                          Spring Boot
│   ├── src/main/java/com/shotlink/
│   │   ├── config/         Security · MinIO · Jackson
│   │   ├── controller/     9 个 Controller
│   │   ├── service/        6 个 Service
│   │   ├── repository/     8 个 Repository
│   │   ├── model/entity/   12 个 JPA Entity
│   │   ├── security/       JWT Provider · Filter
│   │   └── exception/      Global Exception Handler
│   ├── src/main/resources/db/migration/   9 个 Flyway SQL
│   └── Dockerfile
│
├── frontend/                         React + TypeScript
│   ├── src/
│   │   ├── pages/         15+ 页面组件
│   │   ├── api/           6 个 API 模块
│   │   ├── stores/        Zustand 状态管理
│   │   ├── layouts/       主布局（毛玻璃导航）
│   │   └── components/    粒子背景
│   ├── Dockerfile · nginx.conf
│   └── vite.config.ts
│
├── docker-compose.yml              开发环境
├── docker-compose.prod.yml         生产环境
├── .github/workflows/ci.yml        CI/CD 流水线
└── check.bat                       一键服务检测
```

---

## ✨ 亮点功能

- 🔮 **粒子背景** Canvas 动画 + 鼠标交互，120 粒子实时连线
- 🎨 **毛玻璃导航** backdrop-filter 模糊 + 动态按钮光泽
- 📐 **Bento Grid** 布局，6 列网格完美填满
- 🖼️ **Unsplash 真实摄影作品** 占位展示
- 🏷️ **无限滚动标签** 底部摄影分类跑马灯
- 🌊 **渐变动画文字** 彩虹色流动效果

---

## 🧪 技术统计

| 指标 | 数量 |
|------|------|
| Java 文件 | 55+ |
| TypeScript 文件 | 25+ |
| 数据库表 | 13 |
| API 端点 | 30+ |
| 页面组件 | 15+ |
| Docker 镜像 | 5 |

---

## 📝 License

MIT — 自由使用、修改、分发

---

<p align="center">
  <strong>Built with ❤️ as a full-stack portfolio project</strong>
</p>
