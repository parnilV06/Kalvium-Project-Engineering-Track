## Scope Cut

1. Payments  
Handling real money introduces security and legal complexity, not needed for MVP.

2. Live Chat  
Real-time communication adds backend complexity and is not critical for basic transactions.

3. Delivery System  
The product is designed for in-person handoff, so delivery tracking is unnecessary.

## MVP Features

1. List Item  
Users can add items with name and description.

2. View Items  
Users can see all available items.

3. Claim Item  
Users can claim an item, changing its status to reserved.

## Acceptance Criteria

1. Given an item is available  
   When a user clicks Claim  
   Then the item status becomes "Reserved" and is unavailable to others

2. Given an item is already reserved  
   When another user tries to claim  
   Then they see "Item not available"

3. Given a user has claimed an item  
   When they do not confirm within the timeout  
   Then the item becomes available again
