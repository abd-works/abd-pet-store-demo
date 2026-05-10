# Starts the API server (port 3001) and React frontend (port 3000) in separate windows.
# Open http://localhost:3000 after both windows show "running at".

$root = Split-Path $PSScriptRoot -Parent

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; node --import tsx/esm packages/app-server/dev.ts" -WindowStyle Normal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; node --import tsx/esm packages/app-client/dev.ts" -WindowStyle Normal

Write-Host "Starting servers - open http://localhost:3000 once both windows show 'running at'"
