<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Product Microservice
Run dev environment
1. Clone repository
2. Run and install dependencies
    ```bash
    # Install dependecies
    npm install
    ```
3. Create ```.env``` file based on ```.env.template```
4. Run migrations
    ```bash
    # Prisma migrations
    npx prisma migrate dev
    ```
5. Run following command
    ```bash
    # Start app
    npm run start:dev
    ```