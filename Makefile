default:
	npm run bootstrap
	cd packages/provider && npm run build && cd ../..
	cd packages/dlt-abstract && npm run build && cd ../..
	cd packages/search && npm run build && cd ../..
	cd packages/core && npm run build && cd ../..
	cd packages/dlt-bitcoin && npm run build && cd ../..
	cd packages/dlt-ethereum && npm run build && cd ../..
	cd packages/dlt-ripple && npm run build && cd ../..
	cd packages/bundle && npm run build && cd ../..
