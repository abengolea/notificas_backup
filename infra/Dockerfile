FROM python:3.8-slim

RUN apt-get update && apt-get install --no-install-recommends -y zip unzip wget curl jq
RUN pip install awscli==1.18.66 boto3>=1.13.16
RUN mkdir -p /tools && cd /tools
RUN wget https://releases.hashicorp.com/packer/1.6.0/packer_1.6.0_linux_amd64.zip
RUN wget https://releases.hashicorp.com/terraform/0.12.28/terraform_0.12.28_linux_amd64.zip
RUN unzip packer_1.6.0_linux_amd64.zip -d /tools/packer
RUN unzip terraform_0.12.28_linux_amd64.zip -d /tools/terraform
