@echo off
E:
cd E:\HEXO\shanlancoding.github.io
hexo g -d && mshta vbscript:msgbox("������ɣ�׼��pushԴ���򵽲ֿ�",6,"�������")(window.close) && color 4 && call pushGitHub-TopLink.cmd
