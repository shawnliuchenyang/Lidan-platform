#!/bin/bash
set -e

echo '合并分支'
echo ${CI_COMMIT_REF_NAME}

echo '******安装依赖包*******'
npm run i

echo '******开始编译*******'
npm run build

echo '******编译成功*******'
git status

echo '开始clone远程 online-branch 分支...'
git clone -b online-branch git@git.xiaojukeji.com:kf-fe/saving-card.git online-branch

echo '删除online-branch文件夹下的所有文件...'
rm -rf online-branch/*

echo '开始拷贝dist文件夹和build.sh文件到online-branch目录下...'
cp -R dist online-branch && cp build.sh online-branch

echo '进入online-branch目录'
cd online-branch
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
