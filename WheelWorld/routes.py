import secrets
from app import app
from flask import render_template, request, redirect, session, flash
from itertools import cycle
import users
import clients
import tires
import storages


@app.route("/")
def index():
    if not session.get("company"):
        return render_template("/loginForm.html")
    clients.create_table_clients()
    tires.create_table_tires()
    storages.create_table_storages()
    if not session.get("order"):
        session["order"] = "ASC"
    get_clients = clients.get_clients()
    get_storages = storages.get_storages()
    get_tires = tires.get_tires() 
    
    if session.get("sorted_storages"):
        get_storages = session["sorted_storages"]
        del session["sorted_storages"]  
    if session.get("sorted_clients"):
        get_clients = session["sorted_clients"]
        del session["sorted_clients"]
    if session.get("sorted_tires"):
        get_tires = session["sorted_tires"]
        del session["sorted_tires"]    
    if session.get("get_storage_information"):
        storage_info = session["get_storage_information"]
    else:
        storage_info = []
    if session.get("add_slot_name"):
        add_slot_name = session["add_slot_name"]
        del session["add_slot_name"]
    else:
        add_slot_name = "" 
    if session.get("add_storage_name"):
        add_storage_name = session["add_storage_name"]
    else:
        add_storage_name = ""    
    if session.get("storage_slot_info"):
        slot_info = session["storage_slot_info"]
        del session["storage_slot_info"]
    else:
        slot_info = None    
    if session.get("storage_name"):
        storage_name = session["storage_name"]
        del session["storage_name"]
    else:
        storage_name = None
    return render_template("index.html", clients=get_clients, storages=get_storages, tires=get_tires, slot_info=slot_info, storage_name=storage_name, add_storage_name=add_storage_name, add_slot_name=add_slot_name, storage_info=storage_info) 

@app.route("/loginForm", methods=["GET"])   
def showLoginForm():
    return render_template("/loginForm.html")    

@app.route("/createAccount", methods=["GET","POST"])   
def createAccount():
    if request.method == "GET":
        users.create_account_table()
        return render_template("/createAccountForm.html")
    if users.create_account() is False:
        return redirect("/createAccount") 
    return redirect("/loginForm")         
    

@app.route("/login", methods=["POST"])
def login():
    user = users.verify_user()
    if not user:
        return redirect("/loginForm")
    else:
        session["csrf_token"] = secrets.token_hex(16)
        return redirect("/")

@app.route("/logout")
def logout():
    session.pop("_flashes", None)
    del session["company"]
    return redirect("/loginForm") 

@app.route("/addClients", methods=["POST"])
def addClient():
    users.check_csrf()
    if clients.add_clients() is True:
         return redirect("/")
    else:
        return redirect("/")
@app.route("/delete_client", methods=["POST"])
def delete_client():
    id = request.form["id"]
    storage = request.form["storage"]
    slot = request.form["slot"]
    if storage == "None":
        clients.delete_client(id)
    else:
        storages.delete_from_storage_slot(slot,storage)  
        clients.delete_client(id)
  
    return redirect("/")


@app.route("/createStorage", methods=["POST"])
def createStorage():
    users.check_csrf()
    if storages.create_storage():
        storages.create_storage_slots()
        return redirect("/")
    return redirect("/")

@app.route("/addTires", methods=["POST"])
def addTires():
    users.check_csrf()
    check = request.form["check"]
    if tires.add_tires_to_storage() is False:
        if(check == "fix_storage_name"):
            return redirect("/showStorages")
        return redirect("/")
    return redirect("/")

@app.route("/showStorages", methods=["GET"])
def showStorages():
    get_storages = storages.get_storages()
    company = session["company"]
    new_storage_names = []
    for storage in get_storages:
        new_name = storage[1].replace(company+"_","")
        new_storage_names.append(new_name)
    storage_list = zip(get_storages,cycle(new_storage_names))
    return render_template("showStorages.html", storage_list=storage_list)

    

@app.route("/deleteFromStorageSlot", methods=["POST"])
def deleteFromStorageSlot():
    slot = request.form["delete"]
    storage = request.form["storage_name"]
    storages.delete_from_storage_slot(slot,storage)
    tires.delete_from_tires(slot)
    return redirect("/")

@app.route("/delete_storage", methods=["POST"])
def delete_storage():
    storage = request.form["storage_name"]
    storages.delete_storage(storage)
    return redirect("/")            

