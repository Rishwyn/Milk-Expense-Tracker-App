from flask import Flask, request, jsonify, render_template
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/get_costPerLitre')
def get_costPerLitre():
    url = "https://aavin.tn.gov.in/aavin-green-mini-magic"
    source = requests.get(url)
    soup = BeautifulSoup(source.content, "html.parser")
    costPerLitre = str(int(soup.find("td", string="500 ml").find_next("td").text[4:6])*2)
    #return jsonify({"costPerLitre": costPerLitre})
    print(costPerLitre)
    return costPerLitre
    
    
if __name__ == "__main__":
    app.run(debug=True)
    
 
