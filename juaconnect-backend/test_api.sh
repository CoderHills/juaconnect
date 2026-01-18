#!/bin/bash
# Test Script for JuaConnect API

BASE_URL="http://localhost:5000/v1"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== JuaConnect API Test Script ===${NC}\n"

# 1. Sign up as Client
echo -e "${BLUE}1. Creating Client Account...${NC}"
CLIENT_RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_client",
    "email": "john@example.com",
    "password": "securepass123",
    "user_type": "client",
    "phone": "0712345678",
    "location": "Nairobi"
  }')

echo $CLIENT_RESPONSE | jq '.'
CLIENT_TOKEN=$(echo $CLIENT_RESPONSE | jq -r '.data.token')
echo -e "${GREEN}Client Token: $CLIENT_TOKEN${NC}\n"

# 2. Sign up as Artisan
echo -e "${BLUE}2. Creating Artisan Account...${NC}"
ARTISAN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_plumber",
    "email": "jane@example.com",
    "password": "securepass123",
    "user_type": "artisan",
    "phone": "0709876543",
    "location": "Nairobi",
    "service_category": "Plumbing",
    "experience_years": 5,
    "bio": "Expert plumber with 5 years experience"
  }')

echo $ARTISAN_RESPONSE | jq '.'
ARTISAN_TOKEN=$(echo $ARTISAN_RESPONSE | jq -r '.data.token')
echo -e "${GREEN}Artisan Token: $ARTISAN_TOKEN${NC}\n"

# 3. Client Creates Service Request
echo -e "${BLUE}3. Client Creating Service Request...${NC}"
REQUEST_RESPONSE=$(curl -s -X POST $BASE_URL/client/requests \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "service_category": "Plumbing",
    "description": "Fix leaking kitchen tap",
    "location": "Westlands, Nairobi",
    "budget": 2000
  }')

echo $REQUEST_RESPONSE | jq '.'
REQUEST_ID=$(echo $REQUEST_RESPONSE | jq -r '.data.id')
echo -e "${GREEN}Request ID: $REQUEST_ID${NC}\n"

# 4. Artisan Views Available Requests
echo -e "${BLUE}4. Artisan Viewing Available Requests...${NC}"
curl -s -X GET $BASE_URL/artisan/available-requests \
  -H "Authorization: Bearer $ARTISAN_TOKEN" | jq '.'
echo ""

# 5. Artisan Accepts Request
echo -e "${BLUE}5. Artisan Accepting Request...${NC}"
ACCEPT_RESPONSE=$(curl -s -X POST $BASE_URL/artisan/requests/$REQUEST_ID/accept \
  -H "Authorization: Bearer $ARTISAN_TOKEN" \
  -H "Content-Type: application/json")

echo $ACCEPT_RESPONSE | jq '.'
echo ""

# 6. Artisan Starts Work
echo -e "${BLUE}6. Artisan Starting Work...${NC}"
START_RESPONSE=$(curl -s -X POST $BASE_URL/artisan/requests/$REQUEST_ID/start \
  -H "Authorization: Bearer $ARTISAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"total_amount": 2000}')

echo $START_RESPONSE | jq '.'
echo ""

# 7. Client Views Bookings
echo -e "${BLUE}7. Client Viewing Bookings...${NC}"
curl -s -X GET $BASE_URL/client/bookings \
  -H "Authorization: Bearer $CLIENT_TOKEN" | jq '.'
echo ""

# 8. Artisan Completes Work
echo -e "${BLUE}8. Artisan Completing Work...${NC}"
curl -s -X POST $BASE_URL/artisan/requests/$REQUEST_ID/complete \
  -H "Authorization: Bearer $ARTISAN_TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# 9. Get Profiles
echo -e "${BLUE}9. Getting Client Profile...${NC}"
curl -s -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $CLIENT_TOKEN" | jq '.'
echo ""

echo -e "${BLUE}10. Getting Artisan Profile...${NC}"
curl -s -X GET $BASE_URL/artisan/profile \
  -H "Authorization: Bearer $ARTISAN_TOKEN" | jq '.'
echo ""

echo -e "${GREEN}=== Test Complete ===${NC}"
