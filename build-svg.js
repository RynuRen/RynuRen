// const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const OPENWEATHER_API_KEY = "fa80f2a59a4542abd2831a93f238b874"

import { AsyncWeather } from '@cicciosgamino/openweather-apis'
import fs from 'fs'
import formatDistance from 'date-fns/formatDistance/index.js'
import qty from 'js-quantities'
const weather = await new AsyncWeather()

const emojis = {
    '01d': '☀️',
    '02d': '⛅️',
    '03d': '☁️',
    '04d': '☁️',
    '09d': '🌧',
    '10d': '🌦',
    '11d': '🌩',
    '13d': '❄️',
    '50d': '🌫',
    '01n': '🌕',
    '02n': '⛅️',
    '03n': '☁️',
    '04n': '☁️',
    '09n': '🌧',
    '10d': '🌦',
    '11d': '🌩',
    '13d': '❄️',
    '50d': '🌫'
}

// Time working at PlanetScale
function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}
const today = convertTZ(new Date(), "Asia/Seoul");
const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);

const psTime = formatDistance(new Date(2020, 12, 14), today, {
    addSuffix: false
})

// Today's weather
weather.setLang('en')
weather.setCoordinates(37.517235, 127.047325)
weather.setUnits('imperial')
weather.setApiKey(OPENWEATHER_API_KEY)

weather.getAllWeather()
    .then(data => {
        const degF = Math.round(data.main.temp_max)
        const degC = Math.round(qty(`${degF} tempF`).to('tempC').scalar)
        const icon = data.weather[0].icon

        fs.readFile('template.svg', 'utf-8', (error, data) => {
            if (error) {
                console.error(error)
                return
            }

            data = data.replace('{degF}', degF)
            data = data.replace('{degC}', degC)
            data = data.replace('{weatherEmoji}', emojis[icon])
            data = data.replace('{psTime}', psTime)
            data = data.replace('{todayDay}', todayDay)

            data = fs.writeFile('dist/chat.svg', data, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        })
    })
    .catch(error => console.log(error))