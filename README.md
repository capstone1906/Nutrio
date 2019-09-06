# Nutrio (Nutrition Tracker)

Nutrio is your personal assistant for weight management and meal planning.  It keeps your goals in sight and easy to maintain.

Nutrio is a Calorie tracker inspired by apps like MyFitnessPal. It allows you to take a picture of your food to quickly be able to track what you eat. It can also recommend you meals based on how many calories you have left to consume for the day. We also have a progress page where you can see how you're doing over the course of a week, month, and year to date. 

### Prerequisites

  * PostgreSQL
  * Neo4j
  * Expo app

### Installing
 After cloning this directory -> 
 
 1) Download and install ngrok, follow steps on website (https://ngrok.com/)
 2) Visit https://www.nutritionix.com/ and register for a free API key
 3) Visit https://www.clarifai.com/ and register for a free API key
 4) Create a file in the top level of your directory, name it secret8.js
 5) Copy and paste these lines, filling in the info for Ngrok, Nutritionix, and clarifai
 `
      export const ngrok = 'your ngrok URL';
      export const nixID = 'your key here';
      export const nixKey = 'your key here';
      export const clarifaiKey = 'your key here'  
      `
 
 6) if postgres CLI tools installed run `createdb nutrition-tracker` in terminal, or create a database in the postgres GUI with the name `nutrition-tracker`
 7) open Neo4j interface, create a database with the name `Nutrition-Tracker`
 8) `npm install`
 9) `npm run seed`
 10) `npm run start` or (`expo start` and `node server/index.js`)


## Built With

* [Node.js] (https://nodejs.org/en/) - Javascript Environment
* [Express.js] (https://expressjs.com/) - web framework used to setup server
* [Redux.js] (https://redux.js.org/) - state management
* [React Native] (https://facebook.github.io/react-native/) - Front end framework for developing our mobile app
* [Clarifai] (https://www.clarifai.com/) - Image recognition API used for quickly adding foods using camera
* [Nutrionix] (https://www.nutritionix.com/) - Food/nutritional information API used for searching foods
* [Neo4j] (https://neo4j.com/) - NoSQL Graph Database used for recommending foods
* [PostgreSQL] (https://www.postgresql.org/) - SQL database used to store long term, relation user information
* [Sequelize] (https://sequelize.org) - promise-based Node.js ORM for Postgres


## Authors

  * Edgar Camacho
  * Russell Kerns
  * Jacob Gee
  * Kaiyue Pan

See also the list of [contributors](https://github.com/capstone1906/nutrio/contributors) who participated in this project.


## Acknowledgments

Thank you to apps like MyFitnessPal for inspiration! 
