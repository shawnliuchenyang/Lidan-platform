#!/bin/bash
set -e

echo '合并分支'
echo ${CI_COMMIT_REF_NAME}

echo '******切换到pre-master****'
git clone -b pre-master git@git.xiaojukeji.com:kf-fe/saving-card.git pre-master
cd pre-master && npm run i

echo '******开始编译*******'
npm run build

echo '******编译成功*******'
git status

echo '开始clone远程 pre-online-branch 分支...'
git clone -b pre-online-branch git@git.xiaojukeji.com:kf-fe/saving-card.git pre-online-branch

echo '删除pre-online-branch文件夹下的所有文件...'
rm -rf pre-online-branch/*

echo '开始拷贝static文件夹和build.sh文件到pre-online-branch目录下...'
cp -R dist pre-online-branch && cp build.sh pre-online-branch

echo '进入pre-online-branch目录'
cd pre-online-branch
ls -al
echo '>> git status'
git status
echo '>> git add -A .'
git add -A .
echo '>> git commit'
git commit -m "release ${CI_COMMIT_SHA}"
echo '>> git status'
git status
echo '>> git push'
git push

if [ $? == 0 ]; then
    echo 'build success';
fi
