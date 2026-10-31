# Submission

- [Question 1: Two Sum (C#)](Section1/README.md)
- [Question 2: Expense Tracker API](expense-tracker-api/README.md)
- [Postman collection](docs/postmanDocs.json)


# Section 1: Two Sum

## Run
cd Section1/Section1
dotnet run (i used rider)

## Descending list (Descending.cs)
Two pointers, one at each end. If the sum is too big, move left forward
to a smaller number. If it's too small, move right back to a bigger one.
Time O(N), space O(1).

## Unsorted list (Target.cs)
One pass with a dictionary of value -> index. For each number, check if
(K - number) was already seen. Time O(N), space O(N).


# Section 2: Two Sum

## Personal Expense Tracker API

A REST API for logging personal expenses, organising them into categories, and tracking spending. Each user only has access to their own data.

## Features

- Register and login with JWT authentication
- CRUD for expenses (title, amount, category, date, payment method)
- CRUD for expense categories
- Filter expenses by category, date range or payment method
- Sort expenses by date or amount
- Pagination on expense listings
- Spending summary: total spent and total per category
- Monthly budget with an exceeded flag
- JSON report export

## Tech Stack

- Node.js and Express
- PostgreSQL
- Prisma 7 (ORM)
- JSON Web Tokens and bcrypt for auth

## Getting Started

### Prerequisites

- Node.js 22.18 or newer (developed on v24)
- PostgreSQL running locally, or a hosted Postgres URL

### Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create the database:

   ```
   psql -U postgres
   CREATE DATABASE expense_tracker;
   ```

3. Copy `.env.example` to `.env` and fill it in:

   ```
   PORT=4000
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/expense_tracker"
   JWT_SECRET=any_long_random_string
   ```

4. Create the tables and generate the Prisma client:

   ```
   npx prisma migrate dev
   npx prisma generate
   ```

5. Start the server:

   ```
   npm start
   ```

The API runs at `http://localhost:3000/api`.

## Authentication

Register or login to get a token, then send it on every other request:

```
Authorization: Bearer <token>
```

Tokens expire after 7 days.

## Endpoints

All routes are prefixed with `/api`.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Create an account |
| POST | `/auth/login` | No | Login and get a token |
| POST | `/category` | Yes | Create a category |
| GET | `/category` | Yes | List your categories |
| PUT | `/category/:id` | Yes | Rename a category |
| DELETE | `/category/:id` | Yes | Delete a category |
| POST | `/expenses` | Yes | Create an expense |
| GET | `/expenses` | Yes | List expenses (filter, sort, paginate) |
| GET | `/expenses/export` | Yes | Download a JSON report |
| GET | `/expenses/:id` | Yes | Get one expense |
| PUT | `/expenses/:id` | Yes | Update an expense |
| DELETE | `/expenses/:id` | Yes | Delete an expense |
| GET | `/summary` | Yes | Total and per-category spending |
| PUT | `/budget` | Yes | Set your monthly budget |
| GET | `/budget` | Yes | Check this month against your budget |

## Request Examples

**Register**

```json
POST /api/auth/register
{ "username": "grey", "email": "grey@test.com", "password": "123456" }
```

**Login**

```json
POST /api/auth/login
{ "email": "grey@test.com", "password": "123456" }
```

**Create a category**

```json
POST /api/category
{ "name": "Food" }
```

**Create an expense.** `category` is the id of one of your categories, so create a category first.

```json
POST /api/expenses
{
  "title": "Lunch",
  "amount": 2500,
  "category": 1,
  "date": "2026-10-30",
  "paymentMethod": "cash"
}
```

**Update an expense.** Send only the fields you want to change: `title`, `amount`, `categoryId`, `date`, `paymentMethod`.

```json
PUT /api/expenses/1
{ "amount": 3000 }
```

**Set a budget**

```json
PUT /api/budget
{ "monthlyBudget": 50000 }
```

