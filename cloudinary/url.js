const { Cloudinary } = require('@cloudinary/url-gen')
// const cld = new Cloudinary({
//     cloud: { cloudName: CLOUDINARY_CLOUD_NAME },
//     url: {
//       secure: true // force https, set to false to force http
//     }
// })

module.exports = function (config) {
    return new Cloudinary(config)
}
