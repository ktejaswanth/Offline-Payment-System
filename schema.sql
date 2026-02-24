
-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP WITHOUT TIME ZONE,
    public_key TEXT
);

-- Table: wallets
CREATE TABLE wallets (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    balance NUMERIC(19, 2) NOT NULL DEFAULT 0.00,
    last_synced_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Table: transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    amount NUMERIC(19, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction_sender FOREIGN KEY (sender_id) REFERENCES users (id),
    CONSTRAINT fk_transaction_receiver FOREIGN KEY (receiver_id) REFERENCES users (id)
);

-- Table: offline_transactions
CREATE TABLE offline_transactions (
    id UUID PRIMARY KEY,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    amount NUMERIC(19, 2) NOT NULL,
    nonce VARCHAR(255) NOT NULL UNIQUE,
    signature VARCHAR(1000) NOT NULL,
    status VARCHAR(50) NOT NULL,
    synced_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_offline_sender FOREIGN KEY (sender_id) REFERENCES users (id),
    CONSTRAINT fk_offline_receiver FOREIGN KEY (receiver_id) REFERENCES users (id)
);
