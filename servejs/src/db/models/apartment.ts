import * as mongoose from 'mongoose'

import Property from '../property'

const schema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  external_id: String,
  address: String,
  area: String,
  floor: String,
  position: {
    lat: Number,
    long: Number
  },
  preconditions: [Property],
  included: [Property],
  properties: [Property],
  publish_date: Date,
  move_in_date: Date,
  apply_before: Date,
  rent: Number,
  size: Number,
  rooms: String,
  url: String,
  photo: String,
  photo_floorplan: String
})

export {
  schema as Schema
}

const model = mongoose.model("Apartment", schema, "apartments")

export default model
