require('dotenv').config()

const fetch = require('isomorphic-unfetch')
const sanity = require('@sanity/client')
const { send, run, json } = require('micro')

// Log in the user by using the Facebook `code`
// recieved from client side to:
// 1. get Facebook access token,
// 2. get Facebook profile using access token,
// 3. create expiration date for token,
// 4. generate sanity session, and return token.
const login = async (req, res) => {
  const now = new Date()
  const { code } = await json(req)

  // Get Facebook token and profile data
  const { 'access_token': accessToken, 'expires_in': expiresIn } = await getFacebookToken(code)
  const { id, name } = await getFacebookProfile(accessToken)

  // Create expiration date for tokens.
  // So Facebook token, Sanity token and
  // browser cookie have same expiration date.
  now.setSeconds(now.getSeconds() + expiresIn)
  const expires = now.toISOString()

  // Generate sanity session token and create user in database
  const { token } = await generateSanitySession(id, name, expires)
  await createUserIfNotExists(token, id, name)

  send(res, 200, { token, expires })
}

// Get Facebook token
const getFacebookToken = async (code) => {
  const url = `https://graph.facebook.com\
/v3.2/oauth/access_token\
?client_id=${process.env.FACEBOOK_APP_ID}\
&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}\
&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}\
&code=${code}`

  const response = await fetch(url)
  return response.json()
}

// Get Facebook profile data
const getFacebookProfile = async (token) => {
  const url = `https://graph.facebook.com\
/me\
?fields=id,name,picture.width(512)\
&access_token=${token}`

  const response = await fetch(url)
  return response.json()
}

// Generates Sanity session token
const generateSanitySession = async (id, name, expires) => {
  const url = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io\
/v1/auth/thirdParty/session`

  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${process.env.SANITY_TOKEN_CREATE_SESSION}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: `e-${id}`,
      userFullName: name,
      sessionExpires: expires
    })
  }

  const response = await fetch(url, options)
  return response.json()
}

// Creates user in Sanity database
const createUserIfNotExists = async (token, id, name) => {
  const client = sanity({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    token: token
  })

  const document = {
    _type: 'user',
    _id: `e-${id}`,
    name: name
  }
  return client.createIfNotExists(document)
}

module.exports = (req, res) => run(req, res, login)
