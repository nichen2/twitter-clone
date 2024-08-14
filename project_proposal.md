# Project Proposal

Use this template to help get you started right away! Once the proposal is complete, please let your mentor know that this is ready to be reviewed.

## Get Started

|             | Description                                                                                                                                                                                                                       | Fill in                                  |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Tech Stack  | What tech stack will you use for your final project? We recommend that you use React and Node for this project, however if you are extremely interested in becoming a Python developer you are welcome to use Python/Flask for this project. | React, Node.js, PostgreSQL, Prisma, Tailwind CSS, Material-UI, Monaco Editor, Heroku/Render |
| Stack Focus | Is the front-end UI or the back-end going to be the focus of your project? Or are you going to make an evenly focused full-stack application?                                                                                     | Full-stack                               |
| Type        | Will this be a website? A mobile app? Something else?                                                                                                                                                                             | Website                                  |
| Goal        | What goal will your project be designed to achieve?                                                                                                                                                                               | To provide a comprehensive learning platform for data structures, algorithms, and coding interview preparation. |
| Users       | What kind of users will visit your app? In other words, what is the demographic of your users?                                                                                                                                     | Aspiring software developers and job seekers preparing for technical interviews.       |
| Data        | What data do you plan on using? How are you planning on collecting your data? You may have not picked your actual API yet, which is fine, just outline what kind of data you would like it to contain. You are welcome to create your own API and populate it with data. If you are using a Python/Flask stack, you are required to create your own API. | Data from LeetCode problem sets, YouTube videos for instructional content, user progress data stored in PostgreSQL. |

# Breaking down your project

When planning your project, break down your project into smaller tasks, knowing that you may not know everything in advance and that these details might change later. Some common tasks might include:

- Determining the database schema
- Sourcing your data
- Determining user flow(s)
- Setting up the backend and database
- Setting up the frontend
- What functionality will your app include?
  - User login and sign up
  - Uploading a user profile picture

Here are a few examples to get you started with. During the proposal stage, you just need to create the tasks. Description and details can be edited at a later time. In addition, more tasks can be added in at a later time.

