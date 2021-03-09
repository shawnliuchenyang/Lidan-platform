#!/bin/bash
source ~/.nvm/nvm.sh
nvm use v10.16.0
set -e  #Exit the script if an error happens
set -x  #执行指令后,会显示该指令及参数,可加可不加该行
pid=$$ #当前Shell进程ID。对于 Shell 脚本，就是这些脚本所在的进程ID.

function log() {
  echo "====== $1 ======"
}
# 安装编译
function make_compile() {
    log 'step1.安装依赖包'
    local start_time=`date +%s`
    npm i 
    ret=$?
    if [ $ret -ne 0 ];then
        log "npm install failure"
        exit $ret
    else
        log "npm install successfully!"
    fi
    local end_time=`date +%s`
    log "安装依赖包耗时 `expr $end_time - $start_time` s."


    log 'step2.开始编译'
    local start_time=`date +%s`
    if [ "$env" == "pro" ];then
      npm run build
    elif [ "$env" == "pre" ];then
      npm run build
    else
      npm run build
    fi

    ret=$?
    if [ $ret -ne 0 ];then
        log "npm build failure"
        exit $ret
    else
        log "npm build successfully!"
    fi
    local end_time=`date +%s`
    log "编译耗时 `expr $end_time - $start_time` s."
}

# 生成输出包
function make_output() {
    log 'step3.创建输出包'
    local start_time=`date +%s`
    # 创建临时目录
    local tmp_output="/data/wwwroot/mcpopeye.com/platform"
    cp -rf ./dist/* ${tmp_output}/ &&


    log "创建输出包耗时 `expr $end_time - $start_time` s."
}

##########################################
## main
## 其中,
##
##      1.生成部署包output
##########################################
# 1.生成部署包output

log "编译环境："
echo "node version `node -v`"
echo "npm version `npm -v`"
echo "env $env"

all_start_time=`date +%s` # 整体开始时间

make_compile
make_output

all_end_time=`date +%s`
log "总共耗时 `expr $all_end_time - $all_start_time` s."

# 编译成功
echo -e "build done"
exit 0
