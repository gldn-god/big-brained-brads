from flask import Flask, render_template, request, redirect
import sqlite3 as sql
import pandas as pd

app = Flask(__name__)

@app.route('/', methods = ['POST', 'GET'])
def home():
    if request.method == 'POST':
        try:
            gender = request.form['gender']
            age = request.form['age']
            size = request.form['size']
            weight = request.form['weight']

            with sql.connect("brains.sqlite") as con:
                cur = con.cursor()
                cur.execute("INSERT INTO brain_weights (gender,age,size,weight) VALUES (?,?,?,?)",(gender,age,size,weight))
            
            con.commit()
        
        except:
            con.rollback()

        finally:
            return redirect("/")
            con.close()

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


    # begin bar chart
    brain_df = pd.read_sql_query("select * from brain_weights", con)    

    con.close()

    genders = brain_df['gender'].values.tolist() # x-axis
    ages = brain_df['age'].values.tolist() # x-axis
    sizes = brain_df['size'].values.tolist() # y-axis
    weights = brain_df['weight'].values.tolist()  # y-axis

    return render_template('index.html', females=female, males=male, averageSize=size, averageWeight=weight, genders=genders, ages=ages, sizes=sizes, weights=weights)


@app.route("/tables")  
def tables():  
    con = sql.connect("brains.sqlite")
    con.row_factory = sql.Row
    cur = con.cursor()
    cur.execute("select * from brain_weights")
    rows = cur.fetchall()
    return render_template("tables.html", rows = rows)


if __name__ == '__main__':
   app.run(debug = True)