# Standard Operating Procedure (SOP)
## Employee Management System (StudioCore Workspace Management Portal)

- **Version:** 1.0  
- **Effective Date:** 2026-04-13  
- **Owner:** HR Operations + Engineering  
- **Approved By:** Project Lead

---

## 1. Purpose
Define the standard process to operate the Employee Management System for employee records, attendance tracking, reporting, and policy compliance.

## 2. Scope
This SOP applies to:
- Dashboard monitoring
- Employee master data management
- Attendance logging and review
- Reports export (CSV)
- Policy alerts (example: consecutive late arrivals)

## 3. System Modules (Based on Project)
- **Dashboard**
- **Employees**
- **Attendance**
- **Reports**
- **Settings** (configuration and policy controls)

## 4. Roles and Responsibilities
- **Admin**
  - Manages user access, settings, and permissions.
- **HR Manager**
  - Maintains employee records, validates attendance exceptions.
- **Team Manager**
  - Reviews late/absent patterns and handles escalation.
- **Employee**
  - Ensures correct login/logout records.
- **System Support**
  - Handles incidents, backups, and release support.

## 5. Daily Attendance Operations
1. Open **Attendance Log**.
2. Verify date and apply filters:
   - Employee Search
   - Select Date
   - Status Filter (Present / Late / Absent)
3. Review key metrics:
   - On-Time Presence %
   - Late Arrivals count
   - Total Active Hours
4. Validate suspicious entries:
   - Missing login/logout
   - Abnormal short hours
   - Repeated late marks
5. Export data using **Export CSV** for reporting/audit.

## 6. Attendance Status Rules
- **Present:** Valid login and logout with acceptable shift timing.
- **Late:** Login time beyond configured grace period.
- **Absent:** No valid login for selected date.
- **Early Logout (optional warning):** Logout before minimum required hours.

## 7. Policy Enforcement
- Trigger manager notification after **3 consecutive late arrivals**.
- HR reviews and records corrective action.
- Recurring violations are escalated to Admin/HR Head.

## 8. Employee Data Management
1. Add/update employee profile (ID, role, department).
2. Verify unique employee ID format (e.g., `#SC-XXXX`).
3. Keep role/designation current for reporting accuracy.
4. Disable account for inactive/exited employees.

## 9. Reporting Procedure
- Generate daily/weekly attendance reports from Attendance and Reports modules.
- Export CSV and store in secured HR folder.
- Monthly summary must include:
  - Presence rate
  - Late frequency
  - Absence count
  - Department-level trends

## 10. Data Quality and Validation
- No duplicate attendance records per employee/date.
- Time format must be standardized.
- Missing punches must be resolved within 1 business day.
- All manual corrections require HR note and approver name.

## 11. Security and Access Control
- Role-based access only.
- No sharing of accounts.
- Log out after session completion.
- Do not store sensitive HR data in unsecured files.
- Audit access logs monthly.

## 12. Incident Handling
- **P1:** System unavailable / data loss risk  
- **P2:** Incorrect attendance calculation  
- **P3:** UI/report export issues  

Response process:
1. Log incident with timestamp and owner.
2. Apply workaround (if available).
3. Fix and validate.
4. Document root cause and preventive action.

## 13. Review and Revision
- SOP review frequency: **Quarterly**
- Immediate update required after:
  - Policy change
  - New module release
  - Compliance requirement updates

---

## 14. Revision History
| Version | Date       | Change Summary         | Author |
|---------|------------|------------------------|--------|
| 1.0     | 2026-04-13 | Initial SOP created    | Team   |