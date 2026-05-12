variable "credentials" {
  default = "~/.aws/credentials"
}

variable "region" {
  default = "us-east-1"
}

variable "app" {
  default = "notificas-app"
}

variable "environment" {
  default = "prod"
}

variable "zone" {
  default = "notificas.com"
}

variable "subdomain" {
  default = "app"
}
