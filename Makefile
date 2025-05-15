.PHONY: build

build:
	docker build -t devops-velocity:latest .

run:
	docker run -it -p 9001:80 devops-velocity:latest