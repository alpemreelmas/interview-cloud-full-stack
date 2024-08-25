# Start Here

1. Use this template repository to create a private fork (click the green `Use this template` button and not the `Fork` button).
1. Follow the instructions in `INSTRUCTIONS.md`.
1. Give [@mersive-asavchenko](https://github.com/mersive-asavchenko) (`asavchenko@mersive.com`) and [@retronouns](https://github.com/retronouns) (`cgingles@mersive.com`) collaborator access when complete.
1. Inform your Mersive contact that the assignment is complete.

# Your Documentation

## Getting Started

### Overview
This project supports two endpoints which is `http://localhost:4000/devices` and `http://localhost:4000/devices-with-sorting`. Both endpoints are the standart RESTful API endpoint to get all devices information which is included firmware versions, users admin status, last updated date, email and device name. Only difference between them is one of them support sortable & pagination features in the backend and the other one is just support pagination in the backend. The idea behind this is to prove that I'm able to handle pagination and sorting in the backend side and also in the frontend side.
> To simulate the real world scenario, I've worked with the branches most of the time and commits which are conventional naming standards. 

**What I have done**
- I've reorganized the project structure to make it more readable and maintainable.
- I've created a new endpoint to support sorting and pagination in the backend side and also in the frontend side.
- I've generalized response structure to make it more readable and maintainable.
- I've created a handler for 404 errors for endpoints that do not exist.


### Prerequisites
- Node.js (version 14 or later recommended)
- npm (Node Package Manager) / yarn 
- SQLite3 database

### Server Setup
> In package.json file, the server is configured to run some sql scripts to create the database and populate it with some data. For local environment differences you may need to change the scripts in the package.json file. 
1. Navigate to the project root directory.
2. Start the server by running:
   ```bash
   npm install && npm run serve
### Client Setup
1. Navigate to the project root directory.
2. Start the server by running:
   ```bash
   npm run start
   
## Project Structure
- `http://localhost:4000/devices` - Standart RESTful API endpoint to get all devices information which is included firmware versions, users admin status, last updated date, email and device name. Support pagination.

  | Query Parameters | Description                                 | Is Required | Value Type | Min |
  |------------------|---------------------------------------------|-------------|------------|-----|
  | page             | This is the page number for paginating data | no          | number     | 1   |
  | pageSize         | This is the item size for per page          | no          | number     | 10  |

- `http://localhost:4000/devices-with-sorting` - Standart RESTful API endpoint to get all devices information which is included firmware versions, users admin status, last updated date, email and device name. Support sorting by columns and pagination.

  | Query Parameters | Description                                                                           | Is Required | Value Type | Min |   |
  |------------------|---------------------------------------------------------------------------------------|-------------|------------|-----|---|
  | page             | This is the page number for paginating data                                           | no          | number     | 1   |   |
  | pageSize         | This is the item size for per page                                                    | no          | number     | 10  |   |
  | sortColumn       | This is parameter for sorting by columns which is support all the fields in the table | no          | string     | -   |   |
  | sortDirection    | This is parameter for sorting column by "DESC" or "ASC"                               | no          | string     | -   |   |

