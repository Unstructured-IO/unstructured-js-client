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
# Test 		#
#############

## test-unit:					run unit tests
.PHONY: test-unit
test-unit:
	npx jest --config jest.config.js test/unit

## test:					run all tests
.PHONY: test
test: test-unit

#############
# Speakeasy #
#############

## client-generate:			generate speakeasy client locally
.PHONY: client-generate
client-generate:
	wget -nv -q -O openapi.json ${OPENAPI_DOCS_URL}
	speakeasy overlay validate -o ./overlay_client.yaml
	speakeasy overlay apply -s ./openapi.json -o ./overlay_client.yaml > ./openapi_client.json
	speakeasy generate sdk -s ./openapi_client.json -o ./ -l typescript
