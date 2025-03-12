
# STEP 1
-Clone the Repository


 # STEP 2
- Load the .env for each service as followed

 -------- api_gateway .env ------
AUTH_SERVICE_URL=http://localhost:3001
WALLET_SERVICE_URL=http://localhost:3002
PAYMENT_SERVICE_URL=http://localhost:3003
TRANSACTION_SERVICE_URL=http://localhost:3004

-------- auth_service .env ------
AUTH_SERVICE_PORT=3001
WALLET_SERVICE_URL=http://localhost:3002
MONGO_URI=mongodb+srv://<mongo_username>:<mongo_password>@atlascluster.4wgmr.mongodb.net/<database>
JWT_SECRET=uurueu7595959jfjjgjgg
PAYSTACK_PRIVATE_KEY=<your_paystack_secret_key>

-------- payment_service .env ------
PAYMENT_SERVICE_PORT=3003
AUTH_SERVICE_URL=http://localhost:3001
WALLET_SERVICE_URL=http://localhost:3002
MONGO_URI=mongodb+srv://<mongo_username>:<mongo_password>@atlascluster.4wgmr.mongodb.net/<database>
PAYSTACK_PRIVATE_KEY=<your_paystack_secret_key>

-------- wallet_service .env ------
WALLET_SERVICE_PORT=3002
AUTH_SERVICE_URL=http://localhost:3001
PAYMENT_SERVICE_URL=http://localhost:3003
MONGO_URI=mongodb+srv://<mongo_username>:<mongo_password>@atlascluster.4wgmr.mongodb.net/<database>

# STEP 3
- cd (cd <folder-name>) into all the sub-folders and run command
 (
    npm install
    npm run start:dev

 )
 for each of the folders