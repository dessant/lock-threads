A GitHub App that locks closed issues and pull requests.

![](https://raw.githubusercontent.com/dessant/lock-threads/master/assets/screenshot.png)

## Usage

1. **[Install the GitHub App](https://github.com/apps/lock)**
2. Create `.github/lock.yml` based on the template below
3. It will start scanning for closed issues and/or pull requests within an hour

#### Configuration

Create `.github/lock.yml` in the default branch to enable the app.
The file can be empty, or it can override any of these default settings:

```yml
# Configuration for lock-threads - https://github.com/dessant/lock-threads

# Number of days of inactivity before a closed issue or pull request is locked
daysUntilLock: 365
# Comment to post before locking. Set to `false` to disable
lockComment: >
  This thread has been automatically locked because it has not had recent
  activity. Please open a new issue for related bugs and link to relevant
  comments in this thread.
# Limit to only `issues` or `pulls`
# only: issues
```
