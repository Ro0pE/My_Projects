from db import db
from flask import flash, session,request



def create_table_tires():
    table_tires = session["company"] + "_tires"
    table_clients = session["company"] + "_clients"
    sql_create_tires = "CREATE TABLE IF NOT EXISTS {} (id SERIAL PRIMARY KEY REFERENCES {}, tiretype TEXT, condition TEXT, storage_slot TEXT, storage_name TEXT, owner_id INTEGER REFERENCES users)".format(table_tires,table_clients)
    db.session.execute(sql_create_tires)
    db.session.commit()

def get_tires():
    table_tires = session["company"] + "_tires"
    table_clients = session["company"] + "_clients"
    sql_get_tires = "SELECT c.lastname, c.licenceplate, t.tiretype, t.condition, t.storage_slot, t.storage_name FROM {} c, {} t WHERE c.id = t.id".format(table_clients, table_tires)
    tires_data = db.session.execute(sql_get_tires)
    tires = tires_data.fetchall()
    return tires

def add_tires_to_storage():
    try:
        storage_name = request.form["storage_name"]
        licenceplate = request.form["licenceplate"]
        tiretype = request.form["tiretype"]
        condition = request.form["condition"]
        storage_slot = request.form["storageslot"]
        table_clients = session["company"] + "_clients"
        table_storages = session["company"] + "_storages"
        table_tires = session["company"] + "_tires"
        if licenceplate == "":
            flash("Licenceplate is empty", "error_tires")
            return False
        if storage_name == "":
            flash("Give a storage name" , "error_tires")
            return False
        if storage_slot == "":
            flash("Give a storage slot" , "error_tires")
            return False
        licenceplate = licenceplate.upper() 
        storage_slot = storage_slot.upper()
        sql_get_id = "SELECT id FROM {} WHERE licenceplate=:licenceplate".format(table_clients)
        data = db.session.execute(sql_get_id,{"licenceplate":licenceplate})
        owner_id = data.fetchone()
        if owner_id is None:
            flash("Licenceplate not found, check your clients", "error_tires")
            return False
        try:
            try:
                sql_check_tires = "SELECT t.storage_name, t.storage_slot FROM {} c, {} t WHERE t.id = c.id AND c.licenceplate = '{}'".format(table_clients, table_tires,licenceplate)
                data = db.session.execute(sql_check_tires)
                storage = data.fetchone()
                if not storage is None:
                    storage_name = storage[0].replace(session["company"]+"_","")       
                    flash("Tires are already in the system. Storage: {} slot: {}".format(storage_name.upper(),storage[1].upper()), "error_tires")
                    return False
            except:
                return True
            try:
                check = request.form["check"]
                if check == "fix_storage_name":
                    table_storage = storage_name
                if check == "name_is_ok": 
                    table_storage = session["company"]+"_"+storage_name.upper()
                sql_check_storage = "SELECT storage_name FROM {} WHERE storage_name=:storage_name".format(table_storages)
                data = db.session.execute(sql_check_storage,{"storage_name":table_storage})
                result = data.fetchone()
                db.session.commit()
                if result is None:
                    flash("Storage not found. Create a storage?", "error_tires")
                    return False
                else:
                    sql_check_slot = "SELECT storage_slot FROM {} WHERE storage_slot='{}'".format(table_storage,storage_slot)   
                    data = db.session.execute(sql_check_slot)
                    result = data.fetchall()
                    if result == []:
                        flash("Slot not found", "error_tires")
                        return False           
            except:
                flash("Storage doesn't exists", "error_tires")
                return False
            sql_check_storage_slot = "SELECT status FROM {} WHERE storage_slot=:storage_slot".format(table_storage)
            check_data = db.session.execute(sql_check_storage_slot,{"storage_slot":storage_slot})
            check_status = check_data.fetchall()
            status = [storage_stat[0] for storage_stat in check_status] 
            if status[0] == True:         
                flash("slot is taken", "error_tires")
                return False 
            if len(status) == 0:
                return False    
        except:
            return False
        try:    
            sql_add_tires = "INSERT INTO {} (id, tiretype, condition, storage_slot, storage_name) VALUES (:id,:tiretype,:condition,:storageslot, :storagename)".format(table_tires)
            db.session.execute(sql_add_tires,{"tiretype":tiretype, "condition":condition, "storageslot":storage_slot, "id":owner_id[0], "storagename":table_storage})
            db.session.commit()
            flash("Tires added to the system" , "succes_tires")        
        except:       
            return False       
        try:
            sql_insert_storage = "UPDATE {} SET tire_id=:owner_id, status = TRUE WHERE storage_slot=:storage_slot".format(table_storage)
            db.session.execute(sql_insert_storage,{"owner_id":owner_id[0], "storage_slot":storage_slot})
            db.session.commit()          
        except: 
            return False
        try:
            sql_update_storage_space = "UPDATE {} SET free_space = total_space - (SELECT COUNT(status) FROM {} WHERE status = TRUE) WHERE storage_name=:storage_name".format(table_storages,table_storage)
            db.session.execute(sql_update_storage_space,{"storage_name":table_storage})
            db.session.commit()    
        except:
            return False
    except:
        return False

    return True
def delete_from_tires(slot):
    storage_slot = slot
    table_tires = session["company"] + "_tires"
    try:
        sql_delete_from_tires = "DELETE FROM {} WHERE storage_slot=:storage_slot".format(table_tires)
        db.session.execute(sql_delete_from_tires,{"storage_slot":storage_slot})
        db.session.commit()
        return True
    except:        
        return False

def sort_by(sort_by):
    table_clients = session["company"] + "_clients"
    table_tires = session["company"] + "_tires"
    sort_parameter = sort_by
    try:
        sql_sort_tires = "SELECT c.lastname, c.licenceplate, t.tiretype, t.condition, t.storage_slot, t.storage_name FROM {} c, {} t WHERE c.id = t.id ORDER BY {}".format(table_clients, table_tires, sort_parameter)
        data = db.session.execute(sql_sort_tires)
        result = data.fetchall()
        db.session.commit()
        return result
    except:
        return False
def search(licenceplate):
    table_clients = session["company"] + "_clients"
    table_tires = session["company"] + "_tires"

    try:
        sql_search_by_plate = "SELECT c.firstname, c.lastname, t.tiretype, t.condition, t.storage_name, t.storage_slot FROM {} c, {} t WHERE t.id=(SELECT id FROM {} WHERE licenceplate=:licenceplate AND c.licenceplate=:licenceplate)".format(table_clients,table_tires,table_clients)
        data = db.session.execute(sql_search_by_plate,{"licenceplate":licenceplate})
        result = data.fetchone()
        db.session.commit
        return result
    except:
        print('failure')

#SELECT c.firstname, c.lastname, t.tiretype, t.condition, t.storage_name, t.storage_slot FROM toyota_tires t, toyota_clients c  WHERE t.id=(SELECT id FROM toyota_clients WHERE licenceplate = 'KML-489') AND c.licenceplate = 'KML-489';