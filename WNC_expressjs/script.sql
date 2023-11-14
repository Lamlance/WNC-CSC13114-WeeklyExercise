use sakila_db;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    pwd VARCHAR(100) NOT NULL
)

CREATE TABLE user_refresh_token (
    refresh_token VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
)