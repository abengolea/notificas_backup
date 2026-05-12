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
  default = "preprod"
}

variable "zone" {
  default = "notificas.com"
}

variable "subdomain" {
  default = "preprod"
}

variable "certificateARN" {
  default = "arn:aws:acm:us-east-1:161855868410:certificate/cfe30ac2-3290-4233-9840-d1be2643afc8"
}