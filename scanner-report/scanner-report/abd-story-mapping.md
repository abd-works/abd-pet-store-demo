# Scanner Report — abd-story-mapping  

**Workspace:** c:\dev\abd-pet-store-demo  
**Date:** 2026-05-09 16:03:16  

---  

## Scanner Execution Status  

### 🟨 Overall Status: GOOD - Minor Issues  

| Status | Count | Description |  
|--------|-------|-------------|  
| 🟩 Executed Successfully | 5 | Scanners ran without errors |  
| 🟩 Clean Rules | 3 | No violations found |  
| 🟥 Rules with Errors | 2 | Found 12 error violation(s) |  

**Total Rules:** 5  
- **Rules with Scanners:** 5  
  - 🟩 **Executed Successfully:** 5  

---  

### Scanner Results  

| Status | Rule | Violations |  
|--------|------|------------|  
| 🟥 ERRORS | Small-And-Testable | 11 |  
| 🟥 ERRORS | Active-Business-And-Behavioral-Language | 1 |  
| 🟩 CLEAN | Outcome-Oriented-Language | 0 |  
| 🟩 CLEAN | Scale-Story-Map-By-Domain | 0 |  
| 🟩 CLEAN | Verb-Noun-Format | 0 |  

---  

## Violations  

### 🟥 Small-And-Testable — 11 violation(s)  

| # | Location | Message | Severity |  
|---|----------|---------|----------|  
| 1 | `Set Follow-Up Action` | Story "Set Follow-Up Action" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  
| 2 | `View Store Map` | Story "View Store Map" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  
| 3 | `View Store List` | Story "View Store List" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  
| 4 | `Calculate Distance to Store` | Story "Calculate Distance to Store" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  
| 5 | `Set My Store Preference` | Story "Set My Store Preference" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  
| 6 | `Save Delivery Address` | Story "Save Delivery Address" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  
| 7 | `Save Payment Method` | Story "Save Payment Method" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  
| 8 | `Create Pet Profile` | Story "Create Pet Profile" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  
| 9 | `Set Communication Preferences` | Story "Set Communication Preferences" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  
| 10 | `Generate Return Label or QR Code` | Story "Generate Return Label or QR Code" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  
| 11 | `Set Notification Preferences` | Story "Set Notification Preferences" appears to be an implementation operation — should be a step within a story that describes user/system outcome | error |  

### 🟥 Active-Business-And-Behavioral-Language — 1 violation(s)  

| # | Location | Message | Severity |  
|---|----------|---------|----------|  
| 1 | `epics[5].sub_epics[2].name` | Sub_epic name "Process Payment" uses capability noun - use active behavioral language (e.g., "Processes Payments" not "Payment Processing") | error |  
