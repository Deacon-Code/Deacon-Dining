const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { DateTime } = require('luxon');

async function main() {
    const PIT_URL = "https://dining.wfu.edu/locations/pit-residential-dining-hall/?date=";
    const NORTH_PIT_URL = "https://dining.wfu.edu/locations/north-dining-hall/?date=";
    const items = [];

    const today = DateTime.local().setZone('America/New_York').startOf('day');
    for (let i = 0; i < 7; i++) {
        const tomorrow = today.plus({ days: i });
        const next_date_str = tomorrow.toFormat('yyyy-MM-dd');

        const TEMP_PIT_URL = PIT_URL + next_date_str;
        const TEMP_NORTH_PIT_URL = NORTH_PIT_URL + next_date_str;

        const pit_food = await scrapeADay(TEMP_PIT_URL, "Pit", next_date_str);
        items.push(...addItems(pit_food, next_date_str));

        const north_pit_food = await scrapeADay(TEMP_NORTH_PIT_URL, "North Pit", next_date_str);
        items.push(...addItems(north_pit_food, next_date_str));
    }

    return items;
}

async function scrapeADay(DINING_URL, loc) {
    const foodMap = {};
    const response = await axios.get(DINING_URL);
    const $ = cheerio.load(response.data);

    // Extract section orders directly
    const section_orders = $('.c-tabs-nav__link-inner').map((i, el) => $(el).text().trim()).get();

    $('.c-tab').each((i, section) => {
        const section_time = section_orders[i]; // Get the corresponding section time
        $(section).find('.menu-station').each((j, menu_station) => {
            const station = $(menu_station).find('.toggle-menu-station-data').text().trim();
            $(menu_station).find('a[href="#"]').each((k, item) => {
                const itemName = $(item).text().trim();
                if (itemName) {
                    foodMap[itemName] = { loc, section_time, station };
                }
            });
        });
    });

    return foodMap;
}



function addItems(dayStore, todayDate) {
    const items = [];
    const currentDateTime = DateTime.now().setZone('America/New_York');
    const formattedDateTime = currentDateTime.toFormat('yyyy-MM-dd\'T\'HH:mm:ss');

    for (const item in dayStore) {
        const { loc, section_time, station } = dayStore[item];
        const time = splitMeal(section_time);
        items.push({
            location: loc,
            item: item,
            date: todayDate,
            station: station,
            time: time,
            dateAdded: formattedDateTime
        });
    }
    return items;
}


function splitMeal(time) {
    
    const split = time.split(' ');
    let meal = "";
    let mealTime = split[split.length - 1];

    if (split.length === 3) { // Late brunch
        meal = `${split[0][0]}${split[0].slice(1).toLowerCase()} ${split[1][0]}${split[1].slice(1).toLowerCase()}`;
    } else if (split.length === 2) { // Regular breakfast, lunch, dinner
        meal = split[0].toLowerCase();
        meal = meal[0].toUpperCase() + meal.slice(1).toLowerCase();
    }
    return `${meal} ${mealTime}`;
}


module.exports = {
    scrapeADay,
    addItems,
    splitMeal,
    main
};
