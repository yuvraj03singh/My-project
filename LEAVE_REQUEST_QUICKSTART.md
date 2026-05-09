# 🎫 Quick Start - Leave Request Feature

## 🚀 How to Test in 5 Minutes

### Step 1: Start Backend Server

```bash
cd backend
npm install  # if needed
npm run dev
```

✅ Backend running on `http://localhost:5000`

---

### Step 2: Test with Postman

#### **As Employee: Create Leave Request**

```
POST http://localhost:5000/api/leave
Authorization: Bearer {EMPLOYEE_TOKEN}

{
  "leaveType": "Sick Leave",
  "startDate": "2026-05-15",
  "endDate": "2026-05-17",
  "reason": "Medical appointment"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Leave request submitted successfully",
  "data": {
    "_id": "...",
    "leaveType": "Sick Leave",
    "status": "Pending",
    "numberOfDays": 3,
    "employee": { "fullName": "John Doe" }
  }
}
```

---

#### **As Employee: View My Requests**

```
GET http://localhost:5000/api/leave/my-requests
Authorization: Bearer {EMPLOYEE_TOKEN}
```

**Response:** List of all employee's leave requests

---

#### **As Admin: View All Pending Requests**

```
GET http://localhost:5000/api/leave?status=Pending
Authorization: Bearer {ADMIN_TOKEN}
```

**Response:** Table of all pending requests from all employees

---

#### **As Admin: Approve Leave Request**

```
PATCH http://localhost:5000/api/leave/{LEAVE_ID}/approve
Authorization: Bearer {ADMIN_TOKEN}

{}
```

**Response:**

```json
{
  "success": true,
  "message": "Leave request approved successfully",
  "data": { "status": "Approved" }
}
```

---

#### **As Admin: Reject Leave Request**

```
PATCH http://localhost:5000/api/leave/{LEAVE_ID}/reject
Authorization: Bearer {ADMIN_TOKEN}

{
  "rejectionReason": "Leave balance insufficient"
}
```

---

#### **As Employee: Cancel Leave Request**

```
PATCH http://localhost:5000/api/leave/{LEAVE_ID}/cancel
Authorization: Bearer {EMPLOYEE_TOKEN}

{}
```

---

## 📋 Integration in Frontend

### Add to Employee Dashboard

```jsx
import NewLeaveRequest from "./components/NewLeaveRequest";
import MyLeaveRequests from "./components/MyLeaveRequests";

export default function EmployeeDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>

      {/* New Request Button */}
      <div className="mb-6">
        <NewLeaveRequest
          onRequestSubmitted={() => setRefreshKey((prev) => prev + 1)}
        />
      </div>

      {/* My Leave Requests */}
      <MyLeaveRequests key={refreshKey} />
    </div>
  );
}
```

### Add to Admin Dashboard

```jsx
import AdminLeaveRequests from "./components/AdminLeaveRequests";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminLeaveRequests />
    </div>
  );
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Employee Applies for Sick Leave

```
1. Click "New Request" button
2. Select "Sick Leave"
3. Pick dates: May 15-17, 2026
4. Enter reason: "Medical appointment"
5. Click "Submit Request"
✅ Should show success message with 3 days
```

### Scenario 2: Admin Reviews and Approves

```
1. Go to Admin Dashboard
2. See pending leave request
3. Click "Review"
4. Check employee details
5. Click "Approve"
✅ Status changes to "Approved"
```

### Scenario 3: Admin Rejects with Reason

```
1. Go to Admin Dashboard
2. Click "Review" on a request
3. Enter rejection reason
4. Click "Reject"
✅ Employee sees rejection reason
```

### Scenario 4: Employee Cancels Request

```
1. Go to "My Leave Requests"
2. Find a "Pending" request
3. Click "Cancel Request"
4. Confirm
✅ Status changes to "Cancelled"
```

---

## 📊 Database Records to Check

### View Leave Requests in MongoDB

```bash
# In MongoDB shell
db.leaverequests.find()

# View specific employee's requests
db.leaverequests.find({ employee: ObjectId("...") })

# View by status
db.leaverequests.find({ status: "Approved" })
```

---

## 🔍 Postman Collection Template

Save as `LeaveRequest.postman_collection.json`:

```json
{
  "info": { "name": "Leave Request API" },
  "item": [
    {
      "name": "Create Leave Request",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/leave",
        "body": {
          "leaveType": "Sick Leave",
          "startDate": "2026-05-15",
          "endDate": "2026-05-17",
          "reason": "Medical appointment"
        }
      }
    },
    {
      "name": "Get My Requests",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/leave/my-requests"
      }
    },
    {
      "name": "Get All Requests (Admin)",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/leave?status=Pending"
      }
    },
    {
      "name": "Approve Leave",
      "request": {
        "method": "PATCH",
        "url": "http://localhost:5000/api/leave/:leaveId/approve"
      }
    },
    {
      "name": "Reject Leave",
      "request": {
        "method": "PATCH",
        "url": "http://localhost:5000/api/leave/:leaveId/reject",
        "body": { "rejectionReason": "Reason here" }
      }
    }
  ]
}
```

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] Backend server starts without errors
- [ ] Can create leave request as employee
- [ ] Leave appears as "Pending" for admin
- [ ] Admin can approve request
- [ ] Employee receives approved notification
- [ ] Number of working days calculated correctly
- [ ] Weekend days not counted
- [ ] Admin can reject with reason
- [ ] Employee can cancel their own requests
- [ ] Status filters work in admin panel
- [ ] All form validations work
- [ ] Error messages display correctly

---

## 🎯 Success!

Your leave request system is ready to use! 🎉

**Next Steps:**

1. ✅ Test all endpoints with Postman
2. ✅ Integrate components into your React frontend
3. ✅ Test UI workflows
4. ✅ Deploy to production

**Need Help?**

- See: `LEAVE_REQUEST_FEATURE.md` for detailed documentation
- Check: Component files for inline comments
- Review: API endpoints for parameter details
