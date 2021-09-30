# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/dessant/lock-threads/compare/v2.1.2...v3.0.0) (2021-09-27)


### ⚠ BREAKING CHANGES

* input parameter names have changed

  Rename the following input parameters when upgrading from v2 to v3:

  * `issue-lock-inactive-days` --> `issue-inactive-days`
  * `issue-exclude-created-before` --> `exclude-issue-created-before`
  * `issue-exclude-labels` --> `exclude-any-issue-labels`
  * `issue-lock-labels` --> `add-issue-labels`
  * `issue-lock-comment` --> `issue-comment`
  * `pr-lock-inactive-days` --> `pr-inactive-days`
  * `pr-exclude-created-before` --> `exclude-pr-created-before`
  * `pr-exclude-labels` --> `exclude-any-pr-labels`
  * `pr-lock-labels` --> `add-pr-labels`
  * `pr-lock-comment` --> `pr-comment`

### Features

* add new filtering and labeling options, update input parameter names ([26fd836](https://github.com/dessant/lock-threads/commit/26fd836f96f46625de24663c4dc2b84c8408fcb1))
* allow manual triggering ([a0c7da3](https://github.com/dessant/lock-threads/commit/a0c7da306555d946273957477018fe178130ccf9))

### [2.1.2](https://github.com/dessant/lock-threads/compare/v2.1.1...v2.1.2) (2021-08-17)


### Bug Fixes

* ignore error when commenting on issue converted to discussion ([60d2a1a](https://github.com/dessant/lock-threads/commit/60d2a1a4bee140c0408a057fdb025155cdba18dd)), closes [#24](https://github.com/dessant/lock-threads/issues/24)

### [2.1.1](https://github.com/dessant/lock-threads/compare/v2.1.0...v2.1.1) (2021-07-09)


### Bug Fixes

* update GitHub API calls ([a3ccc71](https://github.com/dessant/lock-threads/commit/a3ccc71fffa8f16e865eb3661cf8852e11d0a289))

## [2.1.0](https://github.com/dessant/lock-threads/compare/v2.0.3...v2.1.0) (2021-07-09)


### Features

* make github-token optional and document the use of personal access tokens ([3eba4fe](https://github.com/dessant/lock-threads/commit/3eba4feee52d51242057af33eb6a7f0a9969c1f9))


### Bug Fixes

* declare required permissions ([877b357](https://github.com/dessant/lock-threads/commit/877b357328e98d932378cfc33f428d17a9a7409d))

### [2.0.3](https://github.com/dessant/lock-threads/compare/v2.0.2...v2.0.3) (2021-01-01)


### Bug Fixes

* update imported package name ([eba004b](https://github.com/dessant/lock-threads/commit/eba004bec39a410184db347eec5294ca57d38188))

### [2.0.2](https://github.com/dessant/lock-threads/compare/v2.0.1...v2.0.2) (2021-01-01)


### Bug Fixes

* update dependencies ([eb0aabb](https://github.com/dessant/lock-threads/commit/eb0aabb42c66b0d8f954cbceabe5809170095a9a))

### [2.0.1](https://github.com/dessant/lock-threads/compare/v2.0.0...v2.0.1) (2020-07-07)


### Bug Fixes

* update dependencies ([a016bfb](https://github.com/dessant/lock-threads/commit/a016bfbb7a158eb14922b239899b5804b5075792)), closes [#17](https://github.com/dessant/lock-threads/issues/17)

## [2.0.0](https://github.com/dessant/lock-threads/compare/v1.0.1...v2.0.0) (2020-02-17)


### ⚠ BREAKING CHANGES

* The deployment method and configuration options have changed.

### Features

* move to GitHub Actions ([eb01523](https://github.com/dessant/lock-threads/commit/eb01523c2455360feaadea2ccf7db8a21532bef4))

### [1.0.1](https://github.com/dessant/lock-threads/compare/v1.0.0...v1.0.1) (2019-10-25)


### Bug Fixes

* update dependencies ([9381fb2](https://github.com/dessant/lock-threads/commit/9381fb23661a4f75fd212751222d2ac7122bc693))

## [1.0.0](https://github.com/dessant/lock-threads/compare/v0.8.3...v1.0.0) (2019-06-09)


### Features

* update dependencies ([4be9f8f](https://github.com/dessant/lock-threads/commit/4be9f8f))


### BREAKING CHANGES

* probot < 9.2.13 no longer supported.



<a name="0.8.3"></a>
## [0.8.3](https://github.com/dessant/lock-threads/compare/v0.8.2...v0.8.3) (2019-01-20)



<a name="0.8.2"></a>
## [0.8.2](https://github.com/dessant/lock-threads/compare/v0.8.1...v0.8.2) (2019-01-19)


### Bug Fixes

* apply stricter config validation ([53b6320](https://github.com/dessant/lock-threads/commit/53b6320))
* limit daysUntilLock to 10 years ([7ee7d4b](https://github.com/dessant/lock-threads/commit/7ee7d4b))
* skip wrong search results ([5b94ab5](https://github.com/dessant/lock-threads/commit/5b94ab5))



<a name="0.8.1"></a>
## [0.8.1](https://github.com/dessant/lock-threads/compare/v0.8.0...v0.8.1) (2019-01-18)


### Bug Fixes

* use `is:unlocked` search qualifier ([dfa9e82](https://github.com/dessant/lock-threads/commit/dfa9e82)), closes [#5](https://github.com/dessant/lock-threads/issues/5)



<a name="0.8.0"></a>
# [0.8.0](https://github.com/dessant/lock-threads/compare/v0.7.1...v0.8.0) (2018-11-08)


### Features

* support for skipping issues created before a given timestamp ([ace8c2d](https://github.com/dessant/lock-threads/commit/ace8c2d))



<a name="0.7.1"></a>
## [0.7.1](https://github.com/dessant/lock-threads/compare/v0.7.0...v0.7.1) (2018-10-03)


### Bug Fixes

* allow newer versions of node ([436ec0d](https://github.com/dessant/lock-threads/commit/436ec0d))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/dessant/lock-threads/compare/v0.6.2...v0.7.0) (2018-07-23)


### Features

* notify maintainers about configuration errors ([38614a9](https://github.com/dessant/lock-threads/commit/38614a9))



<a name="0.6.2"></a>
## [0.6.2](https://github.com/dessant/lock-threads/compare/v0.6.1...v0.6.2) (2018-06-27)


### Bug Fixes

* add missing config key to schema ([83e345c](https://github.com/dessant/lock-threads/commit/83e345c))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/dessant/lock-threads/compare/v0.6.0...v0.6.1) (2018-06-24)


### Bug Fixes

* log missing config as info ([5d4c58f](https://github.com/dessant/lock-threads/commit/5d4c58f))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/dessant/lock-threads/compare/v0.5.2...v0.6.0) (2018-06-24)


### Features

* add option for setting lock reason ([5b9d6f4](https://github.com/dessant/lock-threads/commit/5b9d6f4)), closes [#7](https://github.com/dessant/lock-threads/issues/7)
* extend settings from a different repository ([9da62c6](https://github.com/dessant/lock-threads/commit/9da62c6))
* use child logger for scheduled tasks and add DRY_RUN env var ([4abb957](https://github.com/dessant/lock-threads/commit/4abb957))



<a name="0.5.2"></a>
## [0.5.2](https://github.com/dessant/lock-threads/compare/v0.5.1...v0.5.2) (2018-05-30)



<a name="0.5.1"></a>
## [0.5.1](https://github.com/dessant/lock-threads/compare/v0.5.0...v0.5.1) (2018-05-30)


### Bug Fixes

* set main module path ([d4eb339](https://github.com/dessant/lock-threads/commit/d4eb339))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/dessant/lock-threads/compare/v0.4.0...v0.5.0) (2018-05-06)


### Features

* validate config and set custom options for issues and pulls ([ecb0e91](https://github.com/dessant/lock-threads/commit/ecb0e91))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/dessant/lock-threads/compare/v0.3.0...v0.4.0) (2018-05-01)


### Bug Fixes

* set defaults for new config options ([b75ee6d](https://github.com/dessant/lock-threads/commit/b75ee6d))


### Features

* add labels when locking ([#4](https://github.com/dessant/lock-threads/issues/4)) ([4c0bc99](https://github.com/dessant/lock-threads/commit/4c0bc99))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/dessant/lock-threads/compare/v0.2.0...v0.3.0) (2018-05-01)


### Bug Fixes

* update dependencies ([6c16ada](https://github.com/dessant/lock-threads/commit/6c16ada))


### Features

* add a lock reason with "resolved" ([#3](https://github.com/dessant/lock-threads/issues/3)) ([a5dbbcd](https://github.com/dessant/lock-threads/commit/a5dbbcd))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/dessant/lock-threads/compare/v0.1.0...v0.2.0) (2018-03-29)


### Features

* ignore threads with certain labels ([8a29d89](https://github.com/dessant/lock-threads/commit/8a29d89)), closes [#1](https://github.com/dessant/lock-threads/issues/1)



<a name="0.1.0"></a>
# 0.1.0 (2017-12-11)
