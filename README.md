# blob-store

Store blobs in a content-addressed way. This uses [@nichoth/multihash](https://github.com/nichoth/multihash) to create a unique hash for any file.

So far have only implemented a backend via [cloudinary](https://www.npmjs.com/package/cloudinary), but it would be good to implement other backends as well.

## install

```
npm i -S @nichoth/blob-store
```

## example

```js
require('dotenv').config()
const BlobStore = require('@nichoth/blob-store/cloudinary')
const cloudinaryUrl = require('@nichoth/blob-store/cloudinary/url')
const test = require('tape')

test('create a blob store', t => {
    // this wraps the package 'cloudinary'
    // takes the same config object
    const blobStore = BlobStore({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    t.ok(blobStore, 'should create a blobStore')
    t.end()
})

var _hash
test('blobstore.write', t => {
    blobStore.write(file)
        // get a hash here for a given file
        .then(({ hash, response }) => {
            _hash = hash
            t.ok(hash.includes('.sha256'),
                'should return hash, and create a sha256 hash as default')
            t.ok(response, 'should return http response')
            t.equal(response.public_id, hash, 'should use the hash as filename')
            t.end()
        })
        .catch(err => {
            t.fail(err)
            t.end()
        })
})

test('get a URL', t => {
    // this wraps the package '@cloudinary/url-gen'
    // takes the same config object
    const cld = cloudinaryUrl({
        cloud: { cloudName: process.env.CLOUDINARY_CLOUD_NAME },
        url: {
            secure: true // force https, set to false to force http
        }
    })

    const url = (cld
        .image(_hash)
        .toURL())

    console.log(url)
    // => https://res.cloudinary.com/nichoth/image/upload/GmuzSvBeEBT5tvt1vhtRkhl1a7V8MkTqCxT4Z4jFz_s.sha256?_a=ATAMhUk0

    t.ok(url.includes('https'), 'should return an https URL')
    t.ok(url.includes(_hash), 'url should include the right filename')
    t.end()
})
```
