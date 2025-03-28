#!/bin/bash
DEFAULT_JVM_OPTS=""
APP_HOME="$(cd "$(dirname "$0")" && pwd)"
JAVA_OPTS="-Xmx64m"
exec "$APP_HOME/gradle/wrapper/gradle-wrapper.jar" "$@"
