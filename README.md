# Lock Threads

Lock Threads is a GitHub App inspired by [Stale](https://github.com/probot/stale)
and built with [Probot](https://github.com/probot/probot)
that locks closed issues and pull requests after a period of inactivity.

![](assets/screenshot.png)

## Supporting the Project

Lock Threads is an MIT-licensed open source project. Its ongoing
development is made possible thanks to the support of awesome backers.
If you'd like to join them, please consider contributing with
[Patreon](https://goo.gl/qRhKSW), [PayPal](https://goo.gl/5FnBaw)
or [Bitcoin](https://goo.gl/uJUAaU).

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
# Issues or pull requests with these labels will not be locked
# exemptLabels:
#   - no-locking
# Limit to only `issues` or `pulls`
# only: issues
# Add a label when locking. Set to `false` to disable
# lockLabel: 'outdated'
```

## How are issues and pull requests determined to be inactive?

The app uses GitHub's [updated](https://git.io/vbR9z) search qualifier
to determine inactivity. Any change to an issue or pull request
is considered an update, including comments, changing labels,
applying or removing milestones, or pushing commits.

An easy way to check and see which issues or pull requests will initially
be locked is to add the `updated` search qualifier to either the issue
or pull request page filter for your repository: `is:closed updated:<2016-12-20`.
Adjust the date to be 365 days ago (or whatever you set for `daysUntilLock`)
to see which issues or pull requests will be locked.

## Why are only some issues and pull requests locked?

To avoid triggering abuse prevention mechanisms on GitHub, only 30 issues
and pull requests will be locked per hour. If your repository has more
than that, it will just take a few hours or days to lock them all.

## Deployment

See [docs/deploy.md](docs/deploy.md) if you would like to run your own
instance of this app.

## License

Lock Threads is released under the terms of the MIT License.
Please refer to the [LICENSE](LICENSE) file.
