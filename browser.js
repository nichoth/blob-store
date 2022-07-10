const { getHash } = require('@nichoth/multihash/browser')

module.exports = {
    getHash: function (file) {
        return getHash(file).then(hash => '&' + hash)
    }
}

