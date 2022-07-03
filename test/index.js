require('dotenv').config()
const BlobStore = require('../cloudinary')
const cloudinaryUrl = require('../cloudinary/url')
const { getHash } = require('../')
const test = require('tape')
const { scale } = require('@cloudinary/url-gen/actions/resize')

var blobStore
const file = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="

test('get hash for a file', t => {
    const str = getHash(file)
    t.equal(str[0], '&', "should use '&' as the first character in hash")
    t.equal(str, '&GmuzSvBeEBT5tvt1vhtRkhl1a7V8MkTqCxT4Z4jFz_s.sha256',
        'should return the expected hash, url version')
    t.end()
})

test('create a blob store', t => {
    // this wraps the package 'cloudinary'
    // takes the same config object
    blobStore = BlobStore({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    t.ok(blobStore, 'should create a blobStore')
    t.end()
})

var _hash
test('call blobstore.write', t => {
    blobStore.write(file)
        .then(({ hash, response }) => {
            _hash = hash
            console.log('hash', hash)
            t.equal(hash[0], '&',
                'should create a hash string with the expected sigil chracter')
            t.ok(hash.includes('.sha256'),
                'should return hash, and create a sha256 hash as default')
            t.ok(response, 'should return http response')
            const pubId = decodeURIComponent(response.public_id)
            t.equal(pubId, hash, 'should use the hash as filename')
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
        .resize( scale().width(100) )
        .toURL())

    t.ok(url.includes('https'), 'should return an https URL')
    t.ok(url.includes(_hash), 'url should include the right filename')
    t.end()
})
