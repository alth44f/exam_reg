-- ============================================================
-- Exam Registration System - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS exam_reg;
USE exam_reg;

-- ------------------------------------------------------------
-- Table: login_data
-- Stores all users: students, HODs, and college admin accounts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS login_data (
    id          INT           NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)  NOT NULL,
    type        ENUM('student','hod','collage') NOT NULL,
    course      VARCHAR(100)  DEFAULT NULL,
    email       VARCHAR(150)  NOT NULL,
    phone       VARCHAR(15)   DEFAULT NULL,
    aadhar      VARCHAR(20)   DEFAULT NULL,
    gender      VARCHAR(10)   DEFAULT NULL,
    dob         DATE          DEFAULT NULL,
    password    VARCHAR(255)  NOT NULL,
    status      TINYINT(1)    NOT NULL DEFAULT 0,  -- 0 = inactive, 1 = active
    attandance  INT           NOT NULL DEFAULT 0,  -- attendance percentage
    department  VARCHAR(100)  DEFAULT NULL,        -- used for HOD accounts
    PRIMARY KEY (id),
    UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: students
-- Stores certificate numbers and registration numbers for students
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id             INT          NOT NULL AUTO_INCREMENT,
    email          VARCHAR(150) NOT NULL,
    sslc_cer_no    VARCHAR(50)  NOT NULL,
    plustwo_cer_no VARCHAR(50)  NOT NULL,
    reg_no         VARCHAR(50)  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_student_email (email),
    UNIQUE KEY uq_reg_no (reg_no),
    CONSTRAINT fk_students_email FOREIGN KEY (email)
        REFERENCES login_data (email)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: exam
-- Stores exam registrations made by students
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam (
    id             INT           NOT NULL AUTO_INCREMENT,
    email          VARCHAR(150)  NOT NULL,
    reg_no         VARCHAR(50)   NOT NULL,
    second_lang    VARCHAR(100)  DEFAULT NULL,
    sem            INT           NOT NULL,
    paper1         VARCHAR(100)  DEFAULT NULL,
    paper2         VARCHAR(100)  DEFAULT NULL,
    paper3         VARCHAR(100)  DEFAULT NULL,
    paper4         VARCHAR(100)  DEFAULT NULL,
    paper5         VARCHAR(100)  DEFAULT NULL,
    paper6         VARCHAR(100)  DEFAULT NULL,
    paper7         VARCHAR(100)  DEFAULT NULL,
    paper8         VARCHAR(100)  DEFAULT NULL,
    payment_status VARCHAR(20)   NOT NULL DEFAULT 'Pending',
    payment_id     VARCHAR(100)  DEFAULT NULL,
    price          DECIMAL(10,2) DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_exam_email  FOREIGN KEY (email)
        REFERENCES login_data (email)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exam_reg_no FOREIGN KEY (reg_no)
        REFERENCES students (reg_no)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: paper
-- Stores subject/paper details per course and semester
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paper (
    id        INT          NOT NULL AUTO_INCREMENT,
    papername VARCHAR(150) NOT NULL,
    papercode VARCHAR(50)  NOT NULL,
    sem       INT          DEFAULT NULL,
    course    VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: exam_fee
-- Stores the exam fee for each course and semester combination
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_fee (
    id     INT           NOT NULL AUTO_INCREMENT,
    fee    DECIMAL(10,2) NOT NULL,
    course VARCHAR(100)  NOT NULL,
    sem    INT           NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_course_sem (course, sem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
