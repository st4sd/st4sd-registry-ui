FROM nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
WORKDIR /code
COPY ./dist .
EXPOSE 8080:8080

RUN echo 'You can find the licenses of GPL packages in this container under \n\
/usr/share/doc/${PACKAGE_NAME}/copyright \n\
\n\
If you would like the source to the GPL packages in this image then \n\
send a request to this address, specifying the package you want and \n\
the name and hash of this image: \n\
\n\
IBM Research Ireland,\n\
IBM Technology Campus\n\
Damastown Industrial Park\n\
Mulhuddart Co. Dublin D15 HN66\n\
Ireland\n' >/gpl-licenses

CMD ["nginx", "-g", "daemon off;"]