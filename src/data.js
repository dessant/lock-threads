const addDiscussionCommentQuery = `
mutation ($discussionId: ID!, $body: String!) {
  addDiscussionComment(input: {discussionId: $discussionId, body: $body}) {
    comment {
      id
    }
  }
}
`;

const getLabelQuery = `
query ($owner: String!, $repo: String!, $label: String!) {
  repository(owner: $owner, name: $repo) {
    label(name: $label) {
      id
      name
    }
  }
}
`;

const createLabelQuery = `
mutation ($repositoryId: ID!, $name: String!, $color: String!) {
  createLabel(input: {repositoryId: $repositoryId, name: $name, , color: $color}) {
    label {
      id
      name
    }
  }
}
`;

const getDiscussionLabelsQuery = `
query ($owner: String!, $repo: String!, $discussion: Int!) {
  repository(owner: $owner, name: $repo) {
    discussion(number: $discussion) {
      number
      labels(first: 100) {
        nodes {
          id
          name
        }
      }
    }
  }
}
`;

const addLabelsToLabelableQuery = `
mutation ($labelableId: ID!, $labelIds: [ID!]!) {
  addLabelsToLabelable(input: {labelableId: $labelableId, labelIds: $labelIds}) {
    labelable {
      labels(first: 0) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
}
`;

const removeLabelsFromLabelableQuery = `
mutation ($labelableId: ID!, $labelIds: [ID!]!) {
  removeLabelsFromLabelable(input: {labelableId: $labelableId, labelIds: $labelIds}) {
    labelable {
      labels(first: 0) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
}
`;

const lockLockableQuery = `
mutation ($lockableId: ID!) {
  lockLockable(input: {lockableId: $lockableId}) {
    lockedRecord {
      locked
    }
  }
}
`;

const searchDiscussionsQuery = `
query ($q: String!) {
  search(type: DISCUSSION, first: 50, query: $q) {
    nodes {
      ... on Discussion {
        id
        number
      }
    }
  }
}
`;

export {
  searchDiscussionsQuery,
  addDiscussionCommentQuery,
  getLabelQuery,
  createLabelQuery,
  getDiscussionLabelsQuery,
  addLabelsToLabelableQuery,
  removeLabelsFromLabelableQuery,
  lockLockableQuery
};
