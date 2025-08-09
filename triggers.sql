-- ===== TRIGGER UNTUK MENCATAT AKTIVITAS =====

-- Trigger untuk mencatat aktivitas saat menambahkan user baru
DELIMITER //
CREATE TRIGGER tr_users_after_insert
AFTER INSERT ON db_bumdes_semplak_barat.users
FOR EACH ROW
BEGIN
    INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.user_id, 'INSERT', CONCAT('User baru telah ditambahkan: ', NEW.name), NOW());
END //
DELIMITER ;

-- Trigger untuk mencatat aktivitas saat mengupdate user
DELIMITER //
CREATE TRIGGER tr_users_after_update
AFTER UPDATE ON db_bumdes_semplak_barat.users
FOR EACH ROW
BEGIN
    INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.user_id, 'UPDATE', CONCAT('Data user telah diperbarui: ', NEW.name), NOW());
END //
DELIMITER ;

-- Trigger untuk mencatat aktivitas saat menghapus user
DELIMITER //
CREATE TRIGGER tr_users_before_delete
BEFORE DELETE ON db_bumdes_semplak_barat.users
FOR EACH ROW
BEGIN
    INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (OLD.user_id, 'DELETE', CONCAT('User telah dihapus: ', OLD.name), NOW());
END //
DELIMITER ;

-- ===== TRIGGER UNTUK PROPERTI =====

-- Trigger untuk mencatat aktivitas saat menambahkan properti baru
DELIMITER //
CREATE TRIGGER tr_properties_after_insert
AFTER INSERT ON db_bumdes_semplak_barat.properties
FOR EACH ROW
BEGIN
    INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.created_by, 'INSERT', CONCAT('Properti baru telah ditambahkan: ', NEW.name), NOW());
END //
DELIMITER ;

-- Trigger untuk mencatat aktivitas saat mengupdate properti
DELIMITER //
CREATE TRIGGER tr_properties_after_update
AFTER UPDATE ON db_bumdes_semplak_barat.properties
FOR EACH ROW
BEGIN
    -- Mencatat perubahan status properti
    IF NEW.status != OLD.status THEN
        INSERT INTO db_bumdes_semplak_barat.activity_logs 
        (user_id, action, description, created_at)
        VALUES 
        (1, 'UPDATE', CONCAT('Status properti ', NEW.name, ' diubah dari ', OLD.status, ' menjadi ', NEW.status), NOW());
    END IF;
    
    -- Mencatat perubahan harga properti
    IF NEW.price != OLD.price THEN
        INSERT INTO db_bumdes_semplak_barat.activity_logs 
        (user_id, action, description, created_at)
        VALUES 
        (1, 'UPDATE', CONCAT('Harga properti ', NEW.name, ' diubah dari ', OLD.price, ' menjadi ', NEW.price), NOW());
    END IF;
END //
DELIMITER ;

-- ===== TRIGGER UNTUK PRODUK =====

-- Trigger untuk memperbarui stok produk ketika transaksi baru ditambahkan
DELIMITER //
CREATE TRIGGER tr_transaction_items_after_insert
AFTER INSERT ON db_bumdes_semplak_barat.transaction_items
FOR EACH ROW
BEGIN
    -- Jika tipe item adalah produk, kurangi stok
    IF NEW.type = 'product' THEN
        UPDATE db_bumdes_semplak_barat.products
        SET stock = stock - NEW.quantity
        WHERE product_id = NEW.reference_id;
        
        -- Log aktivitas
        INSERT INTO db_bumdes_semplak_barat.activity_logs 
        (user_id, action, description, created_at)
        VALUES 
        (1, 'UPDATE', CONCAT('Stok produk ID:', NEW.reference_id, ' berkurang sebanyak ', NEW.quantity), NOW());
    END IF;
END //
DELIMITER ;

-- Trigger untuk mencatat perubahan status transaksi
DELIMITER //
CREATE TRIGGER tr_transactions_after_update
AFTER UPDATE ON db_bumdes_semplak_barat.transactions
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status THEN
        INSERT INTO db_bumdes_semplak_barat.activity_logs 
        (user_id, action, description, created_at)
        VALUES 
        (NEW.user_id, 'UPDATE', CONCAT('Status transaksi ID:', NEW.transaction_id, ' diubah dari ', 
                                      OLD.status, ' menjadi ', NEW.status), NOW());
    END IF;
END //
DELIMITER ;

-- ===== TRIGGER UNTUK LAPORAN =====

-- Trigger untuk mencatat pembuatan laporan baru
DELIMITER //
CREATE TRIGGER tr_reports_after_insert
AFTER INSERT ON db_bumdes_semplak_barat.reports
FOR EACH ROW
BEGIN
    INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.created_by, 'INSERT', CONCAT('Laporan baru telah dibuat: ', NEW.title, ' (', NEW.type, ')'), NOW());
END //
DELIMITER ;

-- ===== TRIGGER UNTUK UNIT BISNIS =====

-- Trigger untuk mencatat pembuatan unit bisnis baru
DELIMITER //
CREATE TRIGGER tr_businessunits_after_insert
AFTER INSERT ON db_bumdes_semplak_barat.businessunits
FOR EACH ROW
BEGIN
    INSERT INTO db_bumdes_semplak_barat.activity_logs 
    (user_id, action, description, created_at)
    VALUES 
    (NEW.manager_id, 'INSERT', CONCAT('Unit bisnis baru telah dibuat: ', NEW.name), NOW());
END //
DELIMITER ;

-- Trigger untuk mencatat perubahan manager unit bisnis
DELIMITER //
CREATE TRIGGER tr_businessunits_after_update
AFTER UPDATE ON db_bumdes_semplak_barat.businessunits
FOR EACH ROW
BEGIN
    IF NEW.manager_id != OLD.manager_id THEN
        INSERT INTO db_bumdes_semplak_barat.activity_logs 
        (user_id, action, description, created_at)
        VALUES 
        (NEW.manager_id, 'UPDATE', CONCAT('Manager unit bisnis ', NEW.name, ' telah diubah'), NOW());
    END IF;
END //
DELIMITER ;

-- ===== TRIGGER UNTUK VALIDASI DATA =====

-- Trigger untuk validasi data user sebelum insert
DELIMITER //
CREATE TRIGGER tr_users_before_insert
BEFORE INSERT ON db_bumdes_semplak_barat.users
FOR EACH ROW
BEGIN
    -- Validasi email
    IF NEW.email NOT LIKE '%_@%_.__%' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Format email tidak valid';
    END IF;
    
    -- Validasi password (minimal 8 karakter)

END //
DELIMITER ;

-- Trigger untuk validasi harga produk sebelum insert/update
DELIMITER //
CREATE TRIGGER tr_products_before_insert
BEFORE INSERT ON db_bumdes_semplak_barat.products
FOR EACH ROW
BEGIN
    -- Validasi harga (harus positif)
    IF NEW.price <= 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Harga produk harus lebih dari 0';
    END IF;
    
    -- Validasi stok (tidak boleh negatif)
    IF NEW.stock < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Stok produk tidak boleh negatif';
    END IF;
END //
DELIMITER ;

-- Trigger yang sama untuk update produk
DELIMITER //
CREATE TRIGGER tr_products_before_update
BEFORE UPDATE ON db_bumdes_semplak_barat.products
FOR EACH ROW
BEGIN
    -- Validasi harga (harus positif)
    IF NEW.price <= 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Harga produk harus lebih dari 0';
    END IF;
    
    -- Validasi stok (tidak boleh negatif)
    IF NEW.stock < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Stok produk tidak boleh negatif';
    END IF;
END //
DELIMITER ;