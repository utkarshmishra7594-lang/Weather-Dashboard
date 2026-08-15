import os
import requests
from flask import Flask,render_template
app=Flask(__name__)
@app.route('/')
def home():
    return render_template('index.html')


@app.route("/weather/<city>")
def weather(city):

    api_key = os.environ.get("OPENWEATHER_API_KEY")

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

    response = requests.get(url)
    data = response.json()

    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric"
    
    forecast_response = requests.get(forecast_url)
    forecast_data = forecast_response.json()

    print(response.status_code)
    print(data)

    if response.status_code != 200:
        return {"error": "City not found"}
    return {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "condition": data["weather"][0]["main"],
        "feels_like": data["main"]["feels_like"],
        "min_temp": data["main"]["temp_min"],
        "max_temp": data["main"]["temp_max"],
        "wind": data["wind"]["speed"],
        "pressure": data["main"]["pressure"],
        "visibility": data["visibility"] / 1000,

        "forecast": [ 
            {
                "date": item["dt_txt"],
                "temp": item["main"]["temp"],
                "condition": item["weather"][0]["main"]
            }
            for item in forecast_data["list"][::8]
        ],

        "hourly": [
            {
                "time": item["dt_txt"],
                "temp": item["main"]["temp"],
                "condition": item["weather"][0]["main"]
            }
            for item in forecast_data["list"][:8]
        ]

    }

   

@app.route("/weather/location/<lat>/<lon>")
def weather_location(lat, lon):

    api_key = os.environ.get("OPENWEATHER_API_KEY")

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"

    response = requests.get(url)
    data = response.json()
    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    forecast_response = requests.get(forecast_url)
    forecast_data = forecast_response.json()

    

    if response.status_code != 200:
        return {"error": "Location not found"}

    return {
    "city": data["name"],
    "temperature": data["main"]["temp"],
    "humidity": data["main"]["humidity"],
    "condition": data["weather"][0]["main"],
    "feels_like": data["main"]["feels_like"],
    "min_temp": data["main"]["temp_min"],
    "max_temp": data["main"]["temp_max"],
    "wind": data["wind"]["speed"],
    "pressure": data["main"]["pressure"],
    "visibility": data["visibility"] / 1000,
    "forecast": [
        {
            "date": item["dt_txt"],
            "temp": item["main"]["temp"],
            "condition": item["weather"][0]["main"]
        }
        for item in forecast_data["list"][::8]
    ]
}





if __name__=='__main__':
    app.run(debug=True)
    
