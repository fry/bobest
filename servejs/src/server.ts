import app from './app'
import db from './db'

const port = process.env.PORT || 3000

db.connect()

app.listen(port, (err: Error) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})