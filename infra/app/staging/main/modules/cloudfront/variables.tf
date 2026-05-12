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
  default = "arn:aws:acm:us-east-1:161855868410:certificate/cfe30ac2-3290-4233-9840-d1be2643afc8"
}
