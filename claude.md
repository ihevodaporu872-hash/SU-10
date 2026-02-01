# IMPORTANT — Server execution policy (Kazser)

## Язык общения
- Все ответы, комментарии и объяснения пиши на русском языке.

## Allowed (lightweight setup only)
- Edit files
- Search/replace
- Format code
- Git: status/diff/add/commit/push/pull
- Python: create venv and install deps ONLY inside .venv
  - allowed: python -m venv .venv, .venv\Scripts\pip install -r requirements.txt
  - forbidden: global pip installs, running python apps/servers
- Node: install deps ONLY (no running)
  - allowed: npm ci (preferred) or npm install
  - forbidden: npm run dev/start/build/test, any postinstall scripts that start services

## Still forbidden on this server
- Do NOT run applications, dev servers, builds, tests, docker compose up, heavy indexing, long-running processes.

## Workflow
1) Make changes here (server).
2) Commit & push.
3) Pull on local PC and run/test locally.
4) Bring errors/logs back here for fixes.
