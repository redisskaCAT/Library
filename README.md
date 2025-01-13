# Librarian's Personal Dashboard

This web application was developed as part of the **"Web Application Development Technologies"** course assignment. It serves as a personal dashboard for librarians to manage book loans to readers. The application implements CRUD operations and adheres to the specified technical requirements.

## Showcase

A quick demonstration of the application is available below:

![Showcase](showcase/Library.mp4)

## Technical Requirements

1. **Client-side**:
   - Built with HTML, CSS, and JavaScript.
   - Supports the use of any libraries/frameworks (e.g., React, Angular).

2. **Server-side**:
   - Developed using JavaScript with the Node.js platform.
   - Frameworks such as Express.js are permitted.

3. **API**:
   - Communication between the client and server occurs through a REST-like API.

4. **Database**:
   - Data is stored in a database. Any DBMS compatible with JavaScript can be used.

5. **Additional Technologies**:
   - TypeScript can be used instead of JavaScript.

---

## Application Features

### Reader Management
- Add a new reader.
- Delete a reader.
- Edit reader details (e.g., name).
- Manage the list of books borrowed by a reader.

### Book Management
- Assign books to a reader.
- Remove books from a reader's borrowed list.
- Transfer books between readers.

### Library Book Management
- Modify the list of available books.
- Store book information:
  - Author (Full Name).
  - Title.
  - Number of available copies.

---

## Core Rules

- A reader can borrow up to **N** books (defined during development).
- Borrowing restrictions:
  - A reader cannot borrow a book they already have.
  - A reader cannot borrow more books than allowed by the limit.
- Notifications will display the reason for a failed borrowing attempt.
- The number of available book copies updates automatically upon loan or return.

---

## Getting Started

### Prerequisites
- Node.js
- A database (e.g., MySQL, MongoDB)