| Task Name                   | Description                                                                                                   | Example                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Design Database Schema      | Determine the models and database schema required for your project.                                           | [Link](https://github.com/hatchways/sb-capstone-example/issues/1) |
| Source Your Data            | Determine where your data will come from. You may choose to use an existing API or create your own.           | [Link](https://github.com/hatchways/sb-capstone-example/issues/2) |
| User Flows                  | Determine user flow(s) - think about what you want a user’s experience to be like as they navigate your site. | [Link](https://github.com/hatchways/sb-capstone-example/issues/3) |
| Set up Backend and Database | Configure the environmental variables on your framework of choice for development and set up database.        | [Link](https://github.com/hatchways/sb-capstone-example/issues/4) |
| Set up Frontend             | Set up frontend framework of choice and link it to the backend with a simple API call for example.            | [Link](https://github.com/hatchways/sb-capstone-example/issues/5) |
| User Authentication         | Fullstack feature - ability to authenticate (login and sign up) as a user                                     | [Link](https://github.com/hatchways/sb-capstone-example/issues/6) |

## Labeling

Labeling is a great way to separate out your tasks and to track progress. Here’s an [example](https://github.com/hatchways/sb-capstone-example/issues) of a list of issues that have labels associated.

| Label Type    | Description                                                                                                                                                                                                                                                                                                                     | Example                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Difficulty    | Estimating the difficulty level will be helpful to determine if the project is unique and ready to be showcased as part of your portfolio - having a mix of task difficulties will be essential.                                                                                                                               | Easy, Medium, Hard           |
| Type          | If a frontend/backend task is large at scale (for example: more than 100 additional lines or changes), it might be a good idea to separate these tasks out into their own individual task. If a feature is smaller at scale (not more than 10 files changed), labeling it as fullstack would be suitable to review all at once. | Frontend, Backend, Fullstack |
| Stretch Goals | You can also label certain tasks as stretch goals - as a nice to have, but not mandatory for completing this project.                                                                                                                                                                                                           | Must Have, Stretch Goal      |

# Project Proposal

## Learning Management System for Data Structures and Algorithms

### Concept Overview
A platform dedicated to teaching data structures, algorithms, and solving coding interview questions. It features educational blog posts, embedded instructional videos, an interactive code editor, user progress tracking, and community discussions.

### MVP (Minimum Viable Product) Explanation
The MVP for this project focuses on providing the core functionalities necessary for users to learn and practice coding problems effectively.

### Key Features for MVP
1. **Blog for Problem Solutions**:
    - Articles explaining solutions to various LeetCode problems.
    - Categorization of problems by topic (e.g., arrays, linked lists, dynamic programming).

2. **Embedded YouTube Videos**:
    - Directly embed instructional videos from YouTube within the platform.
    - Organized playlists for different topics.
    
3. **Interactive Code Editor**:
    - An in-browser code editor for practicing coding problems.
    - Support for multiple programming languages (e.g., JavaScript, Python, C++).
    - Ability to run and test code within the platform.

4. **User Accounts and Progress Tracking**:
    - User registration and login functionality.
    - Track user progress and completed problems.

### Breaking Down Your Project

| Task Name                   | Description                                                                                                   | Label Type     | Difficulty | Example                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------- | ---------- | ----------------------------------------------------------------- |
| Design Database Schema      | Determine the models and database schema required for your project.                                           | Backend        | Medium     | [Link](https://github.com/hatchways/sb-capstone-example/issues/1) |
| Source Your Data            | Determine where your data will come from. You may choose to use an existing API or create your own.           | Fullstack      | Medium     | [Link](https://github.com/hatchways/sb-capstone-example/issues/2) |
| User Flows                  | Determine user flow(s) - think about what you want a user’s experience to be like as they navigate your site. | Fullstack      | Easy       | [Link](https://github.com/hatchways/sb-capstone-example/issues/3) |
| Set up Backend and Database | Configure the environmental variables on your framework of choice for development and set up database.        | Backend        | Medium     | [Link](https://github.com/hatchways/sb-capstone-example/issues/4) |
| Set up Frontend             | Set up frontend framework of choice and link it to the backend with a simple API call for example.            | Frontend       | Medium     | [Link](https://github.com/hatchways/sb-capstone-example/issues/5) |
| User Authentication         | Fullstack feature - ability to authenticate (login and sign up) as a user                                     | Fullstack      | Medium     | [Link](https://github.com/hatchways/sb-capstone-example/issues/6) |
| Blog for Problem Solutions  | Implement the blog feature for explaining solutions to coding problems.                                       | Fullstack      | Hard       | [Link](https://github.com/hatchways/sb-capstone-example/issues/7) |
| Embedded YouTube Videos     | Integrate YouTube videos into the platform.                                                                  | Fullstack      | Easy       | [Link](https://github.com/hatchways/sb-capstone-example/issues/8) |
| Interactive Code Editor     | Implement the in-browser code editor with support for multiple programming languages.                        | Fullstack      | Hard       | [Link](https://github.com/hatchways/sb-capstone-example/issues/9) |
| Progress Tracking           | Track user progress and display it in the user profile.                                                      | Fullstack      | Medium     | [Link](https://github.com/hatchways/sb-capstone-example/issues/10) |

## Stretch Goals
| Task Name                      | Description                                                                                          | Label Type | Difficulty | Example                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- | ---------- | ---------- | ----------------------------------------------------------------- |
| Discussion Forum               | Implement a discussion forum for users to ask questions and share insights.                        | Fullstack  | Medium     | [Link](https://github.com/hatchways/sb-capstone-example/issues/11) |
| Advanced Analytics             | Provide detailed analytics and visualizations of user progress and performance.                    | Fullstack  | Hard       | [Link](https://github.com/hatchways/sb-capstone-example/issues/12) |
| Gamification                   | Add gamification elements like badges and leaderboards to enhance user engagement.                 | Fullstack  | Medium     | [
