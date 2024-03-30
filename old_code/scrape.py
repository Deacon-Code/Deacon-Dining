from bs4 import BeautifulSoup
import bs4
import requests
from datetime import date, timedelta
import os
from PyPDF2 import PdfReader


def main():
    PIT_URL = "https://dining.wfu.edu/locations/pit-residential-dining-hall/?date="
    NORTH_PIT_URL = "https://dining.wfu.edu/locations/north-dining-hall/?date="
    data_store = []

    today = date.today()
    for i in range(1):
        tomorrow = today + timedelta(days=i)
        next_date_str = tomorrow.strftime("%Y-%m-%d")

        # TEMP_PIT_URL = PIT_URL + next_date_str
        # TEMP_NORTH_PIT_URL = NORTH_PIT_URL + next_date_str
        # current_day_store = []
        # today_food = scrape_a_day(TEMP_PIT_URL, "Pit", next_date_str)
        # current_day_store.append(today_food)
        # today_food = scrape_a_day(TEMP_NORTH_PIT_URL, "North Pit", next_date_str)
        # current_day_store.append(today_food)
        extracted_text = scrape_mag_room(
            "https://dining.wfu.edu/wp-content/uploads/2024/03/mag-room-mar4-7.pdf",
            next_date_str,
            "magroom",
        )
        # print(extracted_text)

        # TODO:
        # data_store.append(current_day_store)

    # print(len(data_store), data_store)
    # Chicken is Buttermilk Fried Chicken
    mac_or_nah(data_store, today)

    # TODO: Figure out how to send messages to my phone via twilio


def mac_or_nah(data_store, today):
    days_of_week = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ]
    for i, day in enumerate(data_store):
        for dining in day:
            if "Macaroni & Cheese" in dining:
                location, time, station = dining["Macaroni & Cheese"]
                correct_date = today + timedelta(days=i)
                date_str = correct_date.strftime("%Y-%m-%d")
                day_of_week = days_of_week[int(correct_date.strftime("%w"))]
                print(
                    f"On {day_of_week} ({date_str}) there is Macaroni & Cheese in {location} during {time} at {station} station"
                )


# TODO: Integrate with pit and north pit data
def scrape_mag_room(pdf_url, date, loc="magRoom"):
    base_path = "recorded_days/"
    output_file_path = base_path + f"{date}_{loc}.txt"

    text = ""
    response = requests.get(pdf_url)
    with open(output_file_path, "w") as f_out:
        with open("temp_pdf.pdf", "wb") as pdf_file:
            pdf_file.write(response.content)
        with open("temp_pdf.pdf", "rb") as file:
            reader = PdfReader(file)
            num_pages = len(reader.pages)
            # TODO: Split by days of the week
            for page_num in range(num_pages):
                page = reader.pages[page_num]
                text += page.extract_text()

        idx_del = text.index("Magnolia Dinner")
        text = text[:idx_del]

        days_of_week = [
            "Monday",
            "Tuesday",
            "Wed",
            "Thursday"
        ]

        for i in range(len(days_of_week) - 1):
            try:
                idx_1 = text.index(days_of_week[i])
                idx_2 = text.index(days_of_week[i + 1])
                day_text = text[idx_1:idx_2]
                day_text = day_text.split("\n")

                print(days_of_week[i].upper())
                for line in day_text[1:-2]:
                    print(line.strip())
                    f_out.write(f"{loc}, {line.strip()}\n")
            except:
                continue
            print()

        idx_1 = text.index("Thursday")
        print("Thursday".upper())
        day_text = text[idx_1:]
        day_text = day_text.split("\n")

        for line in day_text[1:-2]:
            print(line.strip())
            f_out.write(f"{loc}, {line.strip()}\n")

    return text


def scrape_a_day(DINING_URL, loc, date):
    # Output File Format: Date_loc.txt
    base_path = "recorded_days/"
    output_file_path = base_path + f"{date}_{loc}.txt"

    # TODO: Uncomment this out later
    # if os.path.isfile(output_file_path):
    #     return

    food_map = {}
    data = requests.get(DINING_URL).content

    data = BeautifulSoup(data, "html.parser")
    section_items = data.find_all("div", {"class": "c-tab"})
    section_orders = data.find_all("div", {"class": "c-tabs-nav__link-inner"})
    for i, section_order in enumerate(section_orders):
        section_orders[i] = section_order.string

    with open(output_file_path, "w") as f_out:
        for section, section_time in zip(section_items, section_orders):
            menu_stations = section.find_all("div", {"class": "menu-station"})
            for menu_station in menu_stations:
                station = menu_station.find(
                    "h4", {"class": "toggle-menu-station-data"}
                ).string
                for item in menu_station.find_all("a", {"href": "#"}):
                    # print(item.string)
                    if item.string == None:
                        continue
                    food_map[item.string] = (loc, section_time, station)
                    f_out.write(f"{station}, {item.string}, {section_time}\n")

    return food_map


if __name__ == "__main__":
    main()
