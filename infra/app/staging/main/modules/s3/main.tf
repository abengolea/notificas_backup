resource "aws_s3_bucket" "web" {
  bucket = var.webBucketName
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]#["https://notificas.com"]
    expose_headers  = ["Authorization"]
    max_age_seconds = 3000
  }

  tags = {
    Name        = var.webBucketName
    Environment = var.environment
  }
}

resource "aws_s3_bucket_policy" "static_website_read" {
  bucket = aws_s3_bucket.web.id
  policy = templatefile("${path.module}/documents/webPolicy.json",
             {WEB_BUCKET = var.webBucketName})
}