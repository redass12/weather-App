/*
1-get the location using the geolocation web api
2- get wheather information from the api
3- diplay information on the screen
*/

const modal = document.getElementById('loading');

const getData = async () => {

    modal.style.display = 'flex';
    
    const positionResponse = await fetch('https://geo.ipify.org/api/v1?apiKey=at_s2BFufCtCQyvWaYXpCixy7315g4Ym');
    const position = await positionResponse.json();
    const {lat , lng} = position.location;

    const cityResponse = await fetch(`https://frozen-sea-04552.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong=${lat},${lng}`);
    const city = await cityResponse.json();
    const {woeid,title} = city[0];
    
    const weatherResponse = await fetch(`https://frozen-sea-04552.herokuapp.com/https://www.metaweather.com/api/location/${woeid}`);
    const {consolidated_weather} = await weatherResponse.json();
    
    

    //  console.log(consolidated_weather);

    return {
        title,
        weather: consolidated_weather,
    }

    // displayInfo(title , consolidated_weather)();
}



getData().then(({title , weather}) => {
    modal.style.display = 'none';
    console.log('ddd',weather);
    displayInfo(title, weather)();
});


const displayInfo  = (title , weatherInfo) => {
    // const {applicable_date,weather_state_name,max_temp,min_temp} = weatherInfo;
    // console.log(applicable_date[])
    
    const cityElem = document.getElementById('city');
    // console.log(applicable_date);
    return () => {
        cityElem.innerHTML = title;
       dailyWeatherCard(weatherInfo);
       TodayWeatherInfo(weatherInfo[0]);

    }

}


const dailyWeatherCard = (weatherInfo) => {
    const weaklyItem = document.querySelectorAll('#w-item');
    weaklyItem.forEach((item , index) => {
        let children = item.childNodes;
        console.log(children[2]);
        children[1].innerText = new Date().getUTCDate() +1 == Number(weatherInfo[index+1].applicable_date.slice(8)) ? 'Tomorrow' : weatherInfo[index+1].applicable_date;
        // children[3].src = `/assets/${weatherInfo[index+1].weather_state_name.replace(/\s/g,'')}.png`;
        setImage(children[3],weatherInfo[index+1].weather_state_name);
    })

}

const TodayWeatherInfo = (todayWeather) => {
    const {weather_state_name,the_temp ,applicable_date,wind_speed,humidity,visibility,air_pressure} = todayWeather;

    const todayimg = document.getElementById('todayimg');
    const todayDegree = document.getElementById('todayDegree');
    const todayText = document.getElementById('todayText');
    const todayDate = document.getElementById('todayDate');
    const ws = document.getElementById('ws');
    const hm = document.getElementById('humidity');
    const vs = document.getElementById('visibility');
    const ap = document.getElementById('ap');
    // todayimg.src = `/assets/${todayWeather.weather_state_name.replace(/\s/g,'')}.png`;
    setImage(todayimg,weather_state_name);
    setText([todayDegree,todayText,todayDate,ws,hm,vs,ap],[floatToInt(the_temp),weather_state_name,applicable_date,floatToInt(wind_speed),humidity,floatToInt(visibility),air_pressure]);

}




 

function setText(element ,value) {

    element.forEach((item,index) => {
        item.innerText = value[index];
    })
    
}


function setImage(element , value){
    element.src = `./assets/${value.replace(/\s/g,'')}.png`;
}


function floatToInt(value){
   return Math.floor(Math.round(value));
}