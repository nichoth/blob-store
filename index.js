const { getHash } = require('@nichoth/multihash')

module.exports = {
    getHash: function (file) {
        return ('&' + getHash(file))
    }
}
