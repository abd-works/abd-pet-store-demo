# Scanner Report — abd-specification-by-example  

**Workspace:** c:\dev\abd-pet-store-demo  
**Date:** 2026-05-09 16:08:22  

---  

## Scanner Execution Status  

### 🟩 Overall Status: HEALTHY  

| Status | Count | Description |  
|--------|-------|-------------|  
| 🟩 Executed Successfully | 1 | Scanners ran without errors |  
| 🟨 Rules with Warnings | 1 | Found 6 warning violation(s) |  

**Total Rules:** 1  
- **Rules with Scanners:** 1  
  - 🟩 **Executed Successfully:** 1  

---  

### Scanner Results  

| Status | Rule | Violations |  
|--------|------|------------|  
| 🟨 WARNINGS | Emphasize-Domain-Terms-Scenario | 6 |  

---  

## Violations  

### 🟨 Emphasize-Domain-Terms-Scenario — 6 violation(s)  

| # | Location | Message | Severity |  
|---|----------|---------|----------|  
| 1 | `epics[0].sub_epics[1].story_groups[0].stories[0].scenarios[0].steps` | Story "View Product Details" scenario 1 ('Weight and dimensions shown where relevant'): italic spans cover a large share of the text (~26/52 words); risk of over-emphasis — mark domain terms only. | warning |  
| 2 | `epics[5].sub_epics[0].story_groups[0].stories[0].scenarios[2].steps` | Story "Add Product to Cart" scenario 3 ('Product added to cart updates quantity and badge'): many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms in scenarios). | warning |  
| 3 | `epics[5].sub_epics[0].story_groups[0].stories[1].scenarios[2].steps` | Story "Update Cart Quantity" scenario 3 ('Quantity change recalculates line price and subtotal'): many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms in scenarios). | warning |  
| 4 | `epics[5].sub_epics[2].story_groups[0].stories[0].scenarios[1].steps` | Story "Select Payment Method" scenario 2 ('Card details validated before payment'): many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms in scenarios). | warning |  
| 5 | `epics[5].sub_epics[2].story_groups[0].stories[2].scenarios[1].steps` | Story "Process Card Payment via StripeWave" scenario 2 ('Card declined shows decline reason and retry'): italic span is long (13 words); prefer shorter domain phrases, not whole sentences. | warning |  
| 6 | `epics[5].sub_epics[3].story_groups[0].stories[3].scenarios[2].steps` | Story "Track Order Status" scenario 3 ('Order lookup by number and email'): many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms in scenarios). | warning |  
