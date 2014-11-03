upstream tornadoes {
        server 192.168.33.2:8001;
        server 192.168.33.2:8002;
}

proxy_next_upstream error;

server {
        server_name py.realtime.com;
        listen 192.168.33.2;

        location ^~ /static/ {
            add_header Access-Control-Allow-Origin *;
            alias /vagrant/static/;
            if ($query_string) {
                expires max;
            }
        }

        location / {
            proxy_pass_header Server;
            proxy_set_header Host $http_host;
            proxy_set_header Origin $http_origin;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Scheme $scheme;
            proxy_pass http://tornadoes;
        }
}
