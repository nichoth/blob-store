let cloudinary = require("cloudinary").v2;
const { getHash } = require('@nichoth/multihash')

module.exports = function createCloudinary (config) {
    cloudinary.config(config)

    return {
        write: function (file, hash) {
            hash = hash || getHash(file)
            var slugifiedHash = encodeURIComponent('' + hash)

            return new Promise(function (resolve, reject) {
                cloudinary.uploader.upload(file, {
                    public_id: slugifiedHash
                }, function (err, res) {
                    if (err) return reject(err)
                    resolve({ hash: slugifiedHash, response: res })
                })
            })
        }
    }
}
