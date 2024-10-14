# Mataadhikar: A Vote Casting Application

This is the backend application for a voting platform where users can cast votes for their preferred candidates. It includes user authentication, candidate management, and voting functionality.

## Features

- **User Registration and Login** with Aadhar Card Number and password
- **View Candidates:** Users can see a list of all candidates
- **Cast Vote:** Users can vote for a candidate (only once)
- **Admin Features:** Administrators can manage candidates (add, edit, remove)
- **Admin Restrictions:** Admins do not have the ability to vote

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT (JSON Web Tokens)** for secure authentication

## Installation

To set up the project locally, clone the repository:

```bash
git clone https://github.com/YourUsername/Mataadhikar.git
```

## API Endpoints

### Authentication
- **Sign Up:**  
  `POST /signup` - Register a new user
- **Login:**  
  `POST /login` - Log in an existing user

### Candidates
- **View Candidates:**  
  `GET /candidates` - Retrieve a list of all candidates
- **Add Candidate (Admin only):**  
  `POST /candidates` - Add a new candidate to the system
- **Edit Candidate (Admin only):**  
  `PUT /candidates/:id` - Modify an existing candidate's details
- **Remove Candidate (Admin only):**  
  `DELETE /candidates/:id` - Delete a candidate from the system

### Voting
- **Get Vote Counts:**  
  `GET /candidates/vote/count` - Retrieve the vote count for each candidate
- **Cast Vote:**  
  `POST /candidates/vote/:id` - Cast a vote for a candidate (User only)

### User Profile
- **View Profile:**  
  `GET /users/profile` - Get the details of the logged-in user's profile
- **Change Password:**  
  `PUT /users/profile/password` - Update the user's password

## Contributions

Contributions are always welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Implement your changes and commit them:  
   ```bash
   git commit -m 'Add your feature'
   ```
4. Push the changes to your branch:  
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a pull request.

---

Feel free to adapt and enhance the functionality of **Mataadhikar**!
