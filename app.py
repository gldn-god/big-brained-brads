from flask import Flask, render_template, request
import sqlite3 as sql

app = Flask(__name__)

# @app.route('/', methods = ['POST', 'GET'])
@app.route('/')
def home():
    # if request.method == 'POST':
    #     try:
    #         gender = request.form['gender']
    #         age = request.form['age']
    #         size = request.form['size']
    #         weight = request.form['weight']

    #         with sql.connect("brains.sqlite") as con:
    #             cur = con.cursor()
    #             cur.execute("INSERT INTO brain_weights (gender,age,size,weight) VALUES (?,?,?,?)",(gender,age,size,weight))
            
    #         con.commit()
        
    #     except:
    #         con.rollback()

    #     finally:
    #         return render_template("index.html")
    #         con.close()

    con = sql.connect('brains.sqlite')
    cur = con.cursor()
    countFemales = cur.execute("SELECT COUNT(gender) FROM brain_weights WHERE gender = 'female'")
    female = cur.fetchone()[0]
    countMale = cur.execute("SELECT COUNT(gender) FROM brain_weights WHERE gender = 'male'")
    male = cur.fetchone()[0]
    countSize = cur.execute("SELECT ROUND(AVG(size),1) FROM brain_weights")
    size = cur.fetchone()[0]
    countWeight = cur.execute("SELECT ROUND(AVG(weight),1) FROM brain_weights")
    weight = cur.fetchone()[0]
    con.close()

    return render_template('index.html', females=female, males=male, averageSize=size, averageWeight=weight)

if __name__ == '__main__':
   app.run(debug = True)



# from flask import Flask, render_template, request, flash, jsonify
# from flask_sqlalchemy import SQLAlchemy
# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine, func

# app = Flask(__name__)

# # create sqlite engine connection
# engine = create_engine("sqlite:///data/brains.sqlite", echo = False)
# Base = automap_base()
# Base.prepare(engine, reflect=True)

# #This is the connection to our table
# brains =Base.classes.brain_weights


# class Brain(db.Model):
#     __tablename__ = "brain_weights"
#     id = db.Column(db.Integer, primary_key=True)
#     age = db.Column(db.Integer), nullable=False)
#     gender = db.Column(db.Integer, nullable=False)
#     weight = db.Column(db.Integer, nullable=False)
#     size = db.Column(db.Integer, nullable=False)

#     def __init__(self, age, gender, weight, size):
#         self.age = age
#         self.gender = gender
#         self.weight = weight
#         self.size = size
        
# @app.route("/", methods=['GET','POST'])
# def home():
#     # Create session
#     session = Session(engine)
    
#     # Form Data
#     if request.method == 'POST':
#         age = request.form['age']
#         gender = request.form['gender']
#         weight = request.form['weight']  
#         size = request.form['size']  

#         # Add form data to database
#         entry = Brain(age=age, gender=gender, weight=weight, size=size)                      
#         session.add(entry)
#         session.commit()
#         return render_template('add.html')
#     else:
#         return render_template("index.html") 
                         
# @app.route("/add", methods=['GET','POST'])
# def add():
    

# if __name__ == '__main__':
#     app.run()
    
                          
