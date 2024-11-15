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
    	"errors": {"message": "User must be logged in"}
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
    	"errors": {"message": "Forbidden"}
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
    		"email": "demo@aa.io",
    		"username": "Demo"
    	}
    }
    ```

- Successful Response when there is no logged in user

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"errors": {"message": "No user logged in"}
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
    	"email": "demo@aa.io",
    	"password": "password"
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
    		"email": "demo@aa.io",
    		"username": "Demo"
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
    	"errors": {"message": "Invalid credentials"}
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
    	"email": "demo@aa.io",
    	"username": "Demo"
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
    		"email": "demo@aa.io",
    		"username": "Demo"
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
    		"username": "Username is required"
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
        "name": "Demo's Server",
        "description": "Demo's server for general discussions",
        "createdAt": "Wed, 13 Nov 2024 18:23:51 GMT",
        "updatedAt": "Wed, 13 Nov 2024 18:23:51 GMT"
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
    {
    "channels": [
        {
            "id": 1,
            "name": "general",
            "server_id": 1,
            "visibility": "public"
        }
    ],
    "createdAt": "Wed, 13 Nov 2024 18:23:51 GMT",
    "description": "Demo's server for general discussions",
    "id": 1,
    "members": [
        {
            "join_date": "Wed, 13 Nov 2024 18:23:51 GMT",
            "user": {
                "email": "demo@aa.io",
                "id": 1,
                "is_owner": true,
                "username": "Demo"
            }
        },
        {
            "join_date": "Wed, 13 Nov 2024 18:23:51 GMT",
            "user": {
                "email": "marnie@aa.io",
                "id": 2,
                "is_owner": false,
                "username": "marnie"
            }
        },
        {
            "join_date": "Wed, 13 Nov 2024 18:23:51 GMT",
            "user": {
                "email": "bobbie@aa.io",
                "id": 3,
                "is_owner": false,
                "username": "bobbie"
            }
        }
    ],
    "name": "Demo's Server",
    "owner": {
        "email": "demo@aa.io",
        "id": 1,
        "username": "Demo"
    },
    "updatedAt": "Wed, 13 Nov 2024 18:23:51 GMT"
    }
    ```

- Error response: Couldn't find a Server with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "errors": {"message": "Server not found"}
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
  	"description": "A server for learners to discuss and share their learning experiences"
  }
  ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    "channels": [],
    "createdAt": "Wed, 13 Nov 2024 22:36:18 GMT",
    "description": "A server for learners to discuss and share their learning experiences",
    "id": 4,
    "members": [
        {
            "join_date": "Wed, 13 Nov 2024 22:36:18 GMT",
            "user": {
                "email": "demo@aa.io",
                "id": 1,
                "is_owner": true,
                "username": "Demo"
            }
        }
    ],
    "name": "Learners Hub",
    "owner": {
        "email": "demo@aa.io",
        "id": 1,
        "username": "Demo"
    },
    "updatedAt": "Wed, 13 Nov 2024 22:36:18 GMT"
    }
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
    	"description": "A server for learners to discuss and share their learning experiences"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    "channels": [
        {
            "id": 1,
            "name": "general",
            "server_id": 1,
            "visibility": "public"
        }
    ],
    "createdAt": "Wed, 13 Nov 2024 22:37:45 GMT",
    "description": "A server for learners to discuss and share their learning experiences",
    "id": 1,
    "members": [
        {
            "join_date": "Wed, 13 Nov 2024 22:37:45 GMT",
            "user": {
                "email": "demo@aa.io",
                "id": 1,
                "is_owner": true,
                "username": "Demo"
            }
        },
        {
            "join_date": "Wed, 13 Nov 2024 22:37:45 GMT",
            "user": {
                "email": "marnie@aa.io",
                "id": 2,
                "is_owner": false,
                "username": "marnie"
            }
        },
        {
            "join_date": "Wed, 13 Nov 2024 22:37:45 GMT",
            "user": {
                "email": "bobbie@aa.io",
                "id": 3,
                "is_owner": false,
                "username": "bobbie"
            }
        }
    ],
    "name": "Updated Server Name",
    "owner": {
        "email": "demo@aa.io",
        "id": 1,
        "username": "Demo"
    },
    "updatedAt": "Wed, 13 Nov 2024 22:37:45 GMT"
    }
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

