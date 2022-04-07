from db import db
from flask import request,session,redirect, flash



def create_table_clients():
    table_clients = session["company"] + "_clients"
    sql_create_clients = "CREATE TABLE IF NOT EXISTS {} (id SERIAL PRIMARY KEY, firstname TEXT, lastname TEXT, licenceplate TEXT UNIQUE, owner_id INTEGER REFERENCES users)".format(table_clients)
    db.session.execute(sql_create_clients)
    db.session.commit()
    return True

def get_clients():
    table_clients = session["company"] + "_clients"
    table_tires = session["company"] + "_tires"
    sql_get_clients = "SELECT c.id, c.firstname, c.lastname, c.licenceplate, t.storage_slot, t.storage_name, c.owner_id FROM {} c LEFT JOIN {} t ON t.id = c.id ".format(table_clients, table_tires)
    clients_data = db.session.execute(sql_get_clients)
    clients = clients_data.fetchall()
    return clients 

def add_clients():
        table_clients = session["company"] + "_clients"
        firstname = request.form["firstname"]
        lastname = request.form["lastname"]
        licenceplate = request.form["licenceplate"]

        if firstname == "":
            flash("First name missing", "error_client")  
            return False
        if lastname == "":
            flash("Last name missing", "error_client") 
            return False
        if licenceplate == "":
            flash("Licenceplate missing", "error_client") 
            return False
        licenceplate = licenceplate.upper()            
        try:
            sql = "INSERT INTO {} (firstname, lastname, licenceplate) VALUES (:firstname,:lastname,UPPER(:licenceplate))".format(table_clients)
            db.session.execute(sql,{"firstname":firstname,"lastname":lastname,"licenceplate":licenceplate})
            db.session.commit()
            flash("Client succesfully added!", "succes_client")
        except:
            flash("Licenceplate must be unique.", "error_client") 
            return False
        return True       

def sort_by(sort_by):
    table_clients = session["company"] + "_clients"
    table_tires = session["company"] + "_tires"
    sort_parameter = sort_by
    try:
        sql_sort_by_firstname = "SELECT c.id, c.firstname, c.lastname, c.licenceplate, t.storage_slot, t.storage_name, c.owner_id FROM {} c LEFT JOIN {} t ON t.id = c.id ORDER BY {}".format(table_clients, table_tires, sort_parameter)
        data = db.session.execute(sql_sort_by_firstname)
        result = data.fetchall()
        db.session.commit()
        return result
    except:
        return False


def delete_client(id):
    table_clients = session["company"] + "_clients"
    try:
        delete_from_clients = "DELETE FROM {} WHERE id=:id".format(table_clients)
        db.session.execute(delete_from_clients,{"id":id})
        db.session.commit()
    except:
        return False
    return True
def search(licenceplate):
    try:
        table_clients = session["company"] + "_clients"
        sql_search = "SELECT firstname, lastname, licenceplate FROM {} WHERE licenceplate=:licenceplate".format(table_clients)
        data = db.session.execute(sql_search,{"licenceplate":licenceplate})
        result = data.fetchone()
        return result
    except:
        flash("Client not found", "error_clients")
        return False
