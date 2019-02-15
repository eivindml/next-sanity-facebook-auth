export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'username',
      title: 'Username',
      type: 'string'
    },
    {
      name: 'note',
      title: 'Secret Note',
      type: 'reference',
      to: { type: 'note' }
    }
  ]
}
