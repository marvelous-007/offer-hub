# 🚀 OFFER-HUB Backend

Backend for **OFFER-HUB**, a blockchain-based freelance services platform using Stellar.

---

## 📌 **Prerequisites**

- **Node.js** (LTS recommended)
- **NPM** or `yarn`
- **Docker & Docker Compose**

---

## ⚡ **Setup & Installation**

### 1️⃣ **Clone the repository**
```sh
git clone https://github.com/user/offer-hub.git  
cd offer-hub/backend  
```

### 2️⃣ **Install dependencies**
```sh
npm install  
```

### 3️⃣ **Set up environment variables**
Create a `.env` file in `backend/` with:
```typescript
DATABASE_HOST=offer_hub_database
DATABASE_PORT=5432
DATABASE_USER=offerhub_admin
DATABASE_PASSWORD=offerhub_pass
DATABASE_NAME=offer_hub_database
DOCKER_ENV=true
PORT=3002
HASURA_GRAPHQL_DATABASE_URL=postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}
HASURA_GRAPHQL_ADMIN_SECRET=offerhub_secret
```

---

## 🛠 **Starting Backend & Database**

### 1️⃣ **Start Database & Hasura**
```sh
docker-compose up --build -d  
```

### 2️⃣ **Verify Database**
```sh
docker logs offer_hub_database  
```

### 3️⃣ **Run Backend**
```sh
npm run start:dev  
```

To run in production:
```sh
npm run start  
```

---

## ✅ **Useful Commands**

| Command                     | Description                     |
|-----------------------------|---------------------------------|
| `npm install`               | Install dependencies           |
| `npm run start:dev`         | Start backend (dev mode)       |
| `npm run start`             | Run backend (production)       |
| `docker-compose up -d`      | Start database & Hasura        |
| `docker logs offer_hub_database` | Check database logs |
| `npm run docker:down`       | Stop all Docker containers     |
| `npm run migrations:run`    | Apply database migrations      |
| `npm run migrations:revert` | Revert last migration         |

---

## 🎯 **Next Steps**

- Set up **GraphQL APIs** in Hasura
- Configure **authentication & authorization**
- Implement **Stellar blockchain transactions**

🚀 **OFFER-HUB** development in progress! 🚀