@app.route("/sort_clients", methods=["GET"])
def sort_clients():
    sort_method = request.args.get("sort_clients")
    sort_by = ""
    order = "" 
    if session["order"] == "ASC":
        order = "ASC"
        session["order"] = "DESC"
    else:
        order = "DESC"
        session["order"] = "ASC"
    if sort_method == "Firstname":
        sort_by = "c.firstname " + order
        clients_list = clients.sort_by(sort_by)
    elif sort_method == "Lastname": 
        sort_by = "c.lastname " + order
        clients_list = clients.sort_by(sort_by)
    elif sort_method == "Licenceplate":
        sort_by = "c.licenceplate " + order
        clients_list = clients.sort_by(sort_by)  
    elif sort_method == "ID":
        sort_by = "c.id " + order
        clients_list = clients.sort_by(sort_by)   
    elif sort_method == "Storage slot":
        sort_by = "t.storage_slot " + order
        clients_list = clients.sort_by(sort_by) 
    elif sort_method == "Storage name":
        sort_by = "t.storage_name " + order
        clients_list = clients.sort_by(sort_by)            
    if (clients_list != 0):  
        sorted_list = []
    for row in clients_list:
        sorted_list.append(dict(row))
    session["sorted_clients"] = sorted_list  
    return redirect("/")

@app.route("/sort_tires", methods=["GET"])
def sort_tires():
    sort_method = request.args.get("sort_tires")
    sort_by = ""
    order = ""
    if session["order"] == "ASC":
        order = "ASC"
        session["order"] = "DESC"
    else:
        order = "DESC"
        session["order"] = "ASC"    
    if sort_method == "Owner":
        sort_by = "c.lastname " + order
        tires_list = tires.sort_by(sort_by)
    elif sort_method == "Licenceplate":
        sort_by = "c.licenceplate " + order 
        tires_list = tires.sort_by(sort_by)  
    elif sort_method == "Storage slot":
        sort_by = "t.storage_slot " + order   
        tires_list = tires.sort_by(sort_by)
    elif sort_method == "Condition":
        sort_by = "t.condition " + order   
        tires_list = tires.sort_by(sort_by)
    elif sort_method == "Storage name":
        sort_by = "t.storage_name " + order   
        tires_list = tires.sort_by(sort_by)
    elif sort_method == "Tire type":
        sort_by = "t.tiretype " + order   
        tires_list = tires.sort_by(sort_by)                   
    if (tires_list != 0):  
        sorted_list = []
    for row in tires_list:
        sorted_list.append(dict(row))
    session["sorted_tires"] = sorted_list  
    return redirect("/")

@app.route("/sort_storages", methods=["GET"])
def sort_storages():
    sort_method = request.args.get("sort_storages")
    sort_by = ""
    order = ""
    if session["order"] == "ASC":
        order = "ASC"
        session["order"] = "DESC"
    else:
        order = "DESC"
        session["order"] = "ASC"    
    if sort_method == "Id":
        sort_by = "id " + order
        storages_list = storages.sort_by(sort_by)
    elif sort_method == "Storage name":
        sort_by = "storage_name " + order 
        storages_list = storages.sort_by(sort_by)  
    elif sort_method == "Free space":
        sort_by = "free_space " + order   
        storages_list = storages.sort_by(sort_by)
    elif sort_method == "Total space":
        sort_by = "total_space " + order   
        storages_list = storages.sort_by(sort_by)
    if (storages_list != 0):  
        sorted_list = []
    for row in storages_list:
        sorted_list.append(dict(row))
    session["sorted_storages"] = sorted_list  
    return redirect("/")    
    
@app.route("/show_storage", methods=["POST"])
def show_storages():
    storage_name = request.form["show_storage"]
    session["storage_name"] = storage_name
    storage_information = storages.show_specific_storage(storage_name)
    if (storage_information != 0):  
        get_storage_information = []
        for row in storage_information:
            get_storage_information.append(dict(row))
        session["get_storage_information"] = get_storage_information    
    return redirect("/")

@app.route("/show_slot_info" , methods=["POST"])
def show_slot_info():
    slot_name = request.form["slot_name"]
    storage_name = request.form["storage_name"]
    id = request.form["id"]
    storage_slot_info = storages.show_slot_info(id)
    if (storage_slot_info is None):
        session["add_storage_name"] = storage_name
        session["add_slot_name"]  = slot_name
        return redirect("/")
    for row in storage_slot_info:
        row_as_dict = dict(row)
    session["storage_slot_info"] = row_as_dict
    session["storage_name"] = storage_name
    session["add_slot_name"] = slot_name
    return redirect("/")
 
@app.route("/close_storage", methods=["GET"])
def close_storage():
    del session["get_storage_information"]
    return redirect("/")

           

       

 
