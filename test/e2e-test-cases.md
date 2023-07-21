# E2E Test Cases

## Authorization

### ADMIN
- Can update himself
- Can update it's role
- Can update any other user's profile
- Can update the role of any other user
- Can delete himself
- Can delete any other user

### MODERATOR
- Can update himself
- Can NOT update it's role
- Can NOT update any other's profile
- Can delete himself
- Can NOT delete any other user

### USER
- Can update himself
- Can NOT update it's role
- Can NOT update any other's profile
- Can delete himself
- Can NOT delete any other user

----------------------------------------------

## Authentication

### LOGGED IN
- Can read users
- Can read single user
- Can update a user (if himself or others, based on role)
- Can delete a user (if himself or others, based on role)
- Can log himself out

### LOGGED OUT
- Can NOT read users
- Can NOT read single user
- Can NOT update a user
- Can NOT delete a user
- Can log himself in
  - If credentials are valid, user is logged in
  - If credentials are NOT valid (wrong email or wrong password), 401 is thrown
- Can sign himself up
  - If credentials are valid, user is signed up
  - If credentials are NOT valid (look at DTO), 400 is thrown
  - If email is already taken, 400 is thrown

### REFRESH TOKEN
- If refresh token from request is valid, a new token pair is generated
- If refresh token from request is NOT valid, 401 is thrown
