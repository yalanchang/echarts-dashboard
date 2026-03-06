# DataPulse Admin Dashboard

> NuxtJS 3 · ECharts 5 · MySQL 8 · Pinia · Tailwind CSS

## 技術棧

| 層       | 技術                              |
|----------|-----------------------------------|
| 前端框架  | Nuxt 3 (Vue 3 + Vite)            |
| 圖表      | ECharts 5                        |
| 樣式      | Tailwind CSS                     |
| 狀態管理  | Pinia                            |
| 後端 API  | Nuxt Server API (Nitro)          |
| 資料庫    | MySQL 8 (mysql2/promise)         |
| 認證      | JWT (jsonwebtoken) + bcryptjs    |


## 專案結構

```
├── assets/css/
│   └── main.css                    # Tailwind + Google Fonts
│
├── components/
│   ├── DataTable.vue               # 通用表格（slot 自訂欄位）
│   ├── EChart.vue                  # ECharts wrapper（RWD + dispose）
│   ├── KpiCard.vue                 # KPI 數字卡片
│   └── StatusBadge.vue             # 訂單狀態 Badge
│
├── composables/
│   ├── useApi.ts                   # 封裝 $fetch，自動帶 JWT
│   └── useChart.ts                 # ECharts init / resize / dispose
│
├── layouts/
│   └── default.vue                 # Admin shell（sidebar + topbar）
│
├── middleware/
│   └── auth.global.ts              # 前端路由守衛，未登入跳到 /login
│
├── pages/
│   ├── login.vue                   # 登入頁
│   ├── index.vue                   # 儀表板
│   ├── charts.vue                  # 數據報表
│   ├── settings.vue                # 系統設定 / 修改密碼
│   ├── orders/
│   │   ├── index.vue               # 訂單列表
│   │   ├── [id].vue                # 訂單詳情
│   │   └── create.vue              # 新增訂單
│   ├── products/
│   │   ├── index.vue               # 商品列表
│   │   ├── [id].vue                # 編輯商品
│   │   └── create.vue              # 新增商品
│   └── users/
│       ├── index.vue               # 用戶列表
│       └── create.vue              # 新增用戶
│
├── server/
│   ├── db/
│   │   └── index.ts                # MySQL2 連線池
│   ├── middleware/
│   │   └── auth.ts                 # 後端 API 路由守衛
│   ├── utils/
│   │   ├── auth.ts                 # JWT helpers
│   │   └── response.ts             # 統一 API 回應格式
│   └── api/
│       ├── auth/
│       │   ├── login.post.ts       # POST /api/auth/login
│       │   ├── logout.post.ts      # POST /api/auth/logout
│       │   └── me.get.ts           # GET  /api/auth/me
│       ├── dashboard/
│       │   └── stats.get.ts        # GET  /api/dashboard/stats
│       ├── charts/
│       │   └── revenue.get.ts      # GET  /api/charts/revenue
│       ├── orders/
│       │   ├── index.get.ts        # GET  /api/orders
│       │   ├── index.post.ts       # POST /api/orders
│       │   ├── [id].get.ts         # GET  /api/orders/:id
│       │   ├── [id].patch.ts       # PATCH /api/orders/:id
│       │   └── export.get.ts       # GET  /api/orders/export
│       ├── products/
│       │   ├── index.get.ts        # GET  /api/products
│       │   ├── index.post.ts       # POST /api/products
│       │   ├── [id].get.ts         # GET  /api/products/:id
│       │   └── [id].patch.ts       # PATCH /api/products/:id
│       ├── users/
│       │   ├── index.get.ts        # GET  /api/users
│       │   ├── index.post.ts       # POST /api/users
│       │   └── [id].delete.ts      # DELETE /api/users/:id
│       ├── categories/
│       │   └── index.get.ts        # GET  /api/categories
│       ├── settings/
│       │   └── password.patch.ts   # PATCH /api/settings/password
│       └── health.get.ts           # GET  /api/health
│
├── stores/
│   └── auth.ts                     # Pinia auth store
│
├── init.sql                        # MySQL 建表 + 初始資料
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## API 一覽

### Auth
| Method | URL                      | 說明     | 需要登入 |
|--------|--------------------------|----------|----------|
| POST   | /api/auth/login          | 登入     | ❌       |
| POST   | /api/auth/logout         | 登出     | ❌       |
| GET    | /api/auth/me             | 取得自己 | ✅       |

### Dashboard
| Method | URL                      | 說明           | 需要登入 |
|--------|--------------------------|----------------|----------|
| GET    | /api/dashboard/stats     | KPI + 圖表數據 | ✅       |

### Orders
| Method | URL                      | 說明         | 需要登入 |
|--------|--------------------------|--------------|----------|
| GET    | /api/orders              | 列表（分頁） | ✅       |
| POST   | /api/orders              | 新增訂單     | ✅       |
| GET    | /api/orders/:id          | 詳情         | ✅       |
| PATCH  | /api/orders/:id          | 更新狀態     | ✅       |
| GET    | /api/orders/export       | 匯出 CSV     | ✅       |

### Products
| Method | URL                      | 說明         | 需要登入 |
|--------|--------------------------|--------------|----------|
| GET    | /api/products            | 列表（分頁） | ✅       |
| POST   | /api/products            | 新增商品     | ✅       |
| GET    | /api/products/:id        | 詳情         | ✅       |
| PATCH  | /api/products/:id        | 更新商品     | ✅       |

### Users
| Method | URL                      | 說明         | 需要登入 | 需要 Admin |
|--------|--------------------------|--------------|----------|------------|
| GET    | /api/users               | 列表（分頁） | ✅       | ✅         |
| POST   | /api/users               | 新增用戶     | ✅       | ✅         |
| DELETE | /api/users/:id           | 停用用戶     | ✅       | ✅         |

### Settings
| Method | URL                        | 說明     | 需要登入 |
|--------|----------------------------|----------|----------|
| PATCH  | /api/settings/password     | 修改密碼 | ✅       |

