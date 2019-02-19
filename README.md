# next-sanity-facebook-auth

Minimal working example, showcasing 3rd party authentication through
Facebook, between a next.js frontend and a Sanity backend.

## Usage

Run `npm install` in all three subfolders: `/api`, `/auth` and `/www`.
Then make sure to add necessary info in `/api/.env`, `/auth/.env` and `/www/.env`.
To run the project:

```bash
cd api/
npm run dev

cd ../www/
npm run dev

cd ../auth/
npm run dev
```

Then you need to set permissions for the documents. In the `/api` folder,
run `node permissions/index.js`.

## Caveats

This is my first time working with oath, cookies and implementing an authentication
flow. So if you see errors, security issues etc. I would love to get some feedback
so this can be corrected. Mail/issues/pull requests/whatever.

There is also no error handling in this sample code (wanted to have the example
as concise as possible), so this should also be added if you are using this.
