# syntax=docker/dockerfile:1
# The first line to add to a Dockerfile is a # syntax parser directive.
# While optional, this directive instructs the Docker builder what syntax to use when parsing the Dockerfile
# and allows older Docker versions with BuildKit enabled to upgrade the parser before starting the build.
# Parser directives must appear before any other comment, whitespace, or Dockerfile instruction in your Dockerfile, and should be the first line in Dockerfiles.

# when we use the FROM command, we tell Docker to include in our image all the functionality from the node:lts-alpine image.
FROM node:lts-alpine
# The NODE_ENV environment variable specifies the environment in which an application is running (usually, development or production).
# One of the simplest things you can do to improve performance is to set NODE_ENV to production.
ENV NODE_ENV production
# To make things easier when running the rest of our commands, let’s create a working directory.
# This instructs Docker to use this path as the default location for all subsequent commands.
# This way we do not have to type out full file paths but can use relative paths based on the working directory.
WORKDIR /app
# Usually the very first thing you do once you’ve downloaded a project written in Node.js is to install npm packages.
# This ensures that your application has all its dependencies installed into the node_modules directory where the Node runtime will be able to find them.
# Before we can run npm install, we need to get our package.json and package-lock.json files into our images.
COPY ["package.json", "package-lock.json*", "./"]
# Note that, rather than copying the entire working directory, we are only copying the package.json file. This allows us to take advantage of cached Docker layers.
# Once we have our files inside the image, we can use the RUN command to execute the command npm install.
# This works exactly the same as if we were running npm install locally on our machine,
# but this time these Node modules will be installed into the node_modules directory inside our image.
RUN npm install --production
# At this point, we have an image that is based on node and we have installed our dependencies.
# The next thing we need to do is to add our source code into the image.
# We’ll use the COPY command just like we did with our package.json files above.
COPY . .
# The COPY command takes all the files located in the current directory and copies them into the image.
# Now, all we have to do is to tell Docker what command we want to run when our image is run inside of a container.
# We do this with the CMD command.
CMD ["node", "index.js"]