CREATE TABLE
	currency (
		id SMALLSERIAL PRIMARY KEY NOT NULL,
		name VARCHAR UNIQUE NOT NULL,
		code CHAR(3) UNIQUE NOT NULL,
		symbol VARCHAR NOT NULL
	);

CREATE TABLE
	account (
		id SMALLSERIAL PRIMARY KEY NOT NULL,
		name VARCHAR(255),
		currency_id SMALLINT REFERENCES currency (id),
		balance DECIMAL(12, 2),
		is_primary_payment_method BOOLEAN DEFAULT TRUE,
		firebase_uid VARCHAR
	);

CREATE TABLE
	record (
		id smallserial PRIMARY KEY NOT NULL,
		"date" DATE NOT NULL,
		description VARCHAR(255),
		account_id SMALLINT NOT NULL REFERENCES account (id),
		amount DECIMAL(12, 2) NOT NULL,
		firebase_uid VARCHAR
	);

CREATE TABLE
	price (
		currency_id SMALLINT REFERENCES currency (id) NOT NULL,
		"date" DATE NOT NULL,
		price REAL NOT NULL,
		PRIMARY KEY (currency_id, "date")
	);

CREATE TABLE
	setting (
		firebase_uid VARCHAR,
		primary_currency SMALLINT NOT NULL REFERENCES currency (id) DEFAULT 1
	);