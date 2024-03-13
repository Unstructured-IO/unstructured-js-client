PACKAGE_NAME := unstructured-js-client
CURRENT_DIR := $(shell pwd)
ARCH := $(shell uname -m)
DOCKER_IMAGE ?= quay.io/unstructured-io/unstructured-api:latest
OPENAPI_DOCS_URL ?= https://raw.githubusercontent.com/Unstructured-IO/unstructured-api/main/openapi.json

###########
# Install #
###########

## install:					installs all modules
.PHONY: install
install:
	npm install

###########
# Build #
###########

## build:					build client
.PHONY: build
build:
	npm run build

#############
# Speakeasy #
#############

## client-generate:			generate speakeasy client locally
.PHONY: client-generate
client-generate:
	speakeasy generate sdk -s ${OPENAPI_DOCS_URL} -o ./ -l typescript
