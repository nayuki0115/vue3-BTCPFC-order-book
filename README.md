# vue3-BTCPFC-order-book

![image](https://img.shields.io/badge/node-v22.13.1-green.svg) 
![image](https://img.shields.io/badge/vue-v3.5.13-brightgreen.svg)   
![image](https://img.shields.io/badge/typescript-blue.svg) ![image](https://img.shields.io/badge/pnpm-985F2A.svg) 

使用 Vue3 製作的 Order Book，顯示 `BTCPFC` 8 檔買入和賣出的報價

## 功能說明
[原始題目說明在此](https://serious-lynx-a67.notion.site/Order-Book-38158d30a1f8415f9823f2c7d7e5d5a1)

### 需求說明
- 框架
  - React 或 Vue.js
- 顯示`BTCPFC`報價
  - 買單與賣單各最多顯示 8 筆報價
  - 報價行需垂直置中對齊
- 數字格式
  - 數字需使用逗號作為千位分隔符
- 滑鼠懸停效果
  - 當滑鼠懸停在報價行上時，整行背景顏色需改變
- 最新價格顏色樣式
  - 若當前最新價格 > 前次最新價格：
    - 文字顏色：`#00b15d`
    - 背景顏色：`rgba(16, 186, 104, 0.12)`
  - 若當前最新價格 < 前次最新價格：
    - 文字顏色：`#FF5B5A`
    - 背景顏色：`rgba(255, 90, 90, 0.12)`
  - 若價格相同：
    - 文字顏色：`#F0F4F8`
    - 背景顏色：`rgba(134, 152, 170, 0.12)`
- 報價總數公式
  - 賣單：從最低價格報價到最高價格報價的報價數量總和。
  - 買單：從最高價格報價到最低價格報價的報價數量總和。
- 累積總數百分比條公式
  - 當前報價累積總數 / 買單或賣單的報價總數。
- 報價 highlight 動畫
  - 當新報價出現（價格之前未在訂單簿中顯示）：
    - 整行報價添加 highlight 動畫
    - 賣單使用紅色背景，買單使用綠色背景
  - 當報價數量改變
    - 數量單元格添加 highlight 動畫。
    - 數量增加時使用綠色背景，數量減少時使用紅色背景

### API 說明
#### 訂單簿 WebSocket API
- 端點：`wss://ws.btse.com/ws/oss/futures`
- 主題：`update:BTCPFC`
- API 文件：[OrderBook Incremental Updates](https://btsecom.github.io/docs/futures/en/#orderbook-incremental-updates)
- 說明
  - 首次回應為當前訂單簿快照（`type` 欄位值為 `snapshot`），返回 50 個層級
  - 後續更新為增量數據（`type` 為 `delta`）。
  - 注意：若新數據的 `prevSeqNum` 與前次數據的 `seqNum` 不符，需重新訂閱主題以獲取新快照

####  最新價格 WebSocket API
- 端點：`wss://ws.btse.com/ws/futures`
- 主題：`tradeHistoryApi:BTCPFC`
- API 文件：[Public Trade Fills](https://btsecom.github.io/docs/futures/en/#public-trade-fills)
- 說明：使用陣列中的第一個價格作為最新價格

### 樣式 說明
- 背景顏色：`#131B29`
- 預設文字顏色：`#F0F4F8`
- 報價表頭文字顏色：`#8698aa`
- 買單報價價格文字顏色：`#00b15d`
- 賣單報價價格文字顏色：`#FF5B5A`
- 報價行懸停背景顏色：`#1E3059`
- 買單累積總數百分比條顏色：`rgba(16, 186, 104, 0.12)`
- 賣單累積總數百分比條顏色：`rgba(255, 90, 90, 0.12)`
- 動畫閃爍綠色背景顏色：`rgba(0, 177, 93, 0.5)`
- 動畫閃爍紅色背景顏色：`rgba(255, 91, 90, 0.5)`

## 使用技術
![image](https://img.shields.io/badge/vue-v3.5.13-brightgreen.svg) ![image](https://img.shields.io/badge/typescript-blue.svg)  

## 安裝和運行說明
![image](https://img.shields.io/badge/node-v22.13.1-green.svg) ![image](https://img.shields.io/badge/pnpm-985F2A.svg) 
```bash
git clone <repository-url>
cd <project-name>
pnpm install
pnpm run dev
```

## 專案結構
```tree
vue3-BTCPFC-order-book/
├── src/
│   ├── apis/            # API 相關
│   ├── components/      # 共用元件
│   ├── composables/     # Vue3 組合式函數
│   ├── router/          # 路由設定
│   ├── types/           # TypeScript 型別定義
│   ├── views/           # 頁面元件
│   ├── App.vue          # 根元件
│   └── main.ts          # 應用入口
├── public/              # 公共資源
├── index.html           # HTML 模板
├── package.json         # 套件設定
├── tsconfig.json        # TypeScript 設定
└── vite.config.ts       # Vite 設定
```