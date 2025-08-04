# 🧾 QuickTask Security Report

**Competitor Name:**  
**Date:**  
**Project:** QuickTask OWASP Challenge

---

## 🔐 Overview

This document outlines the identified vulnerabilities in the QuickTask web app and the corresponding solutions. The aim is to align fixes with the [OWASP Top 10 (2021)](https://owasp.org/Top10/) web application security risks.

---

## ✅ Vulnerability Report

| #  | OWASP Category                                     | Vulnerability Description | Exploitation Method       | Fix Description          | Status       |
|----|----------------------------------------------------|----------------------------|----------------------------|---------------------------|--------------|
| 1  | A01 - Broken Access Control                        | No authorization check on /admin route |All users can access the admin panel | Added role-based access control check for /admin | ✅ Fixed ☐ Unfixed |
| 2  | A02 - Cryptographic Failures                       | Hardcoded session secret | attacker can see sessions if they can see the source code | session secret moved to environment variable | ✅ Fixed ☐ Unfixed |
| 3  | A03 - Injection                                    | SQL Injection in login form | Login bypass using inputs like `' OR '1'='1` | added parmeters to the queries instead of adding to the string | ✅ Fixed ☐ Unfixed |
| 4  | A04 - Insecure Design                              | No validation or rate limiting | brute-forcing the login | added input validation using the express-validator package | ✅ Fixed ☐ Unfixed |
| 5  | A05 - Security Misconfiguration                    | The app showed stack traces on crash | reveals source code to users | custom error handler that hides stack traces | ✅ Fixed ☐ Unfixed |
| 6  | A06 - Vulnerable & Outdated Components             | Database was only in memory with default hard-coded accounts | Attacker can see credentials if they have source code | Switched to file based SQLite and added warning to change the default users credentials | ✅ Fixed ☐ Unfixed |
| 7  | A07 - Identification & Authentication Failures     | Plaintext passwords stored in DB | Anyone with DB access can see all passwords | encrypted passwords using bcrypt | ✅ Fixed ☐ Unfixed |
| 8  | A08 - Software & Data Integrity Failures           | No integrity validation on static files | static files may change | Added content security policy | ✅ Fixed ☐ Unfixed |
| 9  | A09 - Security Logging & Monitoring Failures       | Not logging logins | login failures may not be seen | added logging to security.log for login attempts | ✅ Fixed ☐ Unfixed |
| 10 | A10 - SSRF / Cross-Site Scripting (XSS)            | Task descriptions were not escaped | XSS using script tags in task input | escaped all html using `he.encode` | ✅ Fixed ☐ Unfixed |

---

## 📄 Notes

(Add any additional remarks, context, or recommendations here.)
