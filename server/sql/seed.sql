USE appliassist_db;

-- Create admin user (password: admin123)
INSERT INTO admins (username,email,password) VALUES ('admin','admin@example.com','$2b$10$Z1Xq0aG1E1nQ1Gv5YyE7AeJHq6GfVwz8lL2zYw3Gv9a1b2c3d4e5');

-- Note: the above hashed password is a placeholder. Run bcrypt.hash('admin123',10) to generate.
