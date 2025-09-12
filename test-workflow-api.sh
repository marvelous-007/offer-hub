#!/bin/bash

echo "🎯 DISPUTE RESOLUTION WORKFLOW - COMPLETE TESTING SCRIPT"
echo "========================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test dispute ID
DISPUTE_ID="dispute-test-123"

echo -e "${BLUE}📱 FRONTEND DEMOS:${NC}"
echo "✅ Full Interactive Demo: http://localhost:3000/workflow-demo"
echo "✅ Simple Overview Demo: http://localhost:3000/simple-workflow-demo"
echo ""

echo -e "${BLUE}🔧 BACKEND API TESTING:${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}1. Health Check:${NC}"
curl -s -w "Status: %{http_code}\n" http://localhost:3001/api/workflow/health
echo ""

# Test 2: Create New Workflow
echo -e "${YELLOW}2. Create New Workflow:${NC}"
curl -X POST http://localhost:3001/api/workflow/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "disputeId": "'$DISPUTE_ID'",
    "disputeType": "payment",
    "title": "Payment Dispute Test",
    "description": "Client claims work was not delivered as agreed",
    "amount": 1500.00,
    "currency": "USD",
    "clientId": "client-456",
    "freelancerId": "freelancer-789"
  }' \
  -w "\nStatus: %{http_code}\n"
echo ""

# Test 3: Get Workflow State
echo -e "${YELLOW}3. Get Workflow State:${NC}"
curl -s -w "Status: %{http_code}\n" http://localhost:3001/api/workflow/disputes/$DISPUTE_ID/workflow
echo ""

# Test 4: Transition to Mediator Assignment
echo -e "${YELLOW}4. Assign Mediator:${NC}"
curl -X POST http://localhost:3001/api/workflow/disputes/$DISPUTE_ID/assign-mediator \
  -H "Content-Type: application/json" \
  -d '{
    "mediatorId": "mediator-456",
    "assignedAt": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "notes": "Automated test assignment"
  }' \
  -w "\nStatus: %{http_code}\n"
echo ""

# Test 5: Update Progress
echo -e "${YELLOW}5. Update Progress:${NC}"
curl -X PUT http://localhost:3001/api/workflow/disputes/$DISPUTE_ID/progress \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "mediator_assignment",
    "progressPercentage": 100,
    "notes": "Mediator successfully assigned and notified",
    "updatedBy": "system"
  }' \
  -w "\nStatus: %{http_code}\n"
echo ""

# Test 6: Send Notification
echo -e "${YELLOW}6. Send Notification:${NC}"
curl -X POST http://localhost:3001/api/workflow/disputes/$DISPUTE_ID/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "stage_completed",
    "title": "Mediator Assigned",
    "message": "A mediator has been assigned to your dispute and will contact you within 24 hours.",
    "recipients": ["client", "freelancer"],
    "priority": "medium"
  }' \
  -w "\nStatus: %{http_code}\n"
echo ""

# Test 7: Get Workflow Analytics
echo -e "${YELLOW}7. Get Analytics:${NC}"
curl -s -w "Status: %{http_code}\n" http://localhost:3001/api/workflow/analytics/workflow
echo ""

# Test 8: Get Audit Trail
echo -e "${YELLOW}8. Get Audit Trail:${NC}"
curl -s -w "Status: %{http_code}\n" http://localhost:3001/api/workflow/disputes/$DISPUTE_ID/audit
echo ""

echo -e "${GREEN}✅ Testing Complete!${NC}"
echo ""
echo -e "${BLUE}📋 WHAT TO CHECK:${NC}"
echo "• Frontend demos should show interactive workflow stages"
echo "• Backend should return JSON responses with workflow data"
echo "• All API endpoints should return 200/201 status codes"
echo "• Database should contain workflow records"
echo ""
echo -e "${BLUE}🐛 TROUBLESHOOTING:${NC}"
echo "• If backend returns errors: Check if backend server is running"
echo "• If frontend shows errors: Check browser console for details"
echo "• If database errors: Ensure Supabase is configured correctly"
