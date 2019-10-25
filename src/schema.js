const Joi = require('@hapi/joi');

const fields = {
  daysUntilLock: Joi.number()
    .min(1)
    .max(3650)
    .description(
      'Number of days of inactivity before a closed issue or pull request is locked'
    ),

  skipCreatedBefore: Joi.alternatives()
    .try(
      Joi.date()
        .iso()
        .min('1970-01-01T00:00:00Z')
        .max('2970-12-31T23:59:59Z'),
      Joi.boolean().only(false)
    )
    .description(
      'Skip issues and pull requests created before a given timestamp. Timestamp ' +
        'must follow ISO 8601 (`YYYY-MM-DD`). Set to `false` to disable'
    ),

  exemptLabels: Joi.array()
    .single()
    .items(
      Joi.string()
        .trim()
        .max(50)
    )
    .description(
      'Issues and pull requests with these labels will not be locked. Set to `[]` to disable'
    ),

  lockLabel: Joi.alternatives()
    .try(
      Joi.string()
        .trim()
        .max(50),
      Joi.boolean().only(false)
    )
    .description(
      'Label to add before locking, such as `outdated`. Set to `false` to disable'
    ),

  lockComment: Joi.alternatives()
    .try(
      Joi.string()
        .trim()
        .max(10000),
      Joi.boolean().only(false)
    )
    .description('Comment to post before locking. Set to `false` to disable'),

  setLockReason: Joi.boolean().description(
    'Assign `resolved` as the reason for locking. Set to `false` to disable'
  )
};

const schema = Joi.object().keys({
  daysUntilLock: fields.daysUntilLock.default(365),
  skipCreatedBefore: fields.skipCreatedBefore.default(false),
  exemptLabels: fields.exemptLabels.default([]),
  lockLabel: fields.lockLabel.default(false),
  lockComment: fields.lockComment.default(
    'This thread has been automatically locked since there has not been ' +
      'any recent activity after it was closed. Please open a new issue for ' +
      'related bugs.'
  ),
  setLockReason: fields.setLockReason.default(true),
  only: Joi.string()
    .trim()
    .valid('issues', 'pulls')
    .description('Limit to only `issues` or `pulls`'),
  pulls: Joi.object().keys(fields),
  issues: Joi.object().keys(fields),
  _extends: Joi.string()
    .trim()
    .max(260)
    .description('Repository to extend settings from'),
  perform: Joi.boolean().default(!process.env.DRY_RUN)
});

module.exports = schema;
