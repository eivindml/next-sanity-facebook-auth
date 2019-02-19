require('dotenv').config()
const sanity = require('@sanity/client')
const user = require('./user')

// This script is intended to be executed
// from the commandline to add/update
// permissions for documents and members.

const client = sanity({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN_CREATE_SESSION
})

async function updatePermissions () {
  await client.create(user)
    .then(() => console.log('Updated permissions.'))
    .catch(error => console.error(error))
}

console.log('Updating permissions …')
updatePermissions()
