#!/bin/sh
# Call `source ./scripts/export_env.sh` to execute

# 输出环境变量
export $(grep -v '^#' ./local.keys | sed 's/#.*//')
# GITHUB_API_TOKEN base64
export MATCH_GIT_BASIC_AUTHORIZATION=$(echo -n ChenWeiXin:$GITHUB_API_TOKEN | base64)
