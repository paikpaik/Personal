const { nanoid } = require('nanoid');

// ObjectId를 대체할 shortId 타입(Mongoose Custom Type)
const shortId = {
  type: String,
  default: () => {
    return nanoid()
  },
  require: true,
  index: true,
}

module.exports = shortId;