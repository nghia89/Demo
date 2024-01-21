# check ubuntu

    lsb_release -a

# vào setting-> actions-> runners

    - làm theo hướng dẩn
    - /actions-runner
    - sudo .svc.sh install
    - sudo .svc.sh start
# install node  
    https://github.com/nodesource/distributions
    sudo npm install pm2@latest -g
        - pm2 list
        - pm2 start server.js --name=shopdev-backend