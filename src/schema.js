const Joi = require('joi');

const extendedJoi = Joi.extend({
  type: 'stringList',
  base: Joi.array(),
  coerce: {
    from: 'string',
    method(value) {
      value = value.trim();
      if (value) {
        value = value
          .split(',')
          .map(item => item.trim())
          .filter(Boolean);
      }

      return {value};
    }
  }
}).extend({
  type: 'processOnly',
  base: Joi.string(),
  coerce: {
    from: 'string',
    method(value) {
      value = value.trim();
      if (['issues', 'prs'].includes(value)) {
        value = value.slice(0, -1);
      }

      return {value};
    }
  }
});

const schema = Joi.object({
  'github-token': Joi.string()
    .trim()
    .max(100),

  'issue-lock-inactive-days': Joi.number()
    .min(0)
    .max(3650)
    .precision(9)
    .default(365),

  'issue-exclude-created-before': Joi.alternatives()
    .try(
      Joi.date()
        // .iso()
        .min('1970-01-01T00:00:00Z')
        .max('2970-12-31T23:59:59Z'),
      Joi.string()
        .trim()
        .valid('')
    )
    .default(''),

  'issue-exclude-labels': Joi.alternatives()
    .try(
      extendedJoi
        .stringList()
        .items(
          Joi.string()
            .trim()
            .max(50)
        )
        .min(1)
        .max(30)
        .unique(),
      Joi.string()
        .trim()
        .valid('')
    )
    .default(''),

  'issue-lock-labels': Joi.alternatives()
    .try(
      extendedJoi
        .stringList()
        .items(
          Joi.string()
            .trim()
            .max(50)
        )
        .min(1)
        .max(30)
        .unique(),
      Joi.string()
        .trim()
        .valid('')
    )
    .default(''),

  'issue-lock-comment': Joi.string()
    .trim()
    .max(10000)
    .allow('')
    .default(''),

  'issue-lock-reason': Joi.string()
    .valid('resolved', 'off-topic', 'too heated', 'spam', '')
    .default('resolved'),

  'pr-lock-inactive-days': Joi.number()
    .min(0)
    .max(3650)
    .precision(9)
    .default(365),

  'pr-exclude-created-before': Joi.alternatives()
    .try(
      Joi.date()
        // .iso()
        .min('1970-01-01T00:00:00Z')
        .max('2970-12-31T23:59:59Z'),
      Joi.string()
        .trim()
        .valid('')
    )
    .default(''),

  'pr-exclude-labels': Joi.alternatives()
    .try(
      extendedJoi
        .stringList()
        .items(
          Joi.string()
            .trim()
            .max(50)
        )
        .min(1)
        .max(30)
        .unique(),
      Joi.string()
        .trim()
        .valid('')
    )
    .default(''),

  'pr-lock-labels': Joi.alternatives()
    .try(
      extendedJoi
        .stringList()
        .items(
          Joi.string()
            .trim()
            .max(50)
        )
        .min(1)
        .max(30)
        .unique(),
      Joi.string()
        .trim()
        .valid('')
    )
    .default(''),

  'pr-lock-comment': Joi.string()
    .trim()
    .max(10000)
    .allow('')
    .default(''),

  'pr-lock-reason': Joi.string()
    .valid('resolved', 'off-topic', 'too heated', 'spam', '')
    .default('resolved'),

  'process-only': extendedJoi
    .processOnly()
    .valid('issue', 'pr', '')
    .default('')
});

module.exports = schema;
