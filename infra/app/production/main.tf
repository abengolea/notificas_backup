provider "aws" {
  region                  = var.region
  shared_credentials_file = var.credentials
  profile                 = var.app
}

terraform {
  backend "s3" {
    bucket         = "terraform-alberione-main"
    key            = "terraform/notificas-app/website"
    encrypt        = false
    dynamodb_table = "alberione-terraform-remote-locking"
    region         = "us-east-1"
    profile        = "alberione"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "< 4.0.0"
    }
  }
}

module "main" {
  source        = "../main"
  app           = var.app
  environment   = var.environment
  region        = var.region
  webBucketName = "${var.subdomain}.${var.zone}"
}

module "cloudfront" {
  source      = "../../modules/cloudfront"
  environment = var.environment
  region      = var.region
  bucketName  = "${var.subdomain}.${var.zone}"
  domainName  = "${var.subdomain}.${var.zone}"
}