import Joi from 'joi';

const extendedJoi = Joi.extend(joi => {
  return {
    type: 'stringList',
    base: joi.array(),
    coerce: {
      from: 'string',
      method(value, helpers) {
        value = value.trim();
        if (value) {
          value = value
            .split(',')
            .map(item =>
              // remove quotes around list item
              item.replace(/^\s*["'](.+)["']\s*$/, '$1').trim()
            )
            .filter(Boolean);
        }

        return {value};
      }
    }
  };
})
  .extend(joi => {
    return {
      type: 'timeInterval',
      base: joi.array(),
      messages: {
        'timeInterval.asc':
          '{{#label}} the start date must be earlier than the end date'
      },
      coerce: {
        from: 'string',
        method(value, helpers) {
          value = value.trim();
          if (value) {
            value = value
              .split('/')
              .map(item => item.trim())
              .filter(Boolean);
          }

          return {value};
        }
      },
      rules: {
        asc: {
          validate(value, helpers, args, options) {
            if (value[0] < value[1]) {
              return value;
            }

            return helpers.error('timeInterval.asc');
          }
        }
      }
    };
  })
  .extend(joi => {
    return {
      type: 'processOnly',
      base: joi.array(),
      coerce: {
        from: 'string',
        method(value) {
          value = value.trim();

          if (value) {
            value = value
              .split(',')
              .map(item => {
                item = item.trim();
                if (['issues', 'prs', 'discussions'].includes(item)) {
                  item = item.slice(0, -1);
                }
                return item;
              })
              .filter(Boolean);
          }

          return {value};
        }
      }
    };
  });

const joiDate = Joi.alternatives().try(
  Joi.date().iso().min('1970-01-01T00:00:00Z').max('2970-12-31T23:59:59Z'),
  Joi.string().trim().valid('')
);

const joiTimeInterval = Joi.alternatives().try(
  extendedJoi
    .timeInterval()
    .items(
      Joi.date().iso().min('1970-01-01T00:00:00Z').max('2970-12-31T23:59:59Z')
    )
    .length(2)
    .asc(),
  Joi.string().trim().valid('')
);

const joiLabels = Joi.alternatives().try(
  extendedJoi
    .stringList()
    .items(Joi.string().trim().max(50))
    .min(1)
    .max(30)
    .unique(),
  Joi.string().trim().valid('')
);

const schema = Joi.object({
  'github-token': Joi.string().trim().max(100),

  'issue-inactive-days': Joi.number()
    .min(0)
    .max(3650)
    .precision(9)
    .default(365),

  'exclude-issue-created-before': joiDate.default(''),

  'exclude-issue-created-after': joiDate.default(''),

  'exclude-issue-created-between': joiTimeInterval.default(''),

  'exclude-issue-closed-before': joiDate.default(''),

  'exclude-issue-closed-after': joiDate.default(''),

  'exclude-issue-closed-between': joiTimeInterval.default(''),

  'include-any-issue-labels': joiLabels.default(''),

  'include-all-issue-labels': joiLabels.default(''),

  'exclude-any-issue-labels': joiLabels.default(''),

  'add-issue-labels': joiLabels.default(''),

  'remove-issue-labels': joiLabels.default(''),

  'include-issue-currently-open': Joi.boolean().default(false),

  'issue-comment': Joi.string().trim().max(10000).allow('').default(''),

  'issue-lock-reason': Joi.string()
    .valid('resolved', 'off-topic', 'too heated', 'spam', '')
    .default('resolved'),

  'pr-inactive-days': Joi.number().min(0).max(3650).precision(9).default(365),

  'exclude-pr-created-before': joiDate.default(''),

  'exclude-pr-created-after': joiDate.default(''),

  'exclude-pr-created-between': joiTimeInterval.default(''),

  'exclude-pr-closed-before': joiDate.default(''),

  'exclude-pr-closed-after': joiDate.default(''),

  'exclude-pr-closed-between': joiTimeInterval.default(''),

  'include-any-pr-labels': joiLabels.default(''),

  'include-all-pr-labels': joiLabels.default(''),

  'exclude-any-pr-labels': joiLabels.default(''),

  'add-pr-labels': joiLabels.default(''),

  'remove-pr-labels': joiLabels.default(''),

  'include-pr-currently-open': Joi.boolean().default(false),

  'pr-comment': Joi.string().trim().max(10000).allow('').default(''),

  'pr-lock-reason': Joi.string()
    .valid('resolved', 'off-topic', 'too heated', 'spam', '')
    .default('resolved'),

  'discussion-inactive-days': Joi.number()
    .min(0)
    .max(3650)
    .precision(9)
    .default(365),

  'exclude-discussion-created-before': joiDate.default(''),

  'exclude-discussion-created-after': joiDate.default(''),

  'exclude-discussion-created-between': joiTimeInterval.default(''),

  'exclude-discussion-closed-before': joiDate.default(''),

  'exclude-discussion-closed-after': joiDate.default(''),

  'exclude-discussion-closed-between': joiTimeInterval.default(''),

  'include-any-discussion-labels': joiLabels.default(''),

  'include-all-discussion-labels': joiLabels.default(''),

  'exclude-any-discussion-labels': joiLabels.default(''),

  'add-discussion-labels': joiLabels.default(''),

  'remove-discussion-labels': joiLabels.default(''),

  'include-discussion-currently-open': Joi.boolean().default(false),

  'discussion-comment': Joi.string().trim().max(10000).allow('').default(''),

  'process-only': Joi.alternatives()
    .try(
      extendedJoi
        .processOnly()
        .items(Joi.string().valid('issue', 'pr', 'discussion'))
        .min(1)
        .max(3)
        .unique(),
      Joi.string().trim().valid('')
    )
    .default(''),

  'log-output': Joi.boolean().default(false)
});

export {schema};
