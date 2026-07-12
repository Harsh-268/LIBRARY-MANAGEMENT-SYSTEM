# LMS Project - Issues Report

## 🔴 CRITICAL ISSUES

### 1. **Security Vulnerabilities**

#### 1.1 Missing Environment Variables Validation
- **Location**: `server/src/server.js`, `server/src/db/index.js`, `server/src/models/user.model.js`
- **Issue**: No validation for required environment variables (MONGODB_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, etc.)
- **Impact**: Application may crash at runtime or use undefined values
- **Fix**: Add validation on startup to ensure all required env vars are present

#### 1.2 Hardcoded CORS Origin
- **Location**: `server/src/app.js:7`
- **Issue**: CORS origin is hardcoded to `http://localhost:5173`
- **Impact**: Won't work in production or with different ports
- **Fix**: Use environment variable: `process.env.CORS_ORIGIN || "http://localhost:5173"`

#### 1.3 Missing Rate Limiting
- **Location**: Entire server
- **Issue**: No rate limiting on authentication endpoints
- **Impact**: Vulnerable to brute force attacks
- **Fix**: Add express-rate-limit middleware

#### 1.4 Secure Cookie Settings in Development
- **Location**: `server/src/controllers/user.controller.js:82-85`
- **Issue**: `secure: true` is set, which requires HTTPS. This will fail in local development
- **Impact**: Cookies won't be set in development (HTTP)
- **Fix**: Use `secure: process.env.NODE_ENV === 'production'`

#### 1.5 Missing Input Validation/Sanitization
- **Location**: Multiple controllers
- **Issue**: No validation middleware (express-validator is installed but not used)
- **Impact**: Vulnerable to injection attacks, invalid data
- **Fix**: Add validation middleware to all routes

#### 1.6 Token Storage in localStorage
- **Location**: `client/src/context/AuthContext.jsx:21`
- **Issue**: Access tokens stored in localStorage (vulnerable to XSS)
- **Impact**: XSS attacks can steal tokens
- **Fix**: Consider using httpOnly cookies (already using cookies for refresh token)

### 2. **Critical Bugs**

#### 2.1 Route Parameter Mismatch - returnBook
- **Location**: `server/src/routes/issue.routes.js:9` vs `server/src/controllers/issue.controller.js:59`
- **Issue**: Route uses `.patch("/returnbook")` but controller expects `req.params.issueId`
- **Impact**: `issueId` will be undefined, return functionality broken
- **Fix**: Change route to `.patch("/returnbook/:issueId")` or change controller to use `req.body.issueId`

#### 2.2 Route Parameter Mismatch - renewBook
- **Location**: `server/src/routes/issue.routes.js:11` vs `server/src/controllers/issue.controller.js:107`
- **Issue**: Route uses `.patch("/renewbook")` but controller expects `req.params.issueId`
- **Impact**: `issueId` will be undefined, renewal functionality broken
- **Fix**: Change route to `.patch("/renewbook/:issueId")` or change controller to use `req.body.issueId`

#### 2.3 Incorrect Field Name in deleteBookFromLibrary
- **Location**: `server/src/controllers/book.controller.js:127`
- **Issue**: Query uses `{bookId}` but Issue model uses `{book}` field
- **Impact**: Will always return null, allowing deletion of issued books
- **Fix**: Change to `await Issue.findOne({ book: bookId, status: "ISSUED" })`

#### 2.4 Missing Transaction in returnBook
- **Location**: `server/src/controllers/issue.controller.js:58-96`
- **Issue**: No database transaction for return operation (unlike issueBook)
- **Impact**: Data inconsistency if operations fail partway through
- **Fix**: Wrap in MongoDB transaction like issueBook

#### 2.5 Fine Calculation Bug
- **Location**: `server/src/controllers/issue.controller.js:75`
- **Issue**: Uses `Math.abs()` which makes overdue days always positive, but then checks `if(today>dueDate)`
- **Impact**: Fine calculation may be incorrect
- **Fix**: Remove `Math.abs()` - fine should only apply when overdue

#### 2.6 Missing Session Cleanup in issueBook
- **Location**: `server/src/controllers/issue.controller.js:45`
- **Issue**: `session.endSession()` called after commit, but if error occurs before commit, session not cleaned up
- **Impact**: Potential memory leaks
- **Fix**: Use try-finally to ensure session cleanup

