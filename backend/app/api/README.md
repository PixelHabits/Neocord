# API Documentation - Backend API Routes

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

- Require Authentication: false
- Request

  - Method: GET
  - URL: /api/session
  - Body: none

- Successful Response when there is a logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"user": {
    		"id": 1,
    		"first_name": "John",
    		"last_name": "Smith",
    		"email": "john.smith@gmail.com",
    		"username": "JohnSmith",
    		"profile_image": "http://website.com/image.jpg"
    	}
    }
    ```

- Successful Response when there is no logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - URL: /api/session
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"credential": "john.smith@gmail.com",
    	"password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"user": {
    		"id": 1,
    		"first_name": "John",
    		"last_name": "Smith",
    		"email": "john.smith@gmail.com",
    		"username": "JohnSmith",
    		"profile_image": "http://website.com/image.jpg"
    	}
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Invalid credentials"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Bad Request",
    	"errors": {
    		"credential": "Email or username is required",
    		"password": "Password is required"
    	}
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

- Require Authentication: false
- Request

  - Method: POST
  - URL: /api/users
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"id": 1,
    	"first_name": "John",
    	"last_name": "Smith",
    	"email": "john.smith@gmail.com",
    	"username": "JohnSmith",
    	"profile_image": "http://website.com/image.jpg"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"user": {
    		"id": 1,
    		"first_name": "John",
    		"last_name": "Smith",
    		"email": "john.smith@gmail.com",
    		"username": "JohnSmith",
    		"profile_image": "http://website.com/image.jpg"
    	}
    }
    ```

- Error response: User already exists with the specified email

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Email is already in use.",
    	"errors": {
    		"email": "Email address is already in use."
    	}
    }
    ```

- Error response: User already exists with the specified username

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Username is already in use.",
    	"errors": {
    		"username": "User with that username already exists"
    	}
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Bad Request",
    	"errors": {
    		"email": "Invalid email",
    		"username": "Username is required",
    		"first_name": "First Name is required",
    		"last_name": "Last Name is required",
    		"profile_picture": "Must be a valid URL"
    	}
    }
    ```

## Server Routes

### Get servers current user is in

Returns all the current Users Servers

- Require Authentication: true
- Request

  - Method: GET
  - URL: /api/servers
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"name": "App Academy",
    		"owner_id": 1,
    		"is_public": true,
    		"server_icon": "image.png",
    		"members": [
    			{
    				"id": 1,
    				"username": "JohnSmith",
    				"joined_at": "11-01-2024"
    			}
    		],

    		"created_at": "11-01-2024",
    		"updated_at": "11-01-2024"
    	}
    ]
    ```

### Get details of a Server from an ID

Returns the details of a Server specified by its ID.

- Require Authentication: true
- Request

  - Method: GET
  - URL: /api/servers/:serverId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
  - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"name": "App Academy",
    		"owner_id": 1,
    		"is_public": true,
    		"server_icon": "image.png",
    		"members": [
    			{
    				"id": 1,
    				"username": "JohnSmith",
    				"profile_picture": "image.png",
    				"joined_at": "11-01-2024"
    			}
    		],
    		"Owner": [
    			{
    				"id": 1,
    				"username": "JohnSmith",
    				"profile_picture": "image.png"
    			}
    		],
    		"created_at": "11-01-2024",
    		"updated_at": "11-01-2024"
    	}
    ]
    ```

- Error response: Couldn't find a Server with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Server not found"
    }
    ```

### Create A Server

Creates and returns a new Server

- Require Authentication: true
- Request

  - Method: POST
  - URL: /api/servers/
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
  	"name": "Learners Hub",
  	"is_public": true
  }
  ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"name": "App Academy",
    		"owner_id": 1,
    		"is_public": true,
    		"server_icon": "image.png",
    		"created_at": "11-01-2024",
    		"updated_at": "11-01-2024"
    	}
    ]
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "name": "Name must be between 2 and 20 characters."
      }
    }
    ```
### Edit a Server

Updates and returns an existing server.

- Require Authentication: true
- Require proper authorization: Server must belong to the current user
- Request

  - Method: PUT
  - URL: /api/server/:serverId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"name": "Updated Server Name",
    	"is_public": false,
    	"server_icon": "new_image.png"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"name": "Updated Server Name",
    		"owner_id": 1,
    		"is_public": false,
    		"server_icon": "new_image.png",
    		"created_at": "11-01-2024",
    		"updated_at": "11-05-2024"
    	}
    ]
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Bad Request",
    	"errors": {
    		"name": "Name must be between 2 and 20 characters."
    	}
    }
    ```

- Error response: Couldn't find a Server with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Server not found"
    }
    ```

### Delete A Server

Deletes a existing server

- Require Authentication: true
- Require proper authorization: Server must belong to the current user
- Request

  - Method: DELETE
  - URL: /api/servers/:serverId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Server successfully deleted"
    }
    ```

- Error response: Couldn't find a Server with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Server not found"
    }
    ```

## Channel Routes

### Get Channels from server

Returns all of the channels inside a specified server.

- Require Authentication: true

- Request

  - Method: GET
  - URL: /api/channels/:channelId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  [
  	{
  		"id": 1,
  		"name": "general"
  	}
  ]
  ```

- Error response: Couldn't find a Channel with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Channel not found"
    }
    ```

- Error response: User is not a member of the specified server

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get a channel by it's ID

Returns the details of a channel specified by its ID.

