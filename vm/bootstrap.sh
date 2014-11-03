# Update System
apt-get update

# Install Python & Virtualenv
apt-get install -y python-dev
apt-get install -y python-virtualenv

# Install Redis Server
apt-get install -y redis-server

# Set timezone
echo "America/Sao_Paulo" | sudo tee /etc/timezone
sudo dpkg-reconfigure --frontend noninteractive tzdata

# Install Nodejs
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs

# Install NGINX
apt-get install -y nginx

# Configure NGINX web servers
cp /vagrant/vm/nginx.py /etc/nginx/sites-available/py
cp /vagrant/vm/nginx.js /etc/nginx/sites-available/js
cp /vagrant/vm/nginx.site /etc/nginx/sites-available/site

ln -s /etc/nginx/sites-available/py /etc/nginx/sites-enabled/py
ln -s /etc/nginx/sites-available/js /etc/nginx/sites-enabled/js
ln -s /etc/nginx/sites-available/site /etc/nginx/sites-enabled/site

sed -i 's/sendfile on;/sendfile off;/' /etc/nginx/nginx.conf

# Set hosts
echo "192.168.33.1   vagrant" >> /etc/hosts
echo "192.168.33.2   py.realtime.com" >> /etc/hosts
echo "192.168.33.3   js.realtime.com" >> /etc/hosts
echo "192.168.33.4   site.realtime.com" >> /etc/hosts

# Install & configure Supervisor
apt-get install -y supervisor
cp /vagrant/vm/supervisor /etc/supervisor/conf.d/default.conf

# Setup Virtualenv & install python poroject dependecies
su vagrant
cd /home/vagrant
virtualenv env
. env/bin/activate
pip install -r /vagrant/api/py/requirements.txt
deactivate
sudo -i

# Restart services
service supervisor restart
service nginx restart
service redis-server restart