# Employee Attendance System - Implementation Guide

## Overview

This comprehensive attendance tracking system allows employees to monitor their attendance percentage based on working days and present days with an interactive calendar view.

## Features Implemented

### 1. **Backend Enhancements** (`attendanceController.js`)

#### New Endpoints:

- `GET /api/attendance/stats/me` - Get current employee's attendance statistics for the current month
- `GET /api/attendance/stats/month/:year/:month` - Get attendance statistics for a specific month

#### Statistics Calculated:

- **Total Working Days**: Count of weekdays (Mon-Fri) in the month
- **Present Days**: Count of "Present" and "Late" status records
- **Absent Days**: Count of "Absent" status records
- **Late Count**: Number of times employee was late
- **Attendance Percentage**: (Present Days / Total Working Days) × 100
- **Attendance Map**: Day-by-day breakdown with times and status

### 2. **Frontend Components** (`EmployeeAttendance.jsx`)

#### Key Features:

- **Statistics Cards**: Display attendance percentage with performance level
  - Excellent: ≥ 95%
  - Good: 85-94%
  - Satisfactory: 75-84%
  - Needs Improvement: < 75%

- **Interactive Calendar**:
  - Visual representation of attendance status for each day
  - Color-coded dates (Green: Present, Orange: Late, Red: Absent, Gray: No data)
  - Click on any date to see detailed information
  - Navigate between months with arrow buttons

- **Day Details Panel**:
  - Shows selected date's information
  - Clock in/out times
  - Overtime hours (if applicable)
  - Logout status (early, on-time, or overtime)

- **Summary Statistics**:
  - Working days in month
  - Present days count
  - Absent days count
  - Late arrivals count
  - Progress bar showing attendance percentage

- **Recent Records Table**:
  - Last 10 attendance records
  - Date, Status, Clock in/out times
  - Overtime information

### 3. **Styling** (`EmployeeAttendance.css`)

- Responsive design (mobile, tablet, desktop)
- Professional gradient background
- Color-coded status indicators
- Smooth animations and transitions
- Accessible color scheme

### 4. **Routing**

Added new route in `App.jsx`:

```javascript
<Route path="/my-attendance" element={<EmployeeAttendance />} />
```

Updated `EmployeeDashboard.jsx` navigation to link to attendance page.

## Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install react-calendar date-fns
```

### 2. Backend Configuration

No additional npm packages required. The backend uses existing MongoDB and Express setup.

### 3. API Requirements

Ensure the following authentication middleware is in place:

- `protect` - Validates user authentication
- Employee must be logged in to access attendance stats

## API Response Format

### GET /api/attendance/stats/me

```json
{
  "success": true,
  "data": {
    "totalWorkingDays": 22,
    "presentDays": 21,
    "absentDays": 1,
    "lateCount": 3,
    "attendancePercentage": 95.45,
    "currentMonth": "April 2026",
    "attendanceRecords": [...],
    "attendanceMap": {
      "2026-04-01": {
        "status": "Present",
        "loginTime": "2026-04-01T09:00:00Z",
        "logoutTime": "2026-04-01T17:30:00Z",
        "overtimeHours": 0.5
      }
    }
  }
}
```

## Working Days Calculation

- **Included**: Monday to Friday
- **Excluded**: Weekends (Saturday, Sunday)
- **Note**: Currently doesn't exclude holidays. To add holiday support:
  1. Create a Holidays collection in MongoDB
  2. Query holidays for the date range
  3. Exclude them from working days count

## Attendance Status Flow

1. **Employee clocks in** at 9:00 AM (or later)
   - Status: "Present" if on time
   - Status: "Late" if after 9:30 AM

2. **Employee clocks out** at 5:00 PM (or later)
   - LogoutStatus: "early" (before 5 PM)
   - LogoutStatus: "ontime" (at 5 PM)
   - LogoutStatus: "overtime" (after 5 PM)
   - OvertimeHours calculated

3. **Calendar shows**:
   - Green dot: Present/On time
   - Orange dot: Late arrival
   - Red dot: Absent (no clock-in record)

## Customization Guide

### Change Working Hours

File: `backend/controllers/attendanceController.js`

```javascript
// Line 65: Change threshold for "Late" status
const threshold = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  9,
  30,
);

// Line 136: Change end-of-day hour
const workEndTime = 17; // 5 PM
```

### Change Color Scheme

File: `frontend/css/EmployeeAttendance.css`

- Present: #10b981 (Green)
- Late: #f59e0b (Amber)
- Absent: #ef4444 (Red)

### Add Holiday Support

1. Create Holidays model
2. Query holidays in `getMonthAttendanceStats` function
3. Exclude from working days calculation

## Performance Notes

- Calendar view loads attendance data for the entire month
- Uses efficient MongoDB queries with population
- Caches calendar data on state change
- Renders ~30 dates per month

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

1. Does not include holiday exclusions
2. Calendar timezone based on browser locale
3. Requires employee to clock in/out manually
4. No automatic clock-in for remote work

## Future Enhancements

- [ ] Add holiday management
- [ ] Implement biometric clock-in
- [ ] Add geolocation verification
- [ ] Export attendance reports (PDF/Excel)
- [ ] Email reminders for clock-out
- [ ] Attendance graphs and trends
- [ ] Admin holiday configuration

## Troubleshooting

### Issue: "No attendance data" for a month

**Solution**: Ensure employee has clocked in at least once during that month

### Issue: Attendance percentage incorrect

**Solution**: Check that clock-in times are correctly recorded in database

### Issue: Calendar not showing dates

**Solution**: Verify react-calendar is installed: `npm list react-calendar`

### Issue: Dates showing as Weekend when they shouldn't

**Solution**: This depends on the browser's locale. The code uses JavaScript's getDay() which respects browser settings.

## Support Files

- Backend Routes: `backend/routes/attendanceRoutes.js`
- Backend Controller: `backend/controllers/attendanceController.js`
- Frontend Component: `frontend/components/EmployeeAttendance.jsx`
- Frontend Styles: `frontend/css/EmployeeAttendance.css`
- Model: `backend/models/Attendance.js`
