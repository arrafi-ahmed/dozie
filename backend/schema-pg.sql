CREATE TABLE club
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    location TEXT,  --updated
    logo     VARCHAR(255)
);

CREATE TABLE app_user
(
    id         SERIAL PRIMARY KEY,
    full_name  VARCHAR(255),
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       SMALLINT CHECK (role IN (10, 20)), -- 10=admin, 20=customer
    club_id    INT REFERENCES club (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE club
    ADD COLUMN created_by INT REFERENCES app_user (id);

CREATE TABLE event
(
    id                 SERIAL PRIMARY KEY,
    name               VARCHAR(100) NOT NULL,
    description        TEXT,
    location           VARCHAR(255),
    ticket_price       INT DEFAULT 0, -- added
    max_attendees      INT,
    registration_count INT,
    start_date         date         NOT NULL,
    end_date           date         NOT NULL,
    banner             VARCHAR(255),
    club_id            INT          NOT NULL REFERENCES club (id) ON DELETE CASCADE,
    created_by         INT          NOT NULL REFERENCES app_user (id)
);
-- added
CREATE TABLE event_stripe
(
    id         SERIAL PRIMARY KEY,
    event_id   INT          NOT NULL REFERENCES event (id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    price_id   VARCHAR(255) --updated
);

CREATE TABLE registration
(
    id                SERIAL PRIMARY KEY,
    registration_data jsonb,   --name, email, phone, others:{...rest}
    registration_time TIMESTAMP WITH TIME ZONE, -- updated
    status            BOOLEAN, -- added
    qr_uuid           VARCHAR(255) UNIQUE NOT NULL,
    event_id          INT                 NOT NULL REFERENCES event (id) ON DELETE CASCADE,
    club_id           INT                 NOT NULL REFERENCES club (id) ON DELETE CASCADE
);
-- added
CREATE TABLE extras
(
    id                SERIAL PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    description       TEXT,
    price             INT,   -- added
    content           jsonb, -- [{name, quantity}]
    stripe_product_id VARCHAR(255),
    stripe_price_id   VARCHAR(255),
    event_id          INT          NOT NULL REFERENCES event (id) ON DELETE CASCADE
);
-- added
CREATE TABLE extras_purchase
(
    id              SERIAL PRIMARY KEY,
    extras_data     jsonb,                       -- [{name, price, content:[{name, quantity}]}]
    status          BOOLEAN,                     -- added // scan status
    qr_uuid         VARCHAR(255) UNIQUE NOT NULL,-- added
    scanned_at      TIMESTAMP DEFAULT NULL,      -- added
    registration_id INT                 NOT NULL REFERENCES registration (id) ON DELETE CASCADE
);

CREATE TABLE form_question
(
    id       SERIAL PRIMARY KEY,
    type_id  SMALLINT NOT NULL,
    text     TEXT     NOT NULL,
    required BOOLEAN  NOT NULL,
    options  jsonb,
    event_id INTEGER REFERENCES event ON DELETE CASCADE
);

CREATE TABLE checkin
(
    id              SERIAL PRIMARY KEY,
    status          BOOLEAN, -- updated
    checkin_time    TIMESTAMP WITH TIME ZONE, -- updated
    registration_id INT NOT NULL REFERENCES registration (id) ON DELETE CASCADE,
    checkedin_by    INT NOT NULL REFERENCES app_user (id) ON DELETE CASCADE
);