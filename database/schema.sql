-- Barbearia | MySQL 8.0+ (InnoDB, utf8mb4)
CREATE DATABASE IF NOT EXISTS barbearia CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE barbearia;

CREATE TABLE users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL UNIQUE,
  phone         VARCHAR(20)  NULL,
  password_hash VARCHAR(255) NOT NULL,              -- bcrypt/argon2, nunca senha pura
  role          ENUM('CLIENTE','PROFISSIONAL','ADMIN') NOT NULL DEFAULT 'CLIENTE',
  avatar_url    VARCHAR(255) NULL,
  active        TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE barbers (            -- perfil profissional de um usuário com role PROFISSIONAL
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL UNIQUE,
  bio        VARCHAR(500) NULL,
  specialties VARCHAR(255) NULL,
  active     TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_barber_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE services (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(80) NOT NULL,
  description      VARCHAR(255) NULL,
  duration_minutes SMALLINT UNSIGNED NOT NULL,
  price            DECIMAL(8,2) NOT NULL,
  active           TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE barber_services (    -- quais serviços cada profissional realiza
  barber_id  BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (barber_id, service_id),
  FOREIGN KEY (barber_id)  REFERENCES barbers(id)  ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE availability (       -- expediente semanal; sem linha = folga
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  barber_id   BIGINT UNSIGNED NOT NULL,
  weekday     TINYINT UNSIGNED NOT NULL,           -- 0 = domingo ... 6 = sábado
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  break_start TIME NULL,
  break_end   TIME NULL,
  UNIQUE KEY uq_barber_weekday (barber_id, weekday),
  FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE,
  CHECK (weekday <= 6 AND end_time > start_time)
);

CREATE TABLE time_off (           -- datas específicas indisponíveis
  id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  barber_id BIGINT UNSIGNED NOT NULL,
  off_date  DATE NOT NULL,
  reason    VARCHAR(120) NULL,
  UNIQUE KEY uq_barber_date (barber_id, off_date),
  FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE
);

CREATE TABLE appointments (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id   BIGINT UNSIGNED NOT NULL,
  barber_id   BIGINT UNSIGNED NOT NULL,
  service_id  BIGINT UNSIGNED NOT NULL,
  start_at    DATETIME NOT NULL,
  end_at      DATETIME NOT NULL,
  price       DECIMAL(8,2) NOT NULL,               -- preço congelado no momento da reserva
  status      ENUM('PENDENTE','CONFIRMADO','EM_ATENDIMENTO','CONCLUIDO','CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  notes       VARCHAR(255) NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_barber_time (barber_id, start_at, end_at),
  KEY idx_client (client_id, start_at),
  FOREIGN KEY (client_id)  REFERENCES users(id),
  FOREIGN KEY (barber_id)  REFERENCES barbers(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  CHECK (end_at > start_at)
);

CREATE TABLE notifications (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  message    VARCHAR(255) NOT NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user_unread (user_id, is_read),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  appointment_id BIGINT UNSIGNED NOT NULL UNIQUE,
  rating         TINYINT UNSIGNED NOT NULL,
  comment        VARCHAR(500) NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  CHECK (rating BETWEEN 1 AND 5)
);

-- Regra "um horário não pode ser reservado por duas pessoas": bloqueia sobreposição por profissional.
-- Cancelados não contam, então cancelar libera o horário.
DELIMITER $$
CREATE TRIGGER trg_appt_no_overlap_ins BEFORE INSERT ON appointments FOR EACH ROW
BEGIN
  IF NEW.status <> 'CANCELADO' AND EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.barber_id = NEW.barber_id AND a.status <> 'CANCELADO'
        AND a.start_at < NEW.end_at AND a.end_at > NEW.start_at) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Horário indisponível para este profissional.';
  END IF;
END$$
CREATE TRIGGER trg_appt_no_overlap_upd BEFORE UPDATE ON appointments FOR EACH ROW
BEGIN
  IF NEW.status <> 'CANCELADO' AND EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.barber_id = NEW.barber_id AND a.status <> 'CANCELADO' AND a.id <> NEW.id
        AND a.start_at < NEW.end_at AND a.end_at > NEW.start_at) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Horário indisponível para este profissional.';
  END IF;
END$$
DELIMITER ;
-- Na API: crie o agendamento em transação (START TRANSACTION; SELECT ... FOR UPDATE; INSERT; COMMIT),
-- valide expediente (availability), intervalo e folgas (time_off) antes de inserir.

-- ---------- Dados iniciais (troque os hashes por bcrypt reais) ----------
INSERT INTO users (name,email,phone,password_hash,role) VALUES
 ('Admin','admin@demo.com','11900000000','$2b$10$TROCAR_HASH','ADMIN'),
 ('Rafael Moura','barbeiro@demo.com','11900000001','$2b$10$TROCAR_HASH','PROFISSIONAL'),
 ('Diego Tavares','diego@demo.com','11900000002','$2b$10$TROCAR_HASH','PROFISSIONAL'),
 ('Lucas Prado','lucas@demo.com','11900000003','$2b$10$TROCAR_HASH','PROFISSIONAL'),
 ('João Silva','cliente@demo.com','11900000004','$2b$10$TROCAR_HASH','CLIENTE');
INSERT INTO barbers (user_id,specialties) VALUES (2,'Degradê, Barba'),(3,'Corte clássico, Platinado'),(4,'Corte + Barba, Sobrancelha');
INSERT INTO services (name,description,duration_minutes,price) VALUES
 ('Corte masculino','Tesoura e máquina, finalizado com navalha no pescoço.',45,40.00),
 ('Barba','Toalha quente, navalha e hidratação com óleo.',30,30.00),
 ('Corte + Barba','O pacote completo, com desconto.',75,65.00),
 ('Degradê','Transição precisa, do zero ao topo.',50,45.00),
 ('Sobrancelha','Alinhamento na navalha, sem exagero.',15,15.00),
 ('Platinado','Descoloração com tratamento e matização.',150,180.00);
INSERT INTO barber_services (barber_id,service_id) SELECT b.id,s.id FROM barbers b CROSS JOIN services s;
INSERT INTO availability (barber_id,weekday,start_time,end_time,break_start,break_end)
SELECT b.id,d.wd,'09:00', CASE d.wd WHEN 5 THEN '20:00' WHEN 6 THEN '18:00' ELSE '19:00' END,
       IF(d.wd=6,NULL,'12:00'), IF(d.wd=6,NULL,'13:00')
FROM barbers b CROSS JOIN (SELECT 1 wd UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) d;
