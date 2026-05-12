variable "environment" {
  description = "name of the deployment"
}

variable "region" {
  description = "region of the deployment"
}


variable "domainName" {
  description = "name the domain"
}

variable "priceClass" {
  description = ""
  default = "PriceClass_200"
}

variable "bucketName" {
  description = "name the domain with region"
}

variable "certificateARN" {
  description = "certificate for the domain"
  default = "arn:aws:acm:us-east-1:161855868410:certificate/a21678e6-6bad-4158-a1d0-d20cf9a6b318"
}
