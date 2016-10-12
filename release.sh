#/bin/bash
if [ "$#" -ge 1 ]; then
	source_branch=$1
else
	source_branch="master"
fi

release_branch="gh-pages"
initial_branch=`git rev-parse --abbrev-ref HEAD`

echo "Current branch: $initial_branch"

echo "Switching to branch $release_branch"
git checkout -B gh-pages

echo "Rebasing $source_branch into $release_branch"
git rebase master

echo "Pushing release to remote"
git push origin gh-pages

echo "Switching back to branch $initial_branch"
git checkout $initial_branch
