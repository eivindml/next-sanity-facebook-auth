require('dotenv').config()
const { send, run, json, createError } = require('micro')
const fetch = require('isomorphic-unfetch')
const sanity = require('@sanity/client')

const login = async (req, res) => {
  // TODO: Return values explicty and infer them
  const { code } = await json(req)
  const facebook = await getFacebookToken(code)
  const profile = await getFacebookProfile(facebook.access_token)

  const expires = new Date()
  expires.setSeconds(expires.getSeconds() + facebook.expires_in)

  const sanityUser = await getSanityUser(profile.id, profile.name, expires.toISOString())

  await createUser(sanityUser.token, profile.id, profile.name)

  send(res, 200, {
    token: sanityUser.token,
    image: profile.picture.data.url,
    expire: expires.toISOString()
  })
}

const getFacebookToken = async (code) => {
  const FACEBOOK_REDIRECT_URI = 'http://localhost:3000/callback'
  const url = `https://graph.facebook.com/v3.2/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`
  try {
    const response = await fetch(url)
    return response.json()
  } catch (error) {
    throw createError(error.statusCode, error.statusText)
  }
}

const getFacebookProfile = async (token) => {
  const response = await fetch(`https://graph.facebook.com/me?fields=id,name,picture.width(512)&access_token=${token}`)
  return response.json()
}

const getSanityUser = async (id, name, expires) => {
  const response = await fetch(`https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v1/auth/thirdParty/session`, {
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
  })
  return response.json()
}

const createUser = async (token, id, name) => {
  const client = sanity({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    token: token
  })

  const doc = {
    _type: 'user',
    _id: `e-${id}`,
    username: name
  }

  return client.createIfNotExists(doc)
}

module.exports = (req, res) => run(req, res, login)
