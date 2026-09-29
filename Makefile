
-include .env

# FIXME: the date suffix does not work
KEY_PATH ?= $(HOME)/.ssh/github-actions-wildlog-$(shell date +"%Y-%m-%dT%H:%M:%S%z")

gen-ssh-keys:
	@ssh-keygen -t ed25519 -C github-actions-wildlog -N "" -f "$(KEY_PATH)"
	@echo "Private key to store on GitHub as DEPLOY_SSH_KEY:"
	@cat "$(KEY_PATH)"
	@ssh-copy-id -i "$(KEY_PATH).pub" "$(SERVER_USER)@$(SERVER_DOMAIN)"
