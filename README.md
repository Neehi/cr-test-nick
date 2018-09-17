# Clear Review Technical Test

<!--The test is to create a small web based app that uses an Django Rest Framework API and Angular. There are requirements below. Regularly commit to the repo and write tests.

## Requirements

Produce a web application with a backend API that will take a sentence, splits it into whole words and store the words in a database. The web application must then be able to list all the unique words and how many times they appear in the database. Add a input box that a user can enter words that will filter the list. The filter does not have to match the whole word. Highlight in the word where the search matches. Style the web application to look nice. Document in this README how to run the appliction.-->

## Requirements
In order to run the test app you will require the following:

**Backend**
* Docker and Docker Compose for installing and running the backend server, as the entire setup and installation assumes the project is being run from Docker. If Docker is not already installed on your system, it can be downloaded from docker.com and installation instruction can be found here.

**Frontend**
* Node.js; installers available from [nodejs.org](https://nodejs.org/en/) (LTS Version)

## Getting Started
The source for the test app can be found [here](https://github.com/onetouchapps/cr-test-nick) on Github.

### Clone
The simplest way to install the project is using git to clone the repository.
```
$ git clone git@github.com:onetouchapps/cr-test-nick.git
```
This will install the project to a folder called cr-test-nick where the command was run from.

If you want to install the repository elsewhere, or give it a different name, then add this parameter at the end of the command.
```
$ git clone git@github.com:onetouchapps/cr-test-nick.git /path/to/repo
```

### Download
Alternatively, you can download ZIP archives of specific releases from [here](https://github.com/onetouchapps/cr-test-nick/releases/).

### Code Style
We use strict [pep8](https://www.python.org/dev/peps/pep-0008/) for line lengths. You should configure your editor/IDE to lint your code with this, or alternatively, you can use the provided pre-commit hook:

```
ln -s pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

(If you're using unix tools provided by Git for Windows, you may need to cd into `.git\hooks` before creating the symlink.)

This will run pycodestyle on commit and reject the commit if any style violations are found.

We use [isort](https://github.com/timothycrosley/isort) to check that the imports have been sorted correctly. Using the `-c` flag will only check if the imports are sorted correctly. Without the flag isort will make the changes and with the flag it will only show you what needs to be changed.
```
isort -rc -c testapp
```

## Build and Launch the Backend API

### .env file
Before you can build the containers for the API, you will need to make sure you have a suitable .env file in your project root. If this is your first time running the test app then you can use the example .env file included with the code by running:
```
$ cd /path/to/repo
$ cp .env.example .env
```
*Note: If you wish to customise your environment then see the section on customisation below.*

### Docker Build and Launch
In order to launch the test app, simply change to the folder where the project was installed to and run docker compose to build and run the containers.
```
$ cd /path/to/repo
$ docker-compose up
```

In order to run a container in the background use:
```
$ docker-compose up -d
```

*Note: if you have cloned the backend repo to a directory other than the default (`cr-test-nick`), you should include the -p flag to ensure the correct project name is used: i.e. `docker-compose -p crtestnick up`*

The container images should automatically download and the containers should build successfully.

You can use `docker-compose up --build` to build the images before starting the containers or use `docker-compose up --force-recreate` to force docker to recreate the containers.

If for some reason you wish to do a fresh install and need to remove the existing containers you can use `docker-compose down` or `docker-compose rm` then try re-installing with `docker-compose up --build` or `docker-compose up --force-create`.

To exit a container running in the background use `docker-compose stop` or to exit a container  running in the foreground use `Ctrl+C`.

*Note: You should use `docker-compose stop` to exit a container. `docker-compose down` should only be done when you want to do a fresh install, as it will wipe data in the container.*

### Default Settings
The default setting project settings are:

|Description|Value|
|---|---|
|Django Port|8000|
|Postgres Port|5432|
|Postgres Database|postgres|
|Postgres Username|postgres|
|Postgres Password|secret|

Default container names are:

|Description|Name|
|---|---|
|Django Container|cr-test-nick_web_1|
|Postgres Container|cr-test-nick_db_1|

### Customising the Project Settings
If you wish to customise/change the project setup, such as database name or password, then this can be done by modifying the .env file and/or the Django settings module, found under /code/settings.

#### .env file Settings
|Setting|Description|Default|
|---|---|---|
|DJANGO_PORT|Django port number|8000|
|DJANGO_DEBUG|Enable debug mode|(as per settings module)|
|DJANGO_ADMIN_URL|URL of the Django admin module|(as per settings module)|
|DJANGO_SETTINGS_MODULE|Location of the Django settings module|config.settings.local|
|DJANGO_SECRET_KEY|Django secret|CHANGEME!!!|
|DJANGO_ALLOWED_HOSTS|String/CSV|(defaults to localhost)|
|POSTGRES_HOST|Docker Postgres service|db|
|POSTGRES_PORT|Postgres port number|5432|
|POSTGRES_DB|Postres database name|postgres|
|POSTGRES_USER|Postgres user name|postgres|
|POSTGRES_PASSWORD|Postgres password|secret|
|EXT_DJANGO_PORT|Host Django port|8000|
|EXT_POSTGRES_PORT|Host Postgres port|5432|

#### Django settings module
Details on the Django settings module can be found [here](https://docs.djangoproject.com/en/2.0/topics/settings/).

Details on individual settings for Django and relevant third-party modules can be found at the following:

|Description|URL|
|---|---|
|Django|https://docs.djangoproject.com/en/2.0/ref/settings/|
|Rest Framework|http://www.django-rest-framework.org/api-guide/settings/|

*Note: details of individual Django settings are beyond the scope of this guide.*

### Create/Populate the Database
Before actually using the website you will need to run the migrations to build the application tables, which you will need to do from the Docker container.
First run a shell on the container:
```
docker exec -it <container name> /bin/bash
```
*Note: If running with default project and container names this will likely be `cr-test-nick_web_1`*

This should default you to the `/srv/api` directory, then from the shell run:
```
$ python manage.py migrate
```

Once the migrations have been run the next step is to create a super user. From the same shell run:
```
$ python manage.py createsuperuser
```
*You will be prompted to enter name, email and password of your super user.*

Once completed you will need to restart the docker container.

### Testing the Backend API
The backend comes with its own suite of unit tests.

In order to run any of the unit tests, you'll need to run a shall on the container.

The simplest way to run the tests is to use the provided python script:
```
$ ./run_tests.py
```
This will run the unit tests and by default run the pycodestyle linter and isort. There are several options available with the script, which can be seen by running `./run_tests.py --help`.

Optionally you can run the tests using the Django test runner directly.
```
$ ./manage.py tests testapp
```

#### Test Coverage
Coverage has been installed on the container so the overall test coverage can be checked.

The simplest way to get the coverage report is to run it with the provided test script:
```
$ coverage run run_tests.py
```

Optionally coverage can also be obtained using the Django test runner directly, by running `coverage run manage.py test tests`.

Once the tests have been completed, the most convenient way of viewing the coverage report is to generate an HTML version of the coverage report, which can be done as follows:
```
$ coverage html
```

You can then view the report in your browser my navigating to the path where you have the repo installed and opening `/path/to/repo/src/api/htmlcov/index.html`.

_Note: The `tests` and `migrations` folders are left out of the coverage report as they are not covered by the unit tests. I have also omitted `config` from the coverage report as testing the config settings is beyond the scope of these tests._

## Build and Launch the Frontend Application

Before building and launching the Angular frontend, you'll need to make sure you're within the client directory: `/path/to/repo/src/client`.

### Install Dependencies
In your client directory, run `npm install`. You only need to do this once to run the project initially, but it also needs to be run whenever the list of dependencies (in package.json) changes.

To check package.json for required versions of dependencies, run `npm list`.

### Start Development Server
Run `npm start`. This will start the Angular development server on [http://localhost:4200/](http://localhost:4200/).

If you need to get the backend up and running, please refer to the section on building and launching the backend further back in this readme.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

You can also use `npm test`.

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

You can also use `npm run e2e`.

## Accessing the Project Websites
|Description|Server/IP|
|---|---|
|Frontend|localhost:4200|
|Backend: API|localhost:8000/api|
|Backend: Admin Panel|localhost:8000/CP|
