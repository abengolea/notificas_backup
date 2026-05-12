variable "credentials" {
  default = "~/.aws/credentials"
}

variable "region" {
  default = "us-east-1"
}

variable "app" {
  default = "notificas"
}

variable "environment" {
  default = "dev"
}

variable "webBucketName" {
  default = "dev-notificas"
}

variable "zone" {
  default = "notificas.com"
}

variable "subdomain" {
  default = "website-stagging"
}