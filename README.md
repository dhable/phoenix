# Phoenix: Mobile POS API

This is a revamp (from memory) of the mobile point of sale API layer, but this time written
in node.js.

__This project is no longer maintained.__

## Dev Env Setup

There are a few tools that you'll need to install on your local machine before you can work
with the Phoenix project. Unless otherwise noted, you should probably use a package manager
like Homebrew to install these packages.

* node.js
* grunt-cli
* ansible
* VirutalBox (required for Vagrant - not in Homebrew)
* Vagrant (not in Homebrew)

Details on the installation are beyond this README file. Use Google to figure out the details
or Stack Overflow if you have problems.


## Getting Started with the Project

To start testing out the project, you'll first need to install all of the ansible third party
packages that we depend upon. Simply execute ```ansible-galaxy install -r provisioning/requirements.txt```
from the project root. If you have ansible installed correctly, this should install a series of
ansible roles globally.

Next you can build a virtual machine by type ```vagrant up```. This may take up to 10 minutes
as this builds a new server box using the ansible scripts and the vagrant base image. When you're
done, you should have a PostgreSQL DB and node.js installation in vagrant that you can use.

    NOTE: This will bind the PostgreSQL database to port 5432. If you have a local installation
    of PostgreSQL, the vagrant image may have trouble binding.

Next start the application using ```node app.js``` from the project root. The app should apply all
of the database migrations in order on boot, leaving you with a fully functional database.
