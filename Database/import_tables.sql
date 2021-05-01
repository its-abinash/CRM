SET timezone = 'Asia/Kolkata';

CREATE TABLE IF NOT EXISTS conversation (
    sender text,
    receiver text,
    msg text,
    timestamp TIMESTAMPTZ
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
    name text NOT NULL,
    phone text NOT NULL,
    gst text NOT NULL,
    remfreq integer,
    next_remainder date NOT NULL,
    img_data text,
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