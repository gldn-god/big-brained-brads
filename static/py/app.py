from flask import Flask, render_template, request, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

app = Flask(__name__)

# create sqlite engine connection
engine = create_engine("sqlite:///data/brains.sqlite", echo = False)
Base = automap_base()
Base.prepare(engine, reflect=True)

#This is the connection to our table
brains =Base.classes.brain_weights


class Brain(db.Model):
    __tablename__ = "brain_weights"
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
    # Create session
    session = Session(engine)
    
    # Form Data
    if request.method == 'POST':
        age = request.form['age']
        gender = request.form['gender']
        weight = request.form['weight']  
        size = request.form['size']  

        # Add form data to database
        entry = Brain(age=age, gender=gender, weight=weight, size=size)                      
        session.add(entry)
        session.commit()
        return render_template('add.html')
    else:
        return render_template("index.html") 
                         
@app.route("/add", methods=['GET','POST'])
def add():
    

if __name__ == '__main__':
    app.run()
    
                          
    