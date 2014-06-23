
test:
	@$$(npm bin)/mocha --recursive -r should

test-debug:
	@DEBUG=xinput:* $$(npm bin)/mocha --recursive -r should

.PHONY: test test-debug
