# update package ubuntu

    sudo apt-get update

# install nginx

    sudo aot-get install nginx

# check status

    sudo systemctl status nginx

# config nginx proxy

    - cd /etc/nginx/sites-available
    - sudo vim default
        location /api {
        rewrite ^\/api\/(.*)$ /api/$1 break;
        proxy_pass  http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    - :wq
    - sudo systemctl restart nginx

# Add domain to nginx configuration

    - cd /etc/nginx/sites-available

    - sudo vim default
        server_name shoptest.com www.shoptest.com;

        location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        }
    - :wq
    - sudo systemctl restart nginx

# add SSL to domain

    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install python3-certbot-nginx
    sudo certbot --nginx -d  shoptest.com
    sudo certbot renew --dry-run
    sudo systemctl status certbot.timer
