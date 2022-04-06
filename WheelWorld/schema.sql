CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    company_name TEXT UNIQUE,
    password TEXT
);


CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    licenceplate TEXT UNIQUE,
    owner_id INTEGER REFERENCES users
);


CREATE TABLE IF NOT EXISTS tires (
    id SERIAL PRIMARY KEY REFERENCES tires,
    tiretype TEXT,
    condition TEXT,
    storage_slot TEXT,
    storage_name TEXT,
    owner_id INTEGER REFERENCES users
    
);


CREATE TABLE IF NOT EXISTS storages (
    id SERIAL,
    storage_name TEXT UNIQUE,
    width TEXT,
    height TEXT,
    free_space INTEGER,
    total_space INTEGER,
    owner_id INTEGER REFERENCES users
);
