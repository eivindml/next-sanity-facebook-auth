require('dotenv').config()

const { send, run, json } = require('micro')
const fetch = require('isomorphic-unfetch')
const sanity = require('@sanity/client')

const login = async (req, res) => {
  const { code } = await json(req)
  const FACEBOOK_REDIRECT_URI = 'http://localhost:3000/callback'

  const response = await fetch(`https://graph.facebook.com/v3.2/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`, {
    method: 'GET'
  })

  if (response.ok) {
    const json = await response.json()
    console.log('Success')
    console.log(json.access_token)
    const re = await fetch(`https://graph.facebook.com/me?fields=id,name,picture.width(512)&access_token=${json.access_token}`, {
      method: 'GET'
    })
    if (re.ok) {
      const js = await re.json()
      console.log('sucessfully got me')
      console.log(js)

      const expireDate = new Date()
      expireDate.setSeconds(expireDate.getSeconds() + json.expires_in)

      const a = await fetch(`https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v1/auth/thirdParty/session`, {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${process.env.SANITY_TOKEN_CREATE_SESSION}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Both fields are required
          userId: `e-${js.id}`,
          userFullName: js.name,
          sessionExpires: expireDate.toISOString()
        })
      })
      //
      const sanityUser = await a.json()

      console.log('sanity')
      console.log(sanityUser.token)

      let s = sanity({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET,
        token: sanityUser.token
      })

      const doc = {
        _type: 'user',
        _id: `e-${js.id}`,
        username: js.name
      }

      s.createIfNotExists(doc).then(res => {
        console.log(`User was created, document ID is ${res._id}`)
        console.log(res)
      })

      // TODO: Here we need to create, login user.
      // And set expiry to same as facebook token.

      // TODO: Trenger ikke sende fb token,
      // men send sanity token + expirey date,
      // slik at cookie kan settes.
      send(res, 200, {
        token: sanityUser.token,
        expire: expireDate.toISOString(),
        // token: sanityUser.token,
        image: js.picture.data.url
      })
    }

    send(res, 200, { token: json.access_token })
  } else {
    console.log('Error')
    console.log(response)
    send(res, response.status, 'Error')
  }
  // try {
  //   const response = await fetch(url)
  //   if (response.ok) {
  //     console.log('asdkasdk')
  //     const { id } = await response.json()
  //     send(res, 200, { token: id })
  //   } else {
  //     console.log('doh')
  //     send(res, response.status, response.statusText)
  //   }
  // } catch (error) {
  //   console.log('dohasdasd')
  //   throw createError(error.statusCode, error.statusText)
  // }
}

module.exports = (req, res) => run(req, res, login)
