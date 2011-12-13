mongo:
	@mkdir -p /tmp/heat4us && mongod --dbpath /tmp/heat4us

workers:
	@COUNT=5 QUEUE=* rake resque:workers
