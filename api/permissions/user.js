// Permissions to make user profiles private, except
// your own (when authenticated).
//
// $identity is the id of the current authenticated
// user (https://www.sanity.io/docs/groq-parameters).

module.exports = {
  '_id': '_.groups.profiles.security',
  '_type': 'system.group',
  'grants': [
    {
      'filter': '_type == "user" && _id == identity()',
      'permissions': ['read', 'update', 'create']
    }
  ],
  'members': ['everyone']
}
