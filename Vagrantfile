# -*- mode: ruby -*-
# vi: set ft=ruby :


# Shell script block to setup all non-Jetway services on the box.
$boxSetup = <<EOL
apt-get update
apt-get install --assume-yes python-software-properties python g++ make git
add-apt-repository --yes ppa:chris-lea/node.js

apt-get update
apt-get install --assume-yes nodejs postgresql postgresql-contrib

sudo -u postgres createdb jetway_pos 
sudo -u postgres psql -U postgres postgres <<EOS
  create user jetway password 'jetway'
EOS

npm install -g ndm
EOL


# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 5432, host: 5432
  config.vm.synced_folder ".", "/opt/jetway/phoenix"

  config.vm.provision :shell, :inline => $boxSetup
end
