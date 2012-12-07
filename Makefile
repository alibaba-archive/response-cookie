TESTS = test/*.test.js
TIMEOUT = 1000
MOCHA_OPTS =
REPORTER = spec
JSCOVERAGE = ./node_modules/jscover/bin/jscover

test:
	@NODE_ENV=test node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) --timeout $(TIMEOUT) $(MOCHA_OPTS) $(TESTS)

test-cov: lib-cov
	@RESPONSE_COOKIE_COV=1 $(MAKE) test REPORTER=dot
	@RESPONSE_COOKIE_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -rf $@
	@$(JSCOVERAGE) lib $@

.PHONY: test test-cov lib-cov

