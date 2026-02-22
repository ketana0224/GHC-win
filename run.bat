@echo off
cd /d %~dp0
if exist "%ProgramFiles%\nodejs\node.exe" (
	"%ProgramFiles%\nodejs\node.exe" app\copilot-chat.mjs
) else (
	npm run chat
)
pause
