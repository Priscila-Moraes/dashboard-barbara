# Dashboard Barbara — Ascensão 2026

Dashboard de métricas Meta Ads → WhatsApp Leads.

## 🚀 Deploy

```bash
# 1. Instalar
npm install

# 2. Dev local
npm run dev

# 3. Build
npm run build
```

### Vercel
1. Suba para um repositório GitHub
2. Importe na Vercel → Deploy

## 📊 Estrutura

```
src/
├── components/
│   ├── DatePicker.tsx      # Seletor de período (presets + calendário)
│   ├── MetricCard.tsx      # Cards de métricas
│   ├── DailyChart.tsx      # Gráfico evolução (8 métricas)
│   ├── DailyTable.tsx      # Tabela dia-a-dia
│   └── CreativesTable.tsx  # Tabela de criativos (agregada + sort + links IG)
├── lib/
│   ├── supabase.ts         # Client + fetch daily_summary & ad_creatives
│   └── utils.ts            # Formatadores (R$, %, números)
├── App.tsx
├── main.tsx
└── index.css
```

## 🔗 Supabase

- **URL:** `https://lwskyzalynytxtwebbue.supabase.co`
- **Tabelas:** `daily_summary`, `ad_creatives`
- **Filtro:** `product_name = 'barbara-ascensao2026-whatsapp'`

## 📈 Métricas

| # | Métrica | Campo |
|---|---------|-------|
| 💰 | Investimento | total_spend |
| 💬 | Conversas | total_leads |
| 💵 | Custo/Conversa | cpl |
| 📊 | CPM | cpm |
| 🔗 | CTR | ctr |
| 👥 | Alcance | ~65% impressões |
| 👁 | Impressões | total_impressions |
| 🖱 | Cliques no Link | total_link_clicks |
| 💲 | CPC Link | cpa |

## 🎨 Campanhas

- `PM_ASCENSAO2026_LEAD_WHATSAPP_PF_AUTO_CBO`
- `[Leads] [WhatsApp] [F] - Ascensão 2026`
