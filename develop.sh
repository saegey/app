#!/bin/bash

npm install

bower install

foreman start -f Procfile.development
