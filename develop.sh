#!/bin/bash

npm install

cd client && bower install

cd .. && foreman start -f Procfile.development
