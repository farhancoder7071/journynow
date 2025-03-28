@echo off
set DEFAULT_JVM_OPTS=
set APP_HOME=%~dp0
set JAVA_OPTS=-Xmx64m
"%APP_HOME%\gradle\wrapper\gradle-wrapper.jar" %*
