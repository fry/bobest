extern crate dotenv;

#[macro_use(bson, doc)]
extern crate bson;
extern crate mongodb;
extern crate juniper;

#[macro_use]
extern crate dotenv_codegen;

use mongodb::db::ThreadedDatabase;
use mongodb::{Client, ThreadedClient};

fn main() {
    println!("Hello, world!");

    let client = Client::with_uri(dotenv!("MONGO_URI")).expect("Failed to initialize mongo client");
    let db = client.db(dotenv!("MONGO_DATABASE"));

    let apartments = db.collection("apartments");

    for result in apartments.find(None, None).unwrap() {
      if let Ok(item) = result {
        if let Some(str) = item.get("external_id") {
          println!("item = {:?}", str);
        }
      }
    }

}