#### 2.7 Error Handler Status Code Bug
- **Location**: `server/src/utils/asyncHandler.js:5`
- **Issue**: Uses `error.code` but apiError uses `error.statusCode`
- **Impact**: Wrong status codes returned (always 500)
- **Fix**: Change to `error.statusCode || 500`

### 3. **Data Integrity Issues**

#### 3.1 No Validation for availableCopies > totalCopies
- **Location**: `server/src/models/book.model.js`
- **Issue**: No validation to ensure `availableCopies <= totalCopies`
- **Impact**: Can have more available copies than total copies
- **Fix**: Add pre-save hook or validation

#### 3.2 Missing Indexes
- **Location**: All models
- **Issue**: No database indexes on frequently queried fields (email, isbn, status, dueDate)
- **Impact**: Slow queries as data grows
- **Fix**: Add indexes to schemas

#### 3.3 No Unique Constraint Validation
- **Location**: `server/src/controllers/user.controller.js:190-204`
- **Issue**: updateUserInfo doesn't check if new email already exists
- **Impact**: Can create duplicate emails
- **Fix**: Add email uniqueness check before update

## 🟡 HIGH PRIORITY ISSUES

### 4. **Code Quality Issues**

#### 4.1 Typo in Database Connection
- **Location**: `server/src/db/index.js:8`
- **Issue**: Variable name typo: `connecionInstance` should be `connectionInstance`
- **Impact**: Code readability

#### 4.2 Typo in Error Message
- **Location**: `server/src/controllers/book.controller.js:25`
- **Issue**: "Database Erorr" should be "Database Error"
- **Impact**: Professionalism

#### 4.3 Typo in Server Log
- **Location**: `server/src/server.js:19`
- **Issue**: "MongoDB connectection failed" should be "MongoDB connection failed"
- **Impact**: Professionalism

#### 4.4 Typo in Auth Middleware
- **Location**: `server/middleware/auth.middleware.js:16`
- **Issue**: "Invlalid access token" should be "Invalid access token"
- **Impact**: Professionalism

#### 4.5 Inconsistent Error Status Codes
- **Location**: Multiple controllers
- **Issue**: Some 400 errors should be 404 (e.g., "Book not found" should be 404, not 400)
- **Impact**: Incorrect HTTP semantics

#### 4.6 Missing Error Response Format
- **Location**: `server/src/utils/asyncHandler.js:5-8`
- **Issue**: Error response doesn't match apiResponse format
- **Impact**: Inconsistent API responses

### 5. **Missing Features/Functionality**

#### 5.1 No .env.example File
- **Location**: Root directory
- **Issue**: No example environment file for developers
- **Impact**: Difficult setup for new developers
- **Fix**: Create `.env.example` with all required variables

#### 5.2 No Global Error Handler
- **Location**: `server/src/app.js`
- **Issue**: No centralized error handling middleware
- **Impact**: Inconsistent error responses
- **Fix**: Add error handling middleware

#### 5.3 No Request Logging
- **Location**: Entire server
- **Issue**: No request logging middleware (morgan)
- **Impact**: Difficult to debug production issues
- **Fix**: Add morgan or similar

#### 5.4 No API Documentation
- **Location**: Entire project
- **Issue**: No API documentation (Swagger/OpenAPI)
- **Impact**: Difficult for frontend developers
- **Fix**: Add Swagger documentation

#### 5.5 Missing Password Validation
- **Location**: `server/src/controllers/user.controller.js:25-32, 163-182`
- **Issue**: No password strength validation in registerUser or changeUserPassword
- **Impact**: Weak passwords allowed, no validation on password change
- **Fix**: Add password validation (min length, complexity) to both functions

#### 5.6 No Email Validation
- **Location**: `server/src/controllers/user.controller.js:25-32`
- **Issue**: No email format validation
- **Impact**: Invalid emails can be registered
- **Fix**: Add email regex validation

#### 5.7 No Pagination
- **Location**: `server/src/controllers/book.controller.js:168`, `server/src/controllers/user.controller.js:229`
- **Issue**: getAllBooks and getAllUsers return all records
- **Impact**: Performance issues with large datasets
- **Fix**: Add pagination

#### 5.8 No Search/Filter Options
- **Location**: Multiple controllers
- **Issue**: Limited filtering and sorting options
- **Impact**: Poor user experience
- **Fix**: Add query parameters for filtering/sorting

### 6. **Frontend Issues**

