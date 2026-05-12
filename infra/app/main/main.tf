module "s3" {
  source        = "./modules/s3"
  environment   = "${var.app}-${var.environment}"
  region        = var.region
  webBucketName = var.webBucketName
}
