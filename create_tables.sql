CREATE
DATABASE ticket_caisse;


-- Actual script
CREATE TABLE raw_ticket
(
    id   serial PRIMARY KEY,
    text varchar(1000)
);
CREATE TABLE ticket
(
    num_order     integer PRIMARY KEY,
    vat           numeric,
    total         numeric,
    raw_ticket_id serial,
    CONSTRAINT fk_raw_ticket FOREIGN KEY (raw_ticket_id) REFERENCES raw_ticket (id) MATCH SIMPLE
);
CREATE TABLE product
(
    id    varchar(10) PRIMARY KEY,
    price numeric,
    label varchar(100)
);


-- Testing script
CREATE TABLE raw_ticket
(
    id   serial PRIMARY KEY,
    text varchar(1000)
);
CREATE TABLE ticket
(
    num_order     integer NOT NULL,
    vat           numeric,
    total         numeric,
    raw_ticket_id serial,
    CONSTRAINT fk_raw_ticket FOREIGN KEY (raw_ticket_id) REFERENCES raw_ticket (id) MATCH SIMPLE
);
CREATE TABLE product
(
    id    varchar(10) NOT NULL,
    price numeric,
    label varchar(100)
);