### Join a server

Adds the current user to the server

- Require Authentication: true
- Request

  - Method: POST
  - URL: /api/servers/:serverId/members
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User added to server"
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

### Leave a server

Removes the current user from the server

- Require Authentication: true
- Request

  - Method: DELETE
  - URL: /api/servers/:serverId/members
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Left server successfully"
    }
    ```

### Get Channels from server

Returns all of the channels inside a specified server.

- Require Authentication: true

- Request

  - Method: GET
  - URL: /api/servers/:serverId/channels
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
        "server_id": 1,
        "visibility": "public"
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
      "message": "User is not a member of the server"
    }
    ```

### Create a new channel

Creates and returns a new channel.

- Require Authentication: true
- Require proper authorization: Server must belong to the current user
- Request

  - Method: POST
  - URL: /api/servers/:serverId/channels
  - Headers: Content-Type: application/json
  - Body:

    ```json
    {
      "name": "new channel",
      "visibility": "public"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 4,
      "name": "new channel",
      "server_id": 1,
      "visibility": "public"
    }
    ```

- Error Response: Couldn't find a Server with the specified id

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
    {
      "id": 1,
      "name": "general",
      "server_id": 1,
      "visibility": "public"
    }
    ```

- Error response: User is not a member of the server

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User is not a member of the server"
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

### Edit a channel

Edits and returns a channel.

- Require Authentication: true
- Require proper authorization: Server must belong to the current user
- Request

  - Method: PUT
  - URL: /api/channels/:channelId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
    	"name": "Updated Channel Name",
    	"visibility": "PRIVATE"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "name": "Updated Channel Name",
      "server_id": 1,
      "visibility": "private"
    }
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

- Error response: form validation errors

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


### Delete a channel

Deletes a specified channel.

- Require Authentication: true
- Require proper authorization: Server must belong to the current user
- Request

  - Method: DELETE
  - URL: /api/channels/:channelId
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
        "body": "hi",
        "channel_id": 1,
        "createdAt": "Wed, 13 Nov 2024 22:12:32 GMT",
        "id": 6,
        "reactions": [],
        "replyCount": 0,
        "thread": null,
        "updatedAt": "Wed, 13 Nov 2024 22:12:32 GMT",
        "userId": 1
      }
    ]
    ```

### Create a Message

Creates and returns a message.

- Require Authentication: true
- Request

  - Method: POST
  - URL: /api/channels/:channelId/messages
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
    {
      "body": "Hello, world!",
      "channel_id": 1,
      "createdAt": "Wed, 13 Nov 2024 22:52:31 GMT",
      "id": 7,
      "reactions": [],
      "replyCount": 0,
      "thread": null,
      "updatedAt": "Wed, 13 Nov 2024 22:52:31 GMT",
      "userId": 1
    }
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


## Message Routes

### Get a message by it's ID

Returns the details of a message specified by its ID.

- Require Authentication: true
- Request

  - Method: GET
  - URL: /api/messages/:messageId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "body": "Hello, world!",
      "channel_id": 1,
      "thread_id": null,
      "createdAt": "Wed, 13 Nov 2024 22:12:32 GMT"
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
    		"createdAt": "11-01-2024"
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

- Error response: You are not the author of this message

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "You are not the author of this message"
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

- Error response: You are not the author of this message

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "You are not the author of this message"
    }
    ```

## Reaction Routes

### Get Reactions from a message by it's ID

Returns all of the reactions inside a specified message.

- Require Authentication: true
- Request

  - Method: GET
  - URL: /api/messsages/:messageId/reactions
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
    		"messageId": 1,
    		"userId": 1,
        "Message": {
          "id": 1,
          "body": "Hello, world!",
          "author_id": 1,
          "createdAt": "11-01-2024"
        },
    		"createdAt": "11-01-2024"
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
    		"messageId": 1,
    		"userId": 1,
    		"createdAt": "11-01-2024"
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

- Error Response: User already reacted with this emoji

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "You've already reacted with this emoji"
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

- Error response: You are not the author of this reaction

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "You are not the author of this reaction"
    }
    ```

- Error response: Couldn't find message with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Message not found"
    }
    ```
