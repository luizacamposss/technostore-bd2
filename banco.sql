-- Criação do banco de dados
CREATE DATABASE techstore;
USE techstore;

-- Criação da tabela de produtos
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(70) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2),
  estoque INT DEFAULT 0
);
