# set base image (host OS)
FROM python:3.10

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get -y update
RUN apt-get install -y curl nano wget nginx git

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list





# Mongo
# RUN ln -s /bin/echo /bin/systemctl
# RUN wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
# RUN echo "deb http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
RUN apt-get -y update
# RUN apt-get install -y mongodb-org

# Install Yarn
RUN apt-get install -y yarn

# Install PIP
# RUN easy_install pip
RUN apt-get install -y python3-pip


ENV ENV_TYPE staging
ENV MONGO_HOST mongo
ENV MONGO_PORT 27017
ENV PYTHONPATH=$PYTHONPATH:/src/

##########

# Set working directory
WORKDIR /src

COPY src/app /src/app
COPY src/rest /src/rest
# Copy requirements and install Python dependencies
COPY src/rest/requirements.txt .
RUN pip install -r requirements.txt

# Copy package.json and yarn.lock, then install Node.js dependencies
# COPY src/app/package.json ./app/

RUN cd app && yarn install

# Copy the rest of the project
COPY . .

# Expose ports
EXPOSE 8000 3000 27017