CREATE TABLE
	currency (
		id SMALLSERIAL PRIMARY KEY,
		name VARCHAR UNIQUE NOT NULL,
		code CHAR(3) UNIQUE NOT NULL,
		symbol VARCHAR NOT NULL
	);

CREATE TABLE
	account (
		id SMALLSERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		currency_id SMALLINT NOT NULL REFERENCES currency (id),
		balance DECIMAL(12, 2) DEFAULT 0,
		is_primary_payment_method BOOLEAN DEFAULT TRUE,
		firebase_uid VARCHAR NOT NULL
	);

CREATE TABLE
	record (
		id SMALLSERIAL PRIMARY KEY,
		"date" DATE NOT NULL,
		description VARCHAR(255),
		account_id SMALLINT REFERENCES account (id) ON DELETE SET NULL,
		amount DECIMAL(12, 2) DEFAULT 0,
		firebase_uid VARCHAR NOT NULL
	);

CREATE TABLE
	price (
		currency_id SMALLINT NOT NULL REFERENCES currency (id),
		"date" DATE NOT NULL,
		price REAL NOT NULL,
		PRIMARY KEY (currency_id, "date")
	);

CREATE TABLE
	setting (
		firebase_uid VARCHAR UNIQUE NOT NULL,
		primary_currency SMALLINT REFERENCES currency (id) DEFAULT 1
	);