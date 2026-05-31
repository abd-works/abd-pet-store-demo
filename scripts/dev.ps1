# Starts API (3001) + React client (3000) in one terminal.
# Open http://localhost:3000 once both show "running at".

$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
npm run dev
