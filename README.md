# Full-Stack-Development-Assignment-1-Student-Management

Project Information
Student Name: Shubham Eknath Sukhadare
Roll Number: 53
Subject: Full Stack Development
Assignment: Assignment 1
1. Introduction
The Student Registration and Result Management System is a responsive web application developed using HTML5, CSS3, and JavaScript. It allows users to enter student details and subject marks, calculate academic results, and save student records in the browser.

2. Objectives
To create a responsive student registration form.
To validate student information and subject marks using JavaScript.
To calculate total marks and percentage automatically.
To determine Pass or Fail based on subject marks.
To convert student data into JSON format.
To store and retrieve student records using browser Local Storage.
3. Technologies Used
HTML5: Creates the structure of the web application and registration form.
CSS3: Provides styling, layout, and responsive design.
JavaScript: Performs validation, calculations, result display, and record management.
JSON: Represents student information in a structured data format.
Local Storage: Stores student records in the browser so they remain available after refreshing the page.
4. Features
Student registration using name, roll number, email, and class/course.
Entry of marks for five subjects: HTML5, CSS3, JavaScript, Database, and Programming.
Validation of required fields and marks between 0 and 100.
Prevention of duplicate roll numbers.
Automatic calculation of total marks and percentage.
Pass/Fail determination based on a minimum of 35 marks in every subject.
Dynamic display of student results.
Conversion of student objects into JSON format.
Storage and display of student records using Local Storage.
Option to clear all saved student records.
5. Result Calculation
The maximum marks are 500, based on five subjects with 100 marks each.

Total Marks = Sum of marks obtained in all five subjects.

Percentage = (Total Marks / 500) × 100.

A student passes only when they obtain at least 35 marks in every subject. If any subject mark is below 35, the result is Fail.

6. Project File Structure
Assignment-1-Student-Management/
├── index.html
├── style.css
├── script.js
└── README.md
7. How to Run the Project
Open the project folder.
Open index.html in a web browser.
Enter the student details and marks.
Click Register and Calculate Result.
View the calculated result and JSON data.
Check saved student records below the registration form.
The project can also be accessed through GitHub Pages.

8. Conclusion
This project demonstrates the use of HTML5, CSS3, and JavaScript to develop a responsive student registration and result management application. It provides practical experience with form validation, calculations, JSON conversion, dynamic content, and browser Local Storage.

Note: Local Storage is browser-specific and is not a server-side database.