#### 6.1 Hardcoded API URL
- **Location**: `client/src/api/axios.js:31`
- **Issue**: Hardcoded `http://localhost:5001` in refresh token interceptor
- **Impact**: Won't work in production
- **Fix**: Use `import.meta.env.VITE_API_URL`

#### 6.2 No Error Boundary
- **Location**: `client/src/App.jsx`
- **Issue**: No React error boundary
- **Impact**: App crashes on errors
- **Fix**: Add error boundary component

#### 6.3 Missing Loading States
- **Location**: Multiple components
- **Issue**: No loading indicators for async operations
- **Impact**: Poor UX
- **Fix**: Add loading states

#### 6.4 No Token Refresh on App Load
- **Location**: `client/src/context/AuthContext.jsx`
- **Issue**: Only checks localStorage, doesn't verify token validity
- **Impact**: User may appear logged in with expired token
- **Fix**: Verify token on app load

## 🟢 MEDIUM PRIORITY ISSUES

### 7. **Best Practices**

#### 7.1 Missing Request Size Limits Documentation
- **Location**: `server/src/app.js:8-9`
- **Issue**: Limits set but not documented
- **Impact**: Confusion about why requests fail

#### 7.2 No Request ID/Tracing
- **Location**: Entire server
- **Issue**: No request ID for tracing logs
- **Impact**: Difficult to debug distributed issues

#### 7.9 Console.log in Production Code
- **Location**: `server/src/db/index.js`, `server/src/server.js`, `server/src/controllers/book.controller.js`
- **Issue**: Using console.log/console.error instead of proper logging library
- **Impact**: No log levels, formatting, or log rotation
- **Fix**: Use winston, pino, or similar logging library

#### 7.3 Inconsistent Naming
- **Location**: Multiple files
- **Issue**: Mix of camelCase and inconsistent naming
- **Impact**: Code readability

#### 7.4 Missing JSDoc Comments
- **Location**: All controllers
- **Issue**: No function documentation
- **Impact**: Difficult to understand code

#### 7.5 No Unit Tests
- **Location**: Entire project
- **Issue**: No test files
- **Impact**: No confidence in code changes

#### 7.6 No Integration Tests
- **Location**: Entire project
- **Issue**: No API integration tests
- **Impact**: No end-to-end validation

#### 7.7 Missing README
- **Location**: Root directory
- **Issue**: No project README with setup instructions
- **Impact**: Difficult onboarding

#### 7.8 No Pre-commit Hooks
- **Location**: Root directory
- **Issue**: No linting/formatting on commit
- **Impact**: Code quality issues

### 8. **Performance Issues**

#### 8.1 No Caching
- **Location**: Book queries
- **Issue**: No caching for frequently accessed data
- **Impact**: Unnecessary database queries

#### 8.2 N+1 Query Problem
- **Location**: `server/src/controllers/issue.controller.js:174-186`
- **Issue**: Using populate may cause N+1 queries
- **Impact**: Performance degradation

#### 8.3 No Database Connection Pooling Configuration
- **Location**: `server/src/db/index.js`
- **Issue**: Using default MongoDB connection options
- **Impact**: May not be optimized for production

### 9. **Model Issues**

#### 9.1 Missing Validation in Models
- **Location**: All models
- **Issue**: Limited validation (e.g., no min/max for numbers, no string length limits)
- **Impact**: Invalid data can be stored

#### 9.2 No Soft Delete
- **Location**: Book and User models
- **Issue**: Hard deletes (data lost forever)
- **Impact**: Cannot recover deleted data

#### 9.3 Missing Timestamps Usage
- **Location**: Issue model
- **Issue**: Has timestamps but doesn't use createdAt/updatedAt in queries
- **Impact**: Missing audit trail usage

## 📋 SUMMARY

**Total Issues Found: 52+**

- **Critical Security Issues**: 6
- **Critical Bugs**: 7
- **Data Integrity Issues**: 3
- **High Priority Issues**: 15
- **Medium Priority Issues**: 21+

### Immediate Action Items:
1. Fix route parameter mismatches (returnBook, renewBook)
2. Fix deleteBookFromLibrary query bug
3. Add environment variable validation
4. Fix secure cookie setting for development
5. Fix error handler status code bug
6. Add input validation middleware
7. Fix fine calculation bug
8. Add transaction to returnBook

### Recommended Next Steps:
1. Create .env.example file
2. Add global error handler
3. Add request logging
4. Fix all typos
5. Add pagination to list endpoints
6. Add password and email validation
7. Create comprehensive README
8. Add unit and integration tests
