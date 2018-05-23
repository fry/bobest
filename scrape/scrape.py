from bs4 import BeautifulSoup
import requests
from datetime import datetime
import dateutil.parser
import json

months = "Jan Feb Mar Apr Maj Juni Jul Aug Sep Okt Nov Dec".lower().split(" ")

def parse_string_date(text):
	day, month = text.split(' ')

	now = datetime.now()

	# guess the year
	date = datetime(now.year, months.index(month.lower()) + 1, int(day))

	# if the date is before now, assume it's next year
	if date < now:
		date = datetime(now.year + 1, date.month, date.day)
	
	return date

def parse_date(bs):
	#bs_day = bs.find("p", class_="day").text.split(" ")
	#return datetime(int(bs.find("p", class_="year").text), months.index(bs_day[1].lower()) + 1, int(bs_day[0]))
	return dateutil.parser.parse(bs["data-value"])

def parse_apartment(bs):
	bs_size = bs.find("div", class_='squaremeters')
	bs_floor = bs.find("p", class_="floor")
	bs_rent = bs.find("div", class_="rent rentColumn")
	
	data = {
		'rent': int(bs_rent["data-value"]),
		'area': bs.find("p", class_="area").text,
		'address': bs.find("p", class_="address").text,
		'size': float(bs_size["data-value"]),
		'rooms': bs_size.find_all("p")[1].text,
		'publish_date': parse_date(bs.find("div", class_="publishdate")),
		'move_in_date': parse_date(bs.find("div", class_="moveindate")),
		'photo': bs.find("img", class_="photo")["src"],
		'url': bs.find("a")["href"]
	}

	if bs_floor is not None:
		cleaned_floor = bs_floor.text.strip()
		if len(cleaned_floor) > 0:
			data['floor'] = cleaned_floor

	data["external_id"] = data["url"].split("/")[-1]

	return data

def parse_properties(bs):
	return [{ 'id': bs_p.attrs.get('title'), 'name': bs_p.text } for bs_p in bs.find_all(class_="property")] 

def parse_apartment_page(bs):
	bs_map = bs.find("div", class_="map")
	bs_preconditions = bs.find("div", id="preconditions")
	bs_properties = bs_preconditions.find_next_sibling("div")
	bs_included = bs_properties.find_next_sibling("div")
	bs_floorplan = bs.find("img", class_="floorplan")

	bs_apply_before = bs.find("td", string="Anmäl senast:").find_next_sibling("td")

	data = {
		'position': None,
		
		'preconditions': parse_properties(bs_preconditions),
		'properties': parse_properties(bs_properties),
		'included': parse_properties(bs_included),

		'apply_before': parse_string_date(bs_apply_before.string.strip())
	}

	if bs_floorplan is not None:
		data['photo_floorplan'] = bs_floorplan['src']

	if bs_map is not None:
		data['position'] = {
			'long': bs_map['data-longitude'],
			'lat': bs_map['data-latitude']
		}
	
	return data

def get_basic_apartments(proxies = []):
	headers = {
		'Referer': "https://nya.boplats.se/sok",
		'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
	}

	page_size = 30
	skip = 0
	results = []

	while True:
		data = {
			'skip': skip,	
			'objecttype': 'alla',
			'moveindate': 'any',
			'listtype': 'imagelist',
			'types': '1hand'
		}

		print("Requesting page %s" % skip)
		response = requests.post("https://nya.boplats.se/sok/fragment",
			data = data, headers = headers, proxies=proxies)

		page = response.text
		bs = BeautifulSoup(page, "html.parser")

		current_results = []
		for bs in bs.find_all(class_="item"):
			try:
				data = parse_apartment(bs)
			except Exception as e:
				print("Failed parsing Apartment:")
				print(bs)
				raise
			current_results.append(data)

		results += current_results

		print("  %s results" % len(current_results))

		if len(current_results) < page_size:
			break

		skip += len(current_results)

	return results

def update_full_apartment(apartment, proxies=[]):
	print("Requesting apartment page for %s" % apartment['url'])
	response = requests.get(apartment['url'], proxies=proxies)
	bs = BeautifulSoup(response.text, "html.parser")
	extra_data = parse_apartment_page(bs)
	apartment.update(extra_data)
	return apartment

if __name__ == "__main__":
	# proxy = "http://181.214.1.121:80"
	# proxies = {
	# 	'http': proxy,
	# 	'https': proxy
	# }

	results = get_basic_apartments()

	for apartment in results:
		update_full_apartment(apartment)
		print(json.dumps(apartment))

	print(json.dumps(results))