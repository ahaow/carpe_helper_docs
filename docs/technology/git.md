## 补丁相关

### git patch

```md
<!-- 打补丁 -->

<!-- 1. 查看log 获取commit_id -->

git log

<!-- 2. 创建补丁 -->

git format-patch commit_id -1

<!-- 3. 切换分支, 应用补丁 -->

git apply [patch-nam]
```

## 拉取远程分支到本地

`git fetch origin 远程分支:本地分支名`

## 回退到某个指定的版本

`git reset --hard hash`

## 创建远程分支并提交到远程分支

1. 查看远程分支情况

`git branch -r`

2. 创建一个本地分支

`git checkout -b dev`

3. 建立本地到远端仓库的链接

`git push --set-upstream origin dev` // dev 为创建远程分支的名字

## 删除远程分支 和 本地分支

`删除远程分支: git push origin --delete 分支名称`

`删除本地分支: git branch -D yyjy`

## 根据 tag 创建分支

1. `通过:git branch <new-branch-name> <tag-name> 会根据tag创建新的分支`

2. `通过git checkout newbranch 切换到新的分支`

3. `通过 git push origin newbranch 把本地创建的分支提交到远程仓库`
