# DataPulse Admin Dashboard
> NuxtJS 3 · ECharts 5 · MySQL 8 · Pinia · Tailwind CSS

## 技術棧

| 層     | 技術                          |
|--------|-------------------------------|
| 前端框架 | Nuxt 3 (Vue 3 + Vite)        |
| 圖表    | ECharts 5 + vue-echarts       |
| 樣式    | Tailwind CSS                  |
| 狀態管理 | Pinia                        |
| 後端 API | Nuxt Server API (Nitro)      |
| 資料庫  | MySQL 8 (mysql2/promise)      |
| 認證    | JWT (jsonwebtoken) + bcryptjs |


```
admin-dashboard/
│
├── server/                     # Nuxt Server API (Nitro)
│   ├── db/
│   │   └── index.ts            # MySQL2 連線池 (getPool / query / queryOne)
│   ├── utils/
│   │   ├── auth.ts             # JWT helpers (signToken / requireAuth / requireAdmin)
│   │   └── response.ts         # 統一 API 回應格式 (ok / paginated / fail)
│   ├── middleware/
│   │   └── auth.ts             # 全域路由守衛 (/api/admin/**)
│   └── api/
│       ├── auth/
│       │   ├── login.post.ts   # POST /api/auth/login
│       │   ├── logout.post.ts  # POST /api/auth/logout
│       │   └── me.get.ts       # GET  /api/auth/me
│       ├── dashboard/
│       │   └── stats.get.ts    # GET  /api/dashboard/stats
│       ├── charts/
│       │   └── revenue.get.ts  # GET  /api/charts/revenue?year=2025
│       ├── orders/
│       │   ├── index.get.ts    # GET  /api/orders?page=1&limit=20&search=&status=
│       │   ├── [id].get.ts     # GET  /api/orders/:id
│       │   └── [id].patch.ts   # PATCH /api/orders/:id
│       ├── users/
│       │   ├── index.get.ts    # GET  /api/users
│       │   ├── index.post.ts   # POST /api/users
│       │   └── [id].delete.ts  # DELETE /api/users/:id
│       └── health.get.ts       # GET  /api/health
│
├── components/
│   ├── EChart.vue              # 可複用 ECharts wrapper (RWD + dispose)
│   ├── KpiCard.vue             # KPI 數字卡片
│   ├── DataTable.vue           # 通用表格 (slot 自訂欄位)
│   └── StatusBadge.vue         # 訂單狀態 Badge
│
├── composables/
│   ├── useApi.ts               # 封裝 $fetch，自動帶 JWT
│   └── useChart.ts             # ECharts init / resize / dispose
│
├── stores/
│   └── auth.ts                 # Pinia auth store (login / logout / hydrate)
│
├── layouts/
│   └── default.vue             # Admin shell (sidebar + topbar)
│
├── pages/
│   ├── index.vue               # 儀表板
│   ├── charts.vue              # 數據報表
│   ├── orders.vue              # 訂單管理
│   ├── users.vue               # 用戶管理
│   └── login.vue               # 登入頁
│
├── assets/css/main.css         # Tailwind + Google Fonts
├── tailwind.config.ts
├── nuxt.config.ts
├── init.sql                    # MySQL 建表 + 初始資料
├── .env.example
└── package.json
```

---

## API 一覽

### Auth
| Method | URL                | 說明       |
|--------|--------------------|------------|
| POST   | /api/auth/login    | 登入       |
| POST   | /api/auth/logout   | 登出       |
| GET    | /api/auth/me       | 取得自己   |

### Dashboard
| Method | URL                    | 說明         |
|--------|------------------------|--------------|
| GET    | /api/dashboard/stats   | KPI + 圖表數據 |

### Orders
| Method | URL               | 說明       |
|--------|-------------------|------------|
| GET    | /api/orders       | 列表 (分頁) |
| GET    | /api/orders/:id   | 詳情       |
| PATCH  | /api/orders/:id   | 更新狀態   |

### Users
| Method | URL               | 說明       |
|--------|-------------------|------------|
| GET    | /api/users        | 列表 (分頁) |
| POST   | /api/users        | 建立用戶   |
| DELETE | /api/users/:id    | 停用用戶   |

### Charts
| Method | URL                      | 說明         |
|--------|--------------------------|--------------|
| GET    | /api/charts/revenue      | 年度圖表數據  |

---
