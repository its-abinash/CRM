SET timezone = 'Asia/Kolkata';

CREATE TABLE IF NOT EXISTS conversation (
    sender text,
    receiver text,
    msg text,
    timestamp text
);
CREATE TABLE IF NOT EXISTS credentials (
    email text NOT NULL,
    password text NOT NULL,
    passcode text,
    is_admin boolean,
    PRIMARY KEY (email)
);
CREATE TABLE IF NOT EXISTS customer (
    email text NOT NULL,
    name text,
    firstname text,
    lastname text,
    phone text,
    gst text,
    remfreq integer,
    next_remainder text,
    PRIMARY KEY (email)
);
CREATE TABLE IF NOT EXISTS users_map (
    id SERIAL,
    user_id1 text,
    user_id2 text,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id1) REFERENCES customer (email),
    FOREIGN KEY (user_id2) REFERENCES customer (email)
);
CREATE TABLE IF NOT EXISTS public.media
(
    id serial NOT NULL,
    email text NOT NULL,
    imagename text,
    size text,
    type text,
    image text,
    lastmodified text,
    PRIMARY KEY (id),
    CONSTRAINT email FOREIGN KEY (email)
        REFERENCES public.customer (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);
