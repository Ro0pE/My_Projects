
from distutils.log import error
from db import db
from flask import flash, session,request


def create_table_storages(): 
    try:
        table_storages = session["company"] + "_storages"
        sql_create_storage = "CREATE TABLE IF NOT EXISTS {} (id SERIAL, storage_name TEXT UNIQUE, width TEXT, height TEXT, free_space INTEGER, total_space INTEGER, owner_id INTEGER REFERENCES users)".format(table_storages)
        db.session.execute(sql_create_storage)
        db.session.commit()
    except:
        return False
def get_storages():
    table_storages = session["company"] + "_storages"
    sql_get_storages = "SELECT id, storage_name, free_space, total_space FROM {}".format(table_storages)
    storages_data = db.session.execute(sql_get_storages)
    storages = storages_data.fetchall()
    return storages

def create_storage():
    table_tires = session["company"] + "_tires"
    storage_name = request.form["storagename"]
    storage_width = request.form["storagewidth"]
    storage_height = request.form["storageheight"]
    if storage_name == "":
        flash("Storage must have a name", "error_storages")
        return False
    if not storage_name.isalpha():
        flash("Storage name can only contain letters", "error_storages")
        return False
    if storage_height == "":
        flash("Storage must have height", "error_storages")
        return False
    if storage_width == "":
        flash("Storage must have width", "error_storages")
        return False      
    try:
        height = int(storage_height)
        width = int(storage_width)
    except:
        flash("Storage width and height must be a numbers")   
        return False
    try:     
        sql_create_storage_slot = "CREATE TABLE {} (id SERIAL PRIMARY KEY, storage_slot TEXT UNIQUE, tire_id INTEGER REFERENCES {}, status BOOL, size TEXT)".format(session["company"]+"_"+storage_name, table_tires)
        db.session.execute(sql_create_storage_slot)
        db.session.commit()
        flash("Storage succesfully created!", "succes_storages")
    except:
        flash("Storage name must be unique,", "error_storages")
        return False
    return True

def create_storage_slots():
    table_storages = session["company"] + "_storages"
    storage_name = request.form["storagename"]
    storage_name = storage_name.upper()
    storage_width = request.form["storagewidth"]
    storage_height = request.form["storageheight"]
    if storage_name == "":
        return False
    try:
        height = int(storage_height)
        width = int(storage_width)
    except:  
        return False 
    space = int(storage_height) * int(storage_width)
    sql_add_storage = "INSERT INTO {} (storage_name, width, height,free_space, total_space) VALUES (:storage_name, :width, :height, :free_space, :total_space)".format(table_storages)
    db.session.execute(sql_add_storage,{"storage_name":session["company"]+"_"+storage_name , "width":storage_width , "height":storage_height , "free_space":space , "total_space":space})
    db.session.commit()
    x = 0
    alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    while x < int(storage_width):       
            y = 1    
            while y <= int(storage_height):
                storage_slot = alphabets[x]  + str(y)
                sql_add_row = "INSERT INTO {} (storage_slot, tire_id, status, size) VALUES (:storage_slot, NULL, FALSE, 'small')".format(session["company"]+"_"+storage_name)
                db.session.execute(sql_add_row,{"storage_slot":storage_slot})
                db.session.commit()
                y = y + 1
            x = x + 1

def show_storages():
    try:
        table_storages = session["company"] + "_storages"
        sql_get_storages = "SELECT storage_name FROM {}" .format(table_storages)
        data = db.session.execute(sql_get_storages)
        storages = data.fetchall()
    except:
        return False
    return storages

def show_specific_storage(storage):
    try:
        storage_name = storage
        table_clients = session["company"] + "_clients"
        sql_get_storage_info = "SELECT t.id, t.storage_slot, t.tire_id, t.status, t.size, c.licenceplate FROM {} t LEFT JOIN {} c ON c.id = t.tire_id ORDER BY t.id" .format(storage_name, table_clients)
        data = db.session.execute(sql_get_storage_info)
        storage_info = data.fetchall()
    except:
        return False
    return storage_info
    
