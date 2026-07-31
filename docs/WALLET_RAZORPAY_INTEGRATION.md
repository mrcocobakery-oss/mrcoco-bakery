# Wallet + Razorpay Integration Guide

## Overview
Complete wallet recharge system integrated with Razorpay payment gateway for seamless top-ups.

## Features Implemented

### 1. Wallet Dashboard
**Location**: `/dashboard/wallet`

**Features**:
- Real-time wallet balance display
- Transaction history with status badges
- Quick stats (Total Recharged, Total Spent, Total Transactions)
- Beautiful gradient UI matching brand colors
- Responsive design for all devices

### 2. Add Money Dialog
**Triggers**: Click "Add Money" button

**Features**:
- Amount input with validation (₹10 - ₹50,000)
- Quick select buttons (₹100, ₹500, ₹1000, ₹2000, ₹5000)
- Current balance display
- Secure payment badge
- Real-time processing state

### 3. Razorpay Integration
**Payment Flow**:
1. User enters recharge amount
2. Backend creates Razorpay order
3. Razorpay checkout modal opens
4. User completes payment
5. Backend verifies payment signature
6. Wallet balance updated instantly
7. Transaction recorded in history

**Security**:
- HMAC SHA256 signature verification
- Secure API endpoints with JWT authentication
- No sensitive data stored in frontend
- Transaction status tracking

## API Endpoints

### 1. Create Recharge Order
```
POST /api/wallet/recharge

Request:
{
  "amount": 500
}

Response:
{
  "success": true,
  "order": {
    "id": "order_xxxxx",
    "amount": 50000,
    "currency": "INR"
  }
}
```

### 2. Verify Payment
```
POST /api/wallet/verify

Request:
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}

Response:
{
  "success": true,
  "message": "Wallet recharged successfully",
  "walletBalance": 1500,
  "amount": 500
}
```

### 3. Get Transactions
```
GET /api/wallet/transactions

Response:
{
  "success": true,
  "transactions": [
    {
      "_id": "...",
      "orderId": "order_xxxxx",
      "userEmail": "user@example.com",
      "amount": 500,
      "status": "completed",
      "type": "recharge",
      "paymentId": "pay_xxxxx",
      "createdAt": "2025-01-31T10:00:00Z",
      "completedAt": "2025-01-31T10:00:30Z"
    }
  ]
}
```

## Database Schema

### Wallet Transactions Collection
```javascript
{
  _id: ObjectId,
  orderId: "order_xxxxx",          // Razorpay order ID
  userEmail: "user@example.com",
  amount: 500,                      // Amount in INR
  status: "completed",              // pending | completed | failed
  type: "recharge",                 // recharge | debit
  paymentId: "pay_xxxxx",          // Razorpay payment ID
  signature: "signature_xxxxx",     // Payment signature
  createdAt: Date,
  completedAt: Date
}
```

### User Collection (Updated)
```javascript
{
  email: "user@example.com",
  walletBalance: 1500,              // Current balance
  // ... other user fields
}
```

## Usage Flow

### For Customers

**Step 1: Access Wallet**
- Go to Dashboard
- Click "Wallet" in sidebar
- View current balance and transaction history

**Step 2: Add Money**
- Click "Add Money" button
- Enter amount or use quick select buttons
- Click "Proceed to Pay"

**Step 3: Complete Payment**
- Razorpay checkout opens
- Choose payment method (Card/UPI/Netbanking/Wallet)
- Complete payment
- Success message appears
- Wallet balance updates instantly

**Step 4: Use Wallet**
- During checkout, select "Wallet" as payment method
- Amount deducted from wallet balance
- Transaction recorded in history

### For Admin
- View customer wallet balances in Admin → Customers
- Monitor wallet transactions
- Track recharge patterns
- Identify high-value customers

## Transaction Status Flow

```
pending → (payment success) → completed
pending → (payment failed) → failed
pending → (user canceled) → failed
```

## Razorpay Configuration

### Environment Variables (.env)
```env
RAZORPAY_KEY_ID=rzp_test_TJeZUPvsEWiIsG
RAZORPAY_KEY_SECRET=sHTi0EN16hsmqm8u3BCcYb7o
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_TJeZUPvsEWiIsG
JWT_SECRET=your-secret-key
```

### Test Cards (Razorpay Test Mode)
```
Success:
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date

Failure:
Card: 4000 0000 0000 0002
```

### Production Checklist
- [ ] Replace test keys with live keys
- [ ] Enable payment methods on Razorpay dashboard
- [ ] Configure webhooks for payment notifications
- [ ] Set up GST and business details
- [ ] Test with real payment methods
- [ ] Implement refund functionality

## UI Components

### Wallet Balance Card
- Large prominent balance display
- Gradient pink background
- Wallet icon
- "Add Money" CTA button

