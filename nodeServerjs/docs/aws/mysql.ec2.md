#Install MySQL and start it using the following commands

    sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
    wget http://dev.mysql.com/get/mysql57-community-release-el7-8.noarch.rpm
    sudo yum localinstall -y mysql57-community-release-el7-8.noarch.rpm
    sudo yum install -y mysql-community-server

    sudo systemctl start mysqld
    sudo systemctl enable mysqld

#Get the password for the root user:

    sudo grep 'temporary password' /var/log/mysqld.log

#Login to MySQL:

    mysql -u root -p

#You have to change the root user's password before you can do anything, so run the following command to do that:

    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MyNewPass1!';
