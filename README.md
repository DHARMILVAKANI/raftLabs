# RaftLab Practical

This project is a backend API with a focus on using Redis and PostgreSQL as services. The application follows a modular architecture using NestJS.

---

## How to start the project:

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Run the containers for Redis and PostgreSQL

Run the following command to start the Docker containers for Redis and PostgreSQL.

```bash
npm run docker:up
```

**Docker Container Credentials**:

- **PostgreSQL**:
  - DB name: `test`
  - User: `pg`
  - Password: `admin`
  - Port: `5433`
- **Redis**:
  - Port: `6380`

These credentials are defined in the `docker-compose.yml` file.

### Step 3: Create the `.env` file

Create a `.env` file based on the `example.env` file. You can do this by copying the `example.env` and renaming it to `.env`.

```bash
cp example.env .env
```

### Step 4: Run migrations

Run the migrations to set up the necessary database schema:

```bash
npm run migration:run
```

### Step 5: Start the server in development mode

Finally, run the server in development mode:

```bash
npm run start:dev
```

The server will be hosted on port `9000`.

### Step 6: Access the GraphQL Playground

To test your GraphQL queries, open the GraphQL playground by navigating to:

```
http://localhost:9000/graphql
```

### Step 7: Access the Redis Dashboard

```
http://localhost:8081
```

Thank You !