- Require Authentication: true
- Request

  - Method: GET
  - URL: /api/channels/:channelId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"name": "general",
    		"visibility": "public",
    		"server_id": 1,
    		"created_at": "11-01-2024",
    		"updated_at": "11-05-2024"
    	}
    ]
    ```

- Error response: Couldn't find a Channel with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Channel not found"
    }
    ```

### Edit a channel

Edits and returns a channel.

- Require Authentication: true
- Require proper authorization: Server must belong to the current user
- Request

  - Method: PUT
  - URL: /api/server/:serverId/:channelId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"name": "Updated Channel Name",
    	"visibility": "private"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"name": "Updated Channel Name",
    		"visibility": "private",
    		"server_id": 1,
    		"created_at": "11-01-2024",
    		"updated_at": "11-05-2024"
    	}
    ]
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "name": "Name must be between 2 and 20 characters."
      }
    }
    ```

### Create a channel

Creates and returns a channel.

- Require Authentication: true
- Require proper authorization: Server must belong to the current user
- Request

  - Method: POST
  - URL: /api/:serverId
  - Headers: Content-Type: application/json
  - Body:

  ```json
  {
  	"name": "announcements",
  	"visibility": "public"
  }
  ```

  - Successful Response

    - Status Code: 201
    - Headers:
      - Content-Type: application/json
    - Body:

    ```json
    [
    	{
    		"id": 1,
    		"name": "announcements",
    		"visibility": "public",
    		"server_id": 1,
    		"created_at": "11-01-2024",
    		"updated_at": "11-05-2024"
    	}
    ]
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "name": "Name must be between 2 and 20 characters.",
        "visibility": "Visibility must be either public or private."
      }
    }
    ```

### Delete a channel

Deletes a specified channel.

- Require Authentication: true
- Require proper authorization: Server must belong to the current user
- Request

  - Method: DELETE
  - URL: /api/servers/:serverId/:channelId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Channel successfully deleted"
    }
    ```

- Error response: Couldn't find a Channel with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"message": "Channel not found"
    }
    ```

## Message Routes

### Get Messages from a channel

Returns all of the messages inside a specified channel.

- Require Authentication: true
- Request


  - Method: GET
  - URL: /api/channels/:channelId/messages
  - Body: none


- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"body": "Hello, world!",
    		"author_id": 1,
        "channel_id": 1,
        "thread_id": null,
    		"created_at": "11-01-2024"
    	}
    ]
    ```

### Get a message by it's ID

Returns the details of a message specified by its ID.

- Require Authentication: true
- Request

  - Method: GET
  - URL: /api/channels/:channelId/messages/:messageId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"body": "Hello, world!",
    		"author_id": 1,
        "channel_id": 1,
        "thread_id": null,
    		"created_at": "11-01-2024"
    	}
    ]
    ```

- Error response: Couldn't find a Message with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Message not found"
    }
    ```

### Create a Message

Creates and returns a message.

- Require Authentication: true
- Request

  - Method: POST
  - URL: /api/:serverId/:channelId
  - Headers: Content-Type: application/json
  - Body:

  ```json
  {
  	"body": "Hello, world!"
  }
  ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"body": "Hello, world!",
    		"author_id": 1,
        "channel_id": 1,
        "thread_id": null,
    		"created_at": "11-01-2024"
    	}
    ]
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "body": "Body must be between 1 and 500 characters."
      }
    }
    ```

### Edit a Message

Updates and returns a message.

- Require Authentication: true
- Require proper authorization: Message must belong to the current user
- Request

  - Method: PUT
  - URL: /api/:serverId/:channelId/:messageId
  - Headers: Content-Type: application/json
  - Body:

    ```json
    {
    	"body": "Updated message body"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"body": "Updated message body",
    		"author_id": 1,
        "channel_id": 1,
        "thread_id": null,
    		"created_at": "11-01-2024"
    	}
    ]
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "body": "Body must be between 1 and 500 characters."
      }
    }
    ```

### Delete a Message

Deletes a specified message.

- Require Authentication: true
- Require proper authorization: Message must belong to the current user
- Request

  - Method: DELETE
  - URL: /api/messages/:messageId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Message successfully deleted"
    }
    ```

- Error response: Couldn't find a Message with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Message not found"
    }
    ```

## Reaction Routes

### Get Reactions from a message by it's ID

Returns all of the reactions inside a specified message.

- Require Authentication: true
- Request

  - Method: GET
  - URL: /api/messages/:messageId/reactions
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"emoji": "👍",
    		"message_id": 1,
    		"user_id": 1,
        "Message": {
          "id": 1,
          "body": "Hello, world!",
          "author_id": 1,
          "created_at": "11-01-2024"
        },
    		"created_at": "11-01-2024"
    	}
    ]
    ```

- Error response: Couldn't find a Message with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Message not found"
    }
    ```

### Add a Reaction to a specified message

Adds a reaction to a specified message.

- Require Authentication: true
- Request

  - Method: POST
  - URL: /api/messages/:messageId/reactions
  - Headers: Content-Type: application/json
  - Body:

  ```json
  {
  	"emoji": "👍"
  }
  ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    [
    	{
    		"id": 1,
    		"emoji": "👍",
    		"message_id": 1,
    		"user_id": 1,
    		"created_at": "11-01-2024"
    	}
    ]
    ```

- Error Response: Couldn't find a Message with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Message not found"
    }
    ```

### Delete a Reaction

Deletes a specified reaction.

- Require Authentication: true
- Require proper authorization: Reaction must belong to the current user

- Request

  - Method: DELETE
  - URL: /api/messages/:messageId/reactions/:reactionId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Reaction successfully deleted"
    }
    ```

- Error response: Couldn't find a Reaction with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Reaction not found"
    }
    ```
