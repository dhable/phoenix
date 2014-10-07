# Phoenix: Jetway.io Mobile POS API


## Dev Env Setup

There are a few tools that you'll need to install on your local machine before you can work
with the Phoenix project. Unless otherwise noted, you should probably use a package manager
like Homebrew to install these packages.

* node.js
* grunt-cli
* VirutalBox (required for Vagrant - not in Homebrew)
* Vagrant (not in Homebrew)

Details on the installation are beyond this README file. Use Google to figure out the details
or Stack Overflow if you have problems.


## Getting Started with the Project

To start testing out the project, type ```vagrant up``` to boot a local PostgreSQL environment
that's setup with the jetway_pos database and the jetway user. This should match the configuration
default values so the app will connect to the DB without a problem.

    NOTE: This will bind the PostgreSQL database to port 5432. If you have a local installation
    of PostgreSQL, the vagrant image may have trouble binding.

Next start the application using ```node app.js``` from the project root. The app should apply all
of the database migrations in order on boot, leaving you with a fully functional database.
