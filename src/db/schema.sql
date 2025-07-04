CREATE TABLE
	currency (
		id SMALLSERIAL PRIMARY KEY,
		name TEXT UNIQUE NOT NULL,
		code TEXT UNIQUE NOT NULL,
		symbol TEXT NOT NULL
	);

CREATE TABLE
	account (
		id SMALLSERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		currency_id SMALLINT NOT NULL REFERENCES currency (id),
		balance DECIMAL(12, 2) DEFAULT 0,
		is_primary_payment_method BOOLEAN DEFAULT TRUE,
		firebase_uid TEXT NOT NULL
	);

CREATE TABLE
	record (
		id SMALLSERIAL PRIMARY KEY,
		"date" DATE NOT NULL,
		description TEXT,
		account_id SMALLINT REFERENCES account (id) ON DELETE SET NULL,
		amount DECIMAL(12, 2) DEFAULT 0,
		firebase_uid TEXT NOT NULL
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
		firebase_uid TEXT UNIQUE NOT NULL,
		primary_currency_id SMALLINT REFERENCES currency (id) DEFAULT 1
	);

CREATE TABLE
	coin (
		id SMALLSERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		symbol TEXT NOT NULL,
		decimals SMALLINT NOT NULL,
		address TEXT,
		coingecko_api_id TEXT NOT NULL,
	);