import os
import pymongo
import scrape
import settings

from pymongo import MongoClient
client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DATABASE")]

# ensure index
apartments = db.apartments
apartments.create_index("external_id")

MAX_RETRIES = 5

def store_apartment(apartment):
  apartments.update_one(
    { "external_id": apartment["external_id"]},
    { "$set":  apartment },
    upsert = True)

# Scrape apartments
results = scrape.get_basic_apartments()

full_apartments = []
retries = MAX_RETRIES
for apartment in results:
  try:
    updated_apartment = scrape.update_full_apartment(apartment)
    store_apartment(updated_apartment)
  except KeyboardInterrupt:
    raise
  except:
    print("exception")
    retries -= 1
    if retries >= 0:
      continue
    raise
  else:
    retries = MAX_RETRIES
