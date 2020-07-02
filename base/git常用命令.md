git status  查看本地版本库的状态

git pull 更新远程库内容到本地库，并且尝试与本地库自动合并，如果有冲突，则需要手动解决冲突

git add fileName|directoryName 将文件或目录添加到暂存区 ，待commit

git commit -m “JIRA id your message” 提交到本地版本库，注意格式为JIRA ID 加提交备注信息；（在一个功能开发周期中，可以多次commit，最后一次性push，每次commit都会形成一个记录）

git push -u origin branchName 本地版本库当前分支推送到远程库的branchName分支 

git checkout -- ./**/fileName 将还没有commit的文件，恢复成git commit 或 git add之前的状态， 优先恢复到git commit的状态

git reset --hard d3749e196c06 将commit或push过的代码库，恢复成提交记录sha码是。。。。。的那个状态， （命令慎用）

git checkout branchName 切换到branchName这个分支上，切换之前的修改，如果没有git commit ，会丢失，使用 git checkout -m branchName 会尝试把之前分支内容合并到即将切换的分支


合并分支到主干
	
git checkout dev
git merge <branchName>

git 在pull或者合并分支的时候有时会遇到这个界面,意思是需要你 输入提交消息来解释为什么这种合并是必要的

两种解决方式';

第一：


1.按键盘字母 i 进入insert模式

2.修改最上面那行黄色合并信息

第二：

1.按键盘左上角"Esc"

2.输入冒号加wq   ":wq",  按回车键，意思就是就是忽略这个提
--------------------- 

commit 提交信息修改

git push 