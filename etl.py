# # install API dependency (if needed)
# pip install kaggle
# print(f'Kaggle has been installed!')
# print(f'-')
# import database connection configuration
# must create config.py in project root (currently on .gitignore)
from config import user, password, host, database, param_dic

# import python dependencies
import kaggle
import numpy as np
import os
import pandas as pd
import psycopg2
import psycopg2.extras as extras
from sqlalchemy import create_engine
import sys
import time

# print import status
print(f'Database configuration imported')
print(f'Python dependencies imported')

# record start time for total run time
nb_start = time.time() # measures number of seconds since 1970

# print time record status
print(f'Process start time recorded')
print(f'---')

# Go to https://www.kaggle.com/user_name/account to create API token
# Place kaggle.json (download) into 'C:\Users\computer_name\.kaggle\kaggle.json'
kaggle.api.authenticate()

# print token status
print(f'Kaggle API token loaded')

print(f'Retrieving Brain Weight data from Kaggle...')

# download kaggle dataset (NHL Hockey Data)
# will overwrite local files, if they exist
kaggle.api.dataset_download_files(
    'anubhabswain/brain-weight-in-humans',
    path = '../big-brained-brads/data/',
    unzip = True
)

# print file retrieval status
print(f'Files retrieved!')
print(f'-')

# print import process message
print(f'Begin importing CSV to dataframe...')

# read player_info csv to df
brains_df = pd.read_csv('data/dataset.csv')
brains_df.rename(columns = {
    'Gender' : 'gender',
    'Age Range' : 'age',
    'Head Size(cm^3)' : 'size',
    'Brain Weight(grams)' : 'weight'
}, inplace = True)
brains_df.head(5)

brains_df.dtypes

# create connection function using psycops execute(), also print statuses
def connect(params):
    conn = None
    try:
        print(f'Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
        # create cursor to run query
        cur = conn.cursor()
        # return database version
        cur.execute('SELECT version();')
        # fetch one result
        record = cur.fetchone()
        print('You are connected to -', record)
        # close cursor
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print('Error while connecting to PostgreSQL database', error)
    # close connection
    finally:
        if (conn):
            cur.close()
            conn.rollback()
        return conn

# create connector for pandas.to_sql() method for loading data to database
engine = create_engine(f'postgresql://{user}:{password}@{host}:5432/{database}')

# print connector status
print(f'Database connector created')

# test database connection
conn = connect(param_dic)

# print partition from connection status
print(f'-')

# create schema function with status print
def create_schema(sql_file):
    cursor = conn.cursor()
    try:
        print(f'Creating schema in database using {sql_file}...')
        cursor.execute(open(sql_file, 'r').read())
        print('Schema successfully created!')
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print('Error while creating schema in database', error)
        conn.rollback()
    # close cursor
    cursor.close()

# run SQL file to create schema
create_schema('queries/create_schema.sql')

# to sql function to use pandas to_sql function with status print
def to_sql(df, table):
    start = time.time()
    print(f'Staging {table}...')
    print(f'-')
    try:
        print(f'Loading {table} to the PostgreSQL database...')
        # use pd.to_sql() to set load details
        df.to_sql(
            table, 
            con = engine, 
            schema = 'public', 
            if_exists = 'append',
            index = False
        )
    except (Exception, psycopg2.DatabaseError) as error:
        print(f'Error: %s' % error)
        print(f'-')
        print(f'Load failed.')
        print(f'---')
        return 1
    end = time.time()
    seconds = round((end - start) % 60)
    minutes = round(((end - start) - seconds) / 60)
    print(f'Load successful!  Run Time: {minutes}min {seconds}sec')
    print(f'---')

# print data load status message
print(f'-')
print(f'Begin loading dataframes to the PostgreSQL database.')
print(f'-')

# load df to sql db table (df, table)
to_sql(brains_df, 'brain_weights')

# print process completion message
print(f'-')
print(f'Completed loading dataframes to PostgreSQL database!')

# close database connection
conn.close()

# print connection status
print(f'Connection to PostreSQL database is now closed')
print(f'-')

# record end time for total run time
nb_end = time.time()

# print time record status
print(f'Process end time recorded')
print(f'-')

# calculate, print total run time
nb_seconds = round((nb_end - nb_start) % 60)
nb_minutes = round(((nb_end - nb_start) - nb_seconds) / 60)

# print process end status
print(f'Brain Weight data ETL process completed!  Run Time: {nb_minutes}min {nb_seconds}sec')
print(f'---------------')






































