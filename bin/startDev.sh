#!/usr/bin/env bash
# 获取项目根目录的绝对路径
baseDir="$(cd `dirname $0`;cd ../;pwd)"
export NODE_ENV="development"
export PORT=3001

# 启动 node 服务
npm run dev


