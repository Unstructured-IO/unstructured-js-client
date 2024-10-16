PACKAGE_NAME := unstructured-js-client
CURRENT_DIR := $(shell pwd)
ARCH := $(shell uname -m)
DOCKER_IMAGE ?= quay.io/unstructured-io/unstructured-api:latest
OPENAPI_DOCS_URL ?= https://api.unstructured.io/general/openapi.json

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

## check:					lint the client
.PHONY: check
check:
	npx eslint src/

#############
# Test 		#
#############

## test-unit:					run unit tests
.PHONY: test-unit
test-unit:
	npx vitest --dir test/unit --run --reporter verbose --config vitest.config.ts

## test-integration:			run integration tests
.PHONY: test-integration
test-integration:
	npx vitest --dir test/integration --run --reporter verbose --config vitest.config.ts

## test:					run all tests
.PHONY: test
test: test-unit test-integration

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
