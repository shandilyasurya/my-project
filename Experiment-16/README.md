# Bank Account Transfer System

A secure money transfer API built with Node.js, Express.js, and MongoDB that implements balance validation and error handling without using database transactions.

## Features

- ✅ **Account Management**: Create and manage user accounts with unique account numbers
- ✅ **Balance Validation**: Check sender's balance before processing transfers
- ✅ **Sequential Updates**: Perform atomic-like operations using sequential database updates
- ✅ **Error Handling**: Comprehensive error handling for various failure scenarios
- ✅ **Rollback Logic**: Automatic rollback if transfer fails partway through
- ✅ **Input Validation**: Validate all inputs including amounts, account numbers, and required fields

## API Endpoints

### 1. Health Check
```
GET /api/health
```
Returns the API status and current timestamp.

### 2. Create User Account
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "accountNumber": "ACC001",
  "balance": 1000
}
```

### 3. Get All Users
```
GET /api/users
```
Returns all user accounts with their current balances.

### 4. Money Transfer (Main Feature)
```
POST /api/transfer
Content-Type: application/json

{
  "fromAccount": "ACC001",
  "toAccount": "ACC002",
  "amount": 500
}
```

### 5. Get Account Balance
```
GET /api/balance/:accountNumber
```
Returns the current balance for a specific account.

## Transfer Logic & Validation

The transfer endpoint implements the following validation and logic:

1. **Input Validation**:
   - All required fields (fromAccount, toAccount, amount) must be provided
   - Amount must be greater than 0
   - Cannot transfer to the same account

2. **Account Verification**:
   - Both sender and receiver accounts must exist
   - Returns specific error messages for missing accounts

3. **Balance Validation**:
   - Checks if sender has sufficient balance before proceeding
   - Returns current balance and requested amount in error response

4. **Sequential Transfer Process**:
   - First: Deduct amount from sender's account
   - Then: Add amount to receiver's account
   - If receiver update fails: Automatically rollback sender's balance

5. **Error Scenarios Handled**:
   - Insufficient balance
   - Account not found (sender or receiver)
   - Invalid transfer amount (≤ 0)
   - Same account transfer attempt
   - Database operation failures

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start MongoDB**:
   Make sure MongoDB is running on `mongodb://localhost:27017`

3. **Run the Server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Run Tests**:
   ```bash
   npm test
   ```

## Testing

The project includes a comprehensive test suite (`test-api.js`) that demonstrates:

- ✅ Creating sample user accounts
- ✅ Successful money transfers
- ✅ Failed transfers due to insufficient balance
- ✅ Failed transfers due to invalid accounts
- ✅ Failed transfers due to invalid inputs
- ✅ Balance verification before and after transfers

### Sample Test Accounts

The test script creates these sample accounts:
- **Alice Johnson** (ACC001): $1,000 initial balance
- **Bob Smith** (ACC002): $500 initial balance  
- **Charlie Brown** (ACC003): $0 initial balance

### Test Scenarios

1. **Successful Transfer**: Alice → Bob ($200)
2. **Insufficient Balance**: Alice → Bob ($2,000) ❌
3. **Invalid Account**: INVALID → Bob ($100) ❌
4. **Same Account**: Alice → Alice ($100) ❌
5. **Invalid Amount**: Alice → Bob ($0) ❌

## Project Structure

```
Experiment-16/
├── models/
│   └── User.js              # User account schema
├── server.js                # Main server file with API endpoints
├── test-api.js              # Comprehensive test suite
├── package.json             # Dependencies and scripts
└── README.md               # This documentation
```

## Key Implementation Details

### Balance Validation Logic
```javascript
// Check if sender has sufficient balance
if (sender.balance < amount) {
  return res.status(400).json({
    success: false,
    message: `Insufficient balance. Available balance: ${sender.balance}`,
    availableBalance: sender.balance,
    requestedAmount: amount
  });
}
```

### Sequential Transfer with Rollback
```javascript
// First, deduct from sender
sender.balance -= amount;
await sender.save();

try {
  // Then, add to receiver
  receiver.balance += amount;
  await receiver.save();
  // Success response...
} catch (receiverError) {
  // If adding to receiver fails, rollback sender's balance
  sender.balance += amount;
  await sender.save();
  throw new Error('Transfer failed during receiver update. Transaction rolled back.');
}
```

## Security Considerations

- Input validation prevents negative amounts and invalid data
- Account existence verification before any operations
- Balance validation prevents overdrafts
- Rollback mechanism ensures data consistency
- Error messages provide helpful information without exposing sensitive data

## Future Enhancements

- Add transaction history logging
- Implement user authentication and authorization
- Add transfer limits and daily limits
- Implement proper database transactions for production use
- Add audit trails for compliance
- Implement rate limiting for API endpoints

## Running the Application

1. Start MongoDB service
2. Run `npm run dev` to start the server
3. The API will be available at `http://localhost:3000`
4. Use the test script or tools like Postman to interact with the API

The application demonstrates secure money transfer logic with proper validation and error handling, ensuring data consistency even without database-level transactions.
