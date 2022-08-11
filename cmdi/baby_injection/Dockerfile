FROM php:7-apache
COPY flag1 /flag1
RUN chmod 444 /flag1
COPY flag2 /flag2
RUN chmod 400 /flag2 
COPY readflag2.c /readflag2.c
RUN gcc /readflag2.c -o /readflag2
RUN chmod 555 /readflag2
RUN chmod u+s /readflag2
COPY index.php /var/www/html/
RUN  chmod 777 /var/www/html/
USER www-data
