# Lock Threads

Lock Threads is a GitHub Action that locks closed issues
and pull requests after a period of inactivity.

<img width="800" src="https://raw.githubusercontent.com/dessant/lock-threads/master/assets/screenshot.png">

## Supporting the Project

The continued development of Lock Threads is made possible
thanks to the support of awesome backers. If you'd like to join them,
please consider contributing with
[Patreon](https://armin.dev/go/patreon?pr=lock-threads&src=repo),
[PayPal](https://armin.dev/go/paypal?pr=lock-threads&src=repo) or
[Bitcoin](https://armin.dev/go/bitcoin?pr=lock-threads&src=repo).

## Usage

Create the `lock.yml` workflow file in the `.github/workflows` directory,
use one of the [example workflows](#examples) to get started.

### Inputs

<!-- prettier-ignore -->
The action can be configured using [input parameters](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepswith).

- **`github-token`**
  - GitHub access token, value must be `${{ github.token }}` or an encrypted
    secret that contains a [personal access token](#using-a-personal-access-token)
  - Optional, defaults to `${{ github.token }}`
- **`issue-inactive-days`**
  - Number of days of inactivity before a closed issue is locked
  - Optional, defaults to `365`
- **`exclude-issue-created-before`**
  - Do not lock issues created before a given date,
    value must follow ISO 8601, ignored
    when `exclude-issue-created-between` is set
  - Optional, defaults to `''`
- **`exclude-issue-created-after`**
  - Do not lock issues created after a given date,
    value must follow ISO 8601, ignored
    when `exclude-issue-created-between` is set
  - Optional, defaults to `''`
- **`exclude-issue-created-between`**
  - Do not lock issues created in a given time interval,
    value must follow ISO 8601
  - Optional, defaults to `''`
- **`exclude-issue-closed-before`**
  - Do not lock issues closed before a given date,
    value must follow ISO 8601, ignored
    when `exclude-issue-closed-between` is set
  - Optional, defaults to `''`
- **`exclude-issue-closed-after`**
  - Do not lock issues closed after a given date,
    value must follow ISO 8601, ignored
    when `exclude-issue-closed-between` is set
  - Optional, defaults to `''`
- **`exclude-issue-closed-between`**
  - Do not lock issues closed in a given time interval,
    value must follow ISO 8601
  - Optional, defaults to `''`
- **`include-any-issue-labels`**
  - Only lock issues with any of these labels, value must be
    a comma separated list of labels or `''`, ignored
    when `include-all-issue-labels` is set
  - Optional, defaults to `''`
- **`include-all-issue-labels`**
  - Only lock issues with all these labels, value must be
    a comma separated list of labels or `''`
  - Optional, defaults to `''`
- **`exclude-any-issue-labels`**
  - Do not lock issues with any of these labels, value must be
    a comma separated list of labels or `''`
  - Optional, defaults to `''`
- **`add-issue-labels`**
  - Labels to add before locking an issue, value must be
    a comma separated list of labels or `''`
  - Optional, defaults to `''`
- **`remove-issue-labels`**
  - Labels to remove before locking an issue, value must be
    a comma separated list of labels or `''`
  - Optional, defaults to `''`
- **`issue-comment`**
  - Comment to post before locking an issue
  - Optional, defaults to `''`
- **`issue-lock-reason`**
  - Reason for locking an issue, value must be one
    of `resolved`, `off-topic`, `too heated`, `spam` or `''`
  - Optional, defaults to `resolved`
- **`pr-inactive-days`**
  - Number of days of inactivity before a closed pull request is locked
  - Optional, defaults to `365`
- **`exclude-pr-created-before`**
  - Do not lock pull requests created before a given date,
    value must follow ISO 8601, ignored
    when `exclude-pr-created-between` is set
  - Optional, defaults to `''`
- **`exclude-pr-created-after`**
  - Do not lock pull requests created after a given date,
    value must follow ISO 8601, ignored
    when `exclude-pr-created-between` is set
  - Optional, defaults to `''`
- **`exclude-pr-created-between`**
  - Do not lock pull requests created in a given time interval,
    value must follow ISO 8601
  - Optional, defaults to `''`
- **`exclude-pr-closed-before`**
  - Do not lock pull requests closed before a given date,
    value must follow ISO 8601, ignored
    when `exclude-pr-closed-between` is set
  - Optional, defaults to `''`
- **`exclude-pr-closed-after`**
  - Do not lock pull requests closed after a given date,
    value must follow ISO 8601, ignored
    when `exclude-pr-closed-between` is set
  - Optional, defaults to `''`
- **`exclude-pr-closed-between`**
  - Do not lock pull requests closed in a given time interval,
    value must follow ISO 8601
  - Optional, defaults to `''`
- **`include-any-pr-labels`**
  - Only lock pull requests with any of these labels, value must be
    a comma separated list of labels or `''`, ignored
    when `include-all-pr-labels` is set
  - Optional, defaults to `''`
- **`include-all-pr-labels`**
  - Only lock pull requests with all these labels, value must be
    a comma separated list of labels or `''`
  - Optional, defaults to `''`
- **`exclude-any-pr-labels`**
  - Do not lock pull requests with any of these labels, value must be
    a comma separated list of labels or `''`
  - Optional, defaults to `''`
- **`add-pr-labels`**
  - Labels to add before locking a pull request, value must be
    a comma separated list of labels or `''`
  - Optional, defaults to `''`
- **`remove-pr-labels`**
  - Labels to remove before locking a pull request, value must be
    a comma separated list of labels or `''`
  - Optional, defaults to `''`
- **`pr-comment`**
  - Comment to post before locking a pull request
  - Optional, defaults to `''`
- **`pr-lock-reason`**
  - Reason for locking a pull request, value must be one
    of `resolved`, `off-topic`, `too heated`, `spam` or `''`
  - Optional, defaults to `resolved`
- **`process-only`**
  - Limit locking to only issues or pull requests, value must be
    one of `issues`, `prs` or `''`
  - Optional, defaults to `''`
- **`log-output`**
  - Log output parameters, value must be either `true` or `false`
  - Optional, defaults to `false`

### Outputs

<!-- prettier-ignore -->
- **`issues`**
  - Issues that have been locked, value is a JSON string in the form
    of `[{"owner": "actions", "repo": "toolkit", "issue_number": 1}]`
  - Defaults to `''`
- **`prs`**
  - Pull requests that have been locked, value is a JSON string in the form
    of `[{"owner": "actions", "repo": "toolkit", "issue_number": 1}]`
  - Defaults to `''`

## Examples

The following workflow will search once an hour for closed issues
and pull requests that have not had any activity
in the past year and can be locked.

<!-- prettier-ignore -->
```yaml
name: 'Lock Threads'

on:
  schedule:
    - cron: '0 * * * *'
  workflow_dispatch:

permissions:
  issues: write
  pull-requests: write

concurrency:
  group: lock

jobs:
  action:
    runs-on: ubuntu-latest
    steps:
      - uses: dessant/lock-threads@v3
```

Edit the workflow after the initial backlog of issues and pull requests
has been processed to reduce the frequency of scheduled runs.
Running the workflow only once a day helps reduce resource usage.

<!-- prettier-ignore -->
```yaml
on:
  schedule:
    - cron: '0 0 * * *'
```

### Available input parameters

This workflow declares all the available input parameters of the action
and their default values. Any of the parameters can be omitted.

<!-- prettier-ignore -->
```yaml
name: 'Lock Threads'

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

permissions:
  issues: write
  pull-requests: write

concurrency:
  group: lock

jobs:
  action:
    runs-on: ubuntu-latest
    steps:
      - uses: dessant/lock-threads@v3
        with:
          github-token: ${{ github.token }}
          issue-inactive-days: '365'
          exclude-issue-created-before: ''
          exclude-issue-created-after: ''
          exclude-issue-created-between: ''
          exclude-issue-closed-before: ''
          exclude-issue-closed-after: ''
          exclude-issue-closed-between: ''
          include-any-issue-labels: ''
          include-all-issue-labels: ''
          exclude-any-issue-labels: ''
          add-issue-labels: ''
          remove-issue-labels: ''
          issue-comment: ''
          issue-lock-reason: 'resolved'
          pr-inactive-days: '365'
          exclude-pr-created-before: ''
          exclude-pr-created-after: ''
          exclude-pr-created-between: ''
          exclude-pr-closed-before: ''
          exclude-pr-closed-after: ''
          exclude-pr-closed-between: ''
          include-any-pr-labels: ''
          include-all-pr-labels: ''
          exclude-any-pr-labels: ''
          add-pr-labels: ''
          remove-pr-labels: ''
          pr-comment: ''
          pr-lock-reason: 'resolved'
          process-only: ''
          log-output: false
```

### Filtering issues and pull requests

This step will lock only issues, and exclude issues created before 2018,
or those with the `upstream` or `help-wanted` labels applied.

<!-- prettier-ignore -->
```yaml
    steps:
      - uses: dessant/lock-threads@v3
        with:
          exclude-issue-created-before: '2018-01-01T00:00:00Z'
          exclude-any-issue-labels: 'upstream, help-wanted'
          process-only: 'issues'
```

This step will lock only pull requests, and exclude those
with the `wip` label applied.

<!-- prettier-ignore -->
```yaml
    steps:
      - uses: dessant/lock-threads@v3
        with:
          exclude-any-pr-labels: 'wip'
          process-only: 'prs'
```

This step will lock only issues, and exclude issues closed before 2018,
or those created in 2018 and 2019.

<!-- prettier-ignore -->
```yaml
    steps:
      - uses: dessant/lock-threads@v3
        with:
          exclude-issue-created-between: '2018-01-01T00:00:00Z/2019-12-31T23:59:59.999Z'
          exclude-issue-closed-before: '2018-01-01T00:00:00Z'
          process-only: 'issues'
```

This step will lock issues that have the `incomplete` _or_ `invalid`
labels applied, and pull requests that have the `qa: done` _and_ `published`
labels applied.

<!-- prettier-ignore -->
```yaml
    steps:
      - uses: dessant/lock-threads@v3
        with:
          include-any-issue-labels: 'incomplete, invalid'
          include-all-pr-labels: 'qa: done, published'

```

This step will lock issues that have not had any activity in the past 180 days.

<!-- prettier-ignore -->
```yaml
    steps:
      - uses: dessant/lock-threads@v3
        with:
          issue-inactive-days: '180'
          process-only: 'issues'

```

### Commenting and labeling

This step will post a comment on issues and pull requests before locking them,
and apply the `outdated` label to issues.

<!-- prettier-ignore -->
```yaml
    steps:
      - uses: dessant/lock-threads@v3
        with:
          add-issue-labels: 'outdated'
          issue-comment: >
            This issue has been automatically locked since there
            has not been any recent activity after it was closed.
            Please open a new issue for related bugs.
          pr-comment: >
            This pull request has been automatically locked since there
            has not been any recent activity after it was closed.
            Please open a new issue for related bugs.
```

This step will apply the `qa: done` and `archived` labels,
and remove the `qa: primary` and `needs: user feedback` labels
before locking issues.

<!-- prettier-ignore -->
```yaml
    steps:
      - uses: dessant/lock-threads@v3
        with:
          add-issue-labels: 'qa: done, archived'
          remove-issue-labels: 'qa: primary, needs: user feedback'
```

### Using a personal access token

The action uses an installation access token by default to interact with GitHub.
You may also authenticate with a personal access token to perform actions
as a GitHub user instead of the `github-actions` app.

Create a [personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)
with the `repo` or `public_repo` scopes enabled, and add the token as an
[encrypted secret](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository)
for the repository or organization, then provide the action with the secret
using the `github-token` input parameter.

<!-- prettier-ignore -->
```yaml
    steps:
      - uses: dessant/lock-threads@v3
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

## How are issues and pull requests determined to be inactive?

The action uses GitHub's [updated](https://help.github.com/en/github/searching-for-information-on-github/searching-issues-and-pull-requests#search-by-when-an-issue-or-pull-request-was-created-or-last-updated)
search qualifier to determine inactivity. Any change to an issue or pull request
is considered an update, including comments, changing labels,
applying or removing milestones, or pushing commits.

An easy way to check and see which issues or pull requests will initially
be locked is to add the `updated` search qualifier to either the issue
or pull request search field for your repository:
`is:closed is:unlocked updated:<2018-12-20`.
Adjust the date to be 365 days ago (or whatever you set for `*-inactive-days`)
to see which issues or pull requests will be locked.

## Why are only some issues and pull requests processed?

To avoid triggering abuse prevention mechanisms on GitHub, only 50 issues
and pull requests will be handled at once. If your repository has more
than that, it will just take a few hours or days to process them all.

## License

Copyright (c) 2017-2022 Armin Sebastian

This software is released under the terms of the MIT License.
See the [LICENSE](LICENSE) file for further information.
