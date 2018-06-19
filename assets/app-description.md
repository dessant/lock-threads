A GitHub App that locks closed issues and pull requests after a period of inactivity.

![](https://raw.githubusercontent.com/dessant/lock-threads/master/assets/screenshot.png)

## Usage

1. **[Install the GitHub App](https://github.com/apps/lock)** for the required repositories
2. Create `.github/lock.yml` based on the template below
3. It will start scanning for closed issues and/or pull requests within an hour

#### Configuration

Create `.github/lock.yml` in the default branch to enable the app. The file can be empty, or it can override any of these default settings:

```yaml
# Configuration for lock-threads - https://github.com/dessant/lock-threads

# Number of days of inactivity before a closed issue or pull request is locked
daysUntilLock: 365

# Issues and pull requests with these labels will not be locked. Set to `[]` to disable
exemptLabels: []

# Label to add before locking, such as `outdated`. Set to `false` to disable
lockLabel: false

# Comment to post before locking. Set to `false` to disable
lockComment: >
  This thread has been automatically locked since there has not been
  any recent activity after it was closed. Please open a new issue for
  related bugs.

# Limit to only `issues` or `pulls`
# only: issues

# Optionally, specify configuration settings just for `issues` or `pulls`
# issues:
#   exemptLabels:
#     - help-wanted
#   lockLabel: outdated

# pulls:
#   daysUntilLock: 30
```

## Supporting the Project

The continued development of Lock Threads is made possible thanks to the support of awesome backers. If you'd like to join them, please consider contributing with [Patreon](https://goo.gl/qRhKSW), [PayPal](https://goo.gl/5FnBaw) or [Bitcoin](https://goo.gl/uJUAaU).
