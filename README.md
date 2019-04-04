# Martyria Express Backend

This is the backend of Martyria, an application dedicated keeping the community encouraging one another with various testimonies. Here, a user is able to log in, post testimonies as well as view others. They will have the option to "like" as well as comment on another user's testimony they posted. It is a fast easy application ran on React on the front-end.

## Documentation

Setup
Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

Install MongoDB
To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

Install the Dependencies

Next, from the project folder, install the dependencies:

npm i

Populate the Database

npm i mongoose@5.0.1

Run the Tests

You're almost done! Run the tests to make sure everything is working:

npm test

All tests should pass.

Start the Server

run nodemon

This will launch the Node server on port 3000. If that port is busy, you can set a different point in config/default.json.

Open up your browser and head over to:

http://localhost:3000/api/users

You should see the list of users. That confirms that you have set up everything successfully.

(Optional) Environment Variables
If you look at config/default.json, you'll see a property called jwtPrivateKey. This key is used to encrypt JSON web tokens. So, for security reasons, it should not be checked into the source control. I've set a default value here to make it easier for you to get up and running with this project. For a production scenario, you should store this key as an environment variable.

On Mac:

export martyria_jwtPrivateKey=yourSecureKey

On Windows:

set martyria_jwtPrivateKey=yourSecureKey
