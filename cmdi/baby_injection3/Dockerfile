FROM php:7-apache
RUN rm -rf /usr/local/lib/php
COPY flag2 /flag2
RUN chmod 400 /flag2 
COPY readflag2.c /readflag2.c
RUN gcc /readflag2.c -o /readflag2
RUN chmod 555 /readflag2
RUN chmod u+s /readflag2
COPY index.php /var/www/html/
RUN chmod 555 /var/www/html/index.php 
RUN  chmod 777 /var/www/html/
USER www-data
