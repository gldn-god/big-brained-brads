from flask import Flask, render_template, request, flash
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost/DATABASE_NAME'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = 'secret string'

db = SQLAlchemy(app)

class Brain(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    age = db.Column(db.Integer), nullable=False)
    gender = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Integer, nullable=False)
    size = db.Column(db.Integer, nullable=False)

    def __init__(self, age, gender, weight, size):
        self.age = age
        self.gender = gender
        self.weight = weight
        self.size = size
        
@app.route("/", methods=['GET','POST'])
def home():
    return render_template("index.html")
                         
@app.route("/add", methods=['GET','POST'])
def add():
    if request.method == 'POST':
        age = request.form['age']
        gender = request.form['gender']
        weight = request.form['weight']  
        size = request.form['size']  
    
        entry = Brain(age, gender, weight, size)                      
        db.session.add()
        db.session.commit()
        return render_template('add.html')
    else:
        return render_template("index.html") 

  
    
                          
    