@echo off
::call "D:\GitHub_Pages\Hexo-git\shanlancoding.github.io\pushGitHub.cmd"
D:
cd D:\GitHub_Pages\Hexo-git\shanlancoding.github.io
hexo g -d && mshta vbscript:msgbox("部署完成，准备push源程序到仓库",6,"部署完成")(window.close) && color 4 && call pushGitHub-Hasee.cmd