def show_storage_info():
    try:
        table_tires = session["company"] + "_tires"
        table_clients = session["company"] + "_clients"
        storage_name = request.form["storage_name"]
        result = request.form.to_dict()
        owner_id = list(result.keys())[0]
        storage = list(result.values())[0] 
        if (owner_id == "None"):
            storage_slot = str(storage)
            storage_name = storage_name
            information = [False, storage_slot, storage_name]
            return information
        sql_get_storage_info = "SELECT t.storage_slot, c.firstname, c.lastname, c.licenceplate, t.tiretype, t.condition FROM {} t , {} c WHERE c.id=:client_id AND t.id=:tire_id ".format(table_tires, table_clients)
        data = db.session.execute(sql_get_storage_info,{"client_id":owner_id, "tire_id":owner_id})
        storage_information = data.fetchall()
        return owner_id, storage_information, storage, storage_name  
    except:
        return False    

def delete_storage(storage):
    table_tires = session["company"] + "_tires"
    table_storages = session["company"] + "_storages"
    table_to_delete = storage  
    try:
        sql_delete_storage = "DROP TABLE {}".format(table_to_delete)
        db.session.execute(sql_delete_storage)
        db.session.commit()
    except:   
        return False
    try:
        sql_delete_storage_from_storages = "DELETE FROM {} where storage_name=:storage_name".format(table_storages)
        db.session.execute(sql_delete_storage_from_storages,{"storage_name":table_to_delete})
        db.session.commit()
    except:
        return False
    try:
        sql_delete_from_tires = "DELETE FROM {} where storage_name=:storage_name".format(table_tires)    
        db.session.execute(sql_delete_from_tires,{"storage_name":table_to_delete})
        db.session.commit()
    except:
        return False
def delete_from_storage_slot(slot,storage):
    table_storages = session["company"] + "_storages"
    table_tires = session["company"] + "_tires"
    storage_slot = slot
    storage_name = storage
    try:
        try:
            sql_delete_from_storage = "UPDATE {} SET status = FALSE, tire_id = NULL WHERE storage_slot=:storage_slot".format(storage_name)
            db.session.execute(sql_delete_from_storage,{"storage_slot":storage_slot})
            db.session.commit()
        except:
            return False
        try:
            sql_update_storage_space = "UPDATE {} SET free_space = total_space - (SELECT COUNT(status) FROM {} WHERE status = TRUE) WHERE storage_name=:storage_name".format(table_storages,storage_name)
            db.session.execute(sql_update_storage_space,{"storage_name":storage_name})
            db.session.commit()
        except:
            return False
        try:    
            sql_delete_from_tires = "DELETE FROM {} WHERE storage_slot=:storage_slot AND storage_name=:storage_name".format(table_tires)
            db.session.execute(sql_delete_from_tires,{"storage_slot":storage_slot, "storage_name":storage})
            db.session.commit()  
        except:  
            flash("Succesfully cleared storage slot", "succes_storages")
    except:
        flash("Delete failed", "error_storages")

def add_to_storage_slot():
    return "fix_storage_name"

def show_slot_info(id):
    table_clients = session["company"] + "_clients"
    table_tires = session["company"] + "_tires"
    owner_id = id
    if owner_id != None:   
        try:
            sql_storage_slot_info = "SELECT t.storage_slot, c.firstname, c.lastname, c.licenceplate, t.tiretype, t.condition FROM {} t , {} c WHERE c.id=:client_id AND t.id=:tire_id".format(table_tires, table_clients)
            data = db.session.execute(sql_storage_slot_info,{"client_id":owner_id, "tire_id":owner_id})
            storage_information = data.fetchall()
        except:
            return None    
    else:
        return None       
    return storage_information

def sort_by(sort_by):
    table_storages = session["company"] + "_storages"
    sort_parameter = sort_by
    try:
        sql_sort_storages = "SELECT id, storage_name, free_space, total_space FROM {} ORDER BY {}".format(table_storages, sort_parameter)
        data = db.session.execute(sql_sort_storages)
        result = data.fetchall()
        db.session.commit() 
        return result
    except:
        return False     

