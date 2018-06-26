const Joi = require('joi');

const fields = {
  daysUntilLock: Joi.number()
    .min(1)
    .description(
      'Number of days of inactivity before a closed issue or pull request is locked'
    ),

  exemptLabels: Joi.array()
    .single()
    .items(Joi.string())
    .description(
      'Issues and pull requests with these labels will not be locked. Set to `[]` to disable'
    ),

  lockLabel: Joi.alternatives()
    .try(Joi.string(), Joi.boolean().only(false))
    .description(
      'Label to add before locking, such as `outdated`. Set to `false` to disable'
    ),

  lockComment: Joi.alternatives()
    .try(Joi.string(), Joi.boolean().only(false))
    .description('Comment to post before locking. Set to `false` to disable'),

  setLockReason: Joi.boolean().description(
    'Assign `resolved` as the reason for locking. Set to `false` to disable'
  )
};

const schema = Joi.object().keys({
  daysUntilLock: fields.daysUntilLock.default(365),
  exemptLabels: fields.exemptLabels.default([]),
  lockLabel: fields.lockLabel.default(false),
  lockComment: fields.lockComment.default(
    'This thread has been automatically locked since there has not been ' +
      'any recent activity after it was closed. Please open a new issue for ' +
      'related bugs.'
  ),
  setLockReason: fields.setLockReason.default(true),
  only: Joi.string()
    .valid('issues', 'pulls')
    .description('Limit to only `issues` or `pulls`'),
  pulls: Joi.object().keys(fields),
  issues: Joi.object().keys(fields),
  _extends: Joi.string().description('Repository to extend settings from'),
  perform: Joi.boolean().default(!process.env.DRY_RUN)
});

module.exports = schema;
