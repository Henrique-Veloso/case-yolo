# YOLO Coliving - Sistema de Gestão de Pessoas

Este repositório contém a solução desenvolvida para o desafio técnico de Engenharia de Software da YOLO Coliving. Trata-se de uma aplicação Full-Stack construída com uma arquitetura moderna, escalável e 100% *Serverless* hospedada na AWS.

## 🏗️ Arquitetura e Tecnologias

A aplicação foi dividida em microsserviços, garantindo alta disponibilidade e baixo acoplamento:

* **Frontend:** Desenvolvido em **React.js** (via Vite), focado em performance e fidelidade visual ao protótipo (UI/UX) exigido no case.
* **API / Roteamento:** **AWS API Gateway** gerenciando as rotas RESTful e o controle de CORS.
* **Processamento (Backend):** **AWS Lambda** com script em **Python 3**, atuando como o "cérebro" da aplicação para processar as requisições de forma *stateless*.
* **Banco de Dados:** **Amazon DynamoDB**, banco NoSQL de alta performance para armazenamento dos dados.
* **Integração Externa:** Script de importação em Python utilizando a biblioteca `requests` para consumir a API REST de testes da YOLO e popular o DynamoDB inicialmente.

## ✨ Funcionalidades Implementadas

- [x] Integração com API externa para importação de dados iniciais.
- [x] Criação de infraestrutura Serverless na AWS (Lambda, API Gateway, DynamoDB).
- [x] Interface Web (React) fiel ao design de referência.
- [x] **C**RUD Completo (Listar, Criar, Atualizar e Deletar pessoas).
- [x] Filtro dinâmico por "Tipo" de usuário (Hóspede, Proprietário, Operador, Fornecedor).

---
