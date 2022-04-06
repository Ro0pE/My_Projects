from db import db
from flask import redirect, session,request, flash, abort
from werkzeug.security import check_password_hash, generate_password_hash


def create_account_table():
    sql_create_users = "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, company_name TEXT UNIQUE, password TEXT)"
    db.session.execute(sql_create_users)
    db.session.commit()

def create_account():
    print('test')
    company_name = request.form["company"]
    password1 = request.form["password1"]
    password2 = request.form["password2"]
    if company_name == "":
        flash("Company name can't be empty", "error")    
        return False
    if not company_name.isalpha(): # This is important line to avoid sql injections!
        flash("Company name can only contain letters", "error")
        return False
    elif  (password1 == "") | (password2 == ""):
        flash("Password can't be empty", "error")
        return False
    elif password1 != password2:
        flash("Passwords doesn't match", "error")
        return False
    else:
        try:
            password_hash_value = generate_password_hash(password1)
            sql_add_user = "INSERT INTO users (company_name, password) VALUES (:company_name, :password)"
            print(sql_add_user)
            db.session.execute(sql_add_user,{"company_name":company_name, "password":password_hash_value})
            db.session.commit()
            flash("Account created!", "succes")
            return True    
        except:
            flash("Company name already exists", "error")
            return False
            


def verify_user():
    company = request.form["company"]
    password = request.form["password"]
    if company == "":
        flash("Please give a company name", "error")
        return False
    elif password == "":
        flash("Please give a password", "error")
        return False
    else:        
        sql_check_user = "SELECT company_name, password FROM users WHERE company_name=:company_name"
        user_data = db.session.execute(sql_check_user, {"company_name":company})
        user = user_data.fetchone()
        if not user:
            flash("Invalid user" , "error")
            return False
        else:
            hash_value = user.password
            if check_password_hash(hash_value,password):
                
                session["company"] = company
                flash("Password correct" , "succes")
                return True
            else:
                flash("Incorrect password", "error")
                return False
def check_csrf():
    if session["csrf_token"] != request.form["csrf_token"]:
        abort(403)                

def get_company_name():
    company_name = session["company"]
    return company_name

