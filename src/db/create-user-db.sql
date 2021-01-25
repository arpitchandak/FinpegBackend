-- STEPS TO PERFORM BEFORE EXECUTING USER REGISTRATION --

DROP DATABASE IF EXISTS finpegdbfinal;   -- optional
CREATE DATABASE IF NOT EXISTS finpegdbfinal; -- optional  
USE finpegdbfinal; 

DROP TABLE IF EXISTS user; 

CREATE TABLE IF NOT EXISTS user 
  ( 
     id         INT PRIMARY KEY auto_increment, 
     phone      VARCHAR(25) UNIQUE NOT NULL, 
     password   CHAR(60) NOT NULL, 
     name       VARCHAR(50) NOT NULL, 
     email      VARCHAR(100) UNIQUE NOT NULL, 
     role       ENUM('Admin', 'User') DEFAULT 'User',
     status     BOOLEAN NOT NULL DEFAULT 1
  ); 