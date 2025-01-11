-Prerequisites
-
Before you can run the application, ensure that you have the following installed on your local machine:

Node.js (>= 16.x.x)

MongoDB (or access to a MongoDB instance)

Docker (for containerization and Docker Compose setup, optional)

Postman or a similar API testing tool (for testing the APIs)

Minikube or another Kubernetes tool (for cloud deployment, optional)

-Setup Instructions
-
1-  Clone the Repository

 run these command:- 
 
    -https://github.com/mdaman-2345/Quiz.git
 
    -cd quiz

2. Install Dependencies

   -npm install

3.  Start the Application

   -npm run start:dev

Deployment Instructions
-

1. Run with Docker
 
   You can also run the application in Docker containers using docker-compose. To do this, first build the containers:
   
      -docker-compose build
   
   Then, to start the containers:
   
      -docker-compose up

 