### Transaction Cards
- Color-coded by type (green=credit, red=debit)
- Status badges (completed/pending/failed)
- Timestamp
- Amount with +/- prefix
- Transaction ID

### Recharge Dialog
- Clean modal design
- Amount input with validation
- Quick select amount buttons
- Current balance display
- Secure payment badge
- Cancel and Proceed buttons

## Error Handling

### Validation Errors
- Minimum amount: ₹10
- Maximum amount: ₹50,000
- Amount must be a number
- User must be logged in

### Payment Errors
- Invalid signature → Payment verification failed
- Network error → Failed to initiate recharge
- User canceled → Payment cancelled (info toast)
- Razorpay error → Failed to create order

### Database Errors
- Transaction not found → 404 error
- Failed to update wallet → 500 error
- Duplicate transaction → Already processed

## Security Measures

### 1. Payment Verification
- HMAC SHA256 signature verification
- Order ID validation
- Payment ID verification
- Signature matching with Razorpay key

### 2. Authentication
- JWT token required for all API calls
- User email verification
- Session validation

### 3. Transaction Integrity
- Atomic database operations
- Status tracking (prevent double credit)
- Transaction logs for audit trail

### 4. Amount Validation
- Min/max limits enforced
- Server-side validation
- Decimal precision handling

## Common Issues & Solutions

### Issue 1: Razorpay Script Not Loading
**Symptom**: Checkout doesn't open
**Solution**: Check internet connection, verify Razorpay key

### Issue 2: Payment Success But Balance Not Updated
**Symptom**: Payment completed, wallet unchanged
**Solution**: Check verify endpoint logs, ensure signature validation

### Issue 3: Duplicate Transactions
**Symptom**: Same payment processed twice
**Solution**: Check transaction status before crediting

### Issue 4: Wrong Balance Display
**Symptom**: Balance doesn't match transactions
**Solution**: Recalculate from transaction history

## Testing Guide

### Manual Testing

**Test 1: Successful Recharge**
1. Login to dashboard
2. Go to Wallet page
3. Click "Add Money"
4. Enter ₹500
5. Complete payment with test card
6. Verify balance increased
7. Check transaction history

**Test 2: Failed Payment**
1. Use failure test card
2. Verify error message
3. Check transaction status is "failed"
4. Verify balance unchanged

**Test 3: Canceled Payment**
1. Close Razorpay modal
2. Verify "Payment cancelled" message
3. Check transaction status

**Test 4: Quick Select**
1. Click ₹1000 quick button
2. Verify amount populated
3. Complete payment

### Automated Testing
```javascript
// Test recharge API
const testRecharge = async () => {
  const response = await fetch('/api/wallet/recharge', {
    method: 'POST',
    body: JSON.stringify({ amount: 500 })
  })
  const data = await response.json()
  assert(data.success === true)
  assert(data.order.amount === 50000) // In paise
}
```

## Future Enhancements

### Phase 1
- [ ] Wallet payment option at checkout
- [ ] Auto-recharge when balance low
- [ ] Cashback on recharges
- [ ] Referral bonus to wallet

### Phase 2
- [ ] Wallet-to-wallet transfer
- [ ] Gift wallet balance
- [ ] Scheduled recharges
- [ ] Wallet statements export (PDF)

### Phase 3
- [ ] Multi-currency support
- [ ] Wallet limits by user tier
- [ ] Negative balance (credit line)
- [ ] Interest on wallet balance

## Monitoring & Analytics

### Key Metrics to Track
- Average recharge amount
- Recharge frequency
- Success vs failure rate
- Popular recharge amounts
- Time to complete payment
- User wallet adoption rate

### Dashboard Queries
```javascript
// Get total wallet balance across all users
db.users.aggregate([
  { $group: { _id: null, total: { $sum: "$walletBalance" } } }
])

// Get recharge statistics
db.wallet_transactions.aggregate([
  { $match: { type: "recharge", status: "completed" } },
  { $group: { 
    _id: null, 
    totalAmount: { $sum: "$amount" },
    count: { $sum: 1 }
  }}
])
```

## Support & Troubleshooting

### Customer Support Checklist
- [ ] Verify user is logged in
- [ ] Check wallet balance in database
- [ ] Review transaction history
- [ ] Verify payment in Razorpay dashboard
- [ ] Check signature verification logs
- [ ] Confirm email notifications sent

### Admin Actions
- Manual wallet adjustment (if needed)
- Refund processing
- Transaction reversal
- Account reconciliation

## Compliance & Legal

### Terms of Service
- Wallet balance is non-refundable
- Valid for 12 months from recharge
- No interest on wallet balance
- Cannot be transferred to bank account
- Can be used for purchases only

### Privacy
- Payment info stored by Razorpay (PCI-DSS compliant)
- Transaction history accessible to user
- Balance information private

## Contact for Issues
- Technical Support: Email integration team
- Payment Issues: Contact Razorpay support
- Refunds: Admin panel refund section
