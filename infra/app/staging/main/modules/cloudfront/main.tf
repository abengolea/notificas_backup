locals {
  s3OriginId    = "${var.environment}-s3-cloudfront"
}


resource "aws_cloudfront_distribution" "s3_distribution" {
#  depends_on = [
#    aws_s3_bucket.s3_bucket
#  ]

  origin {
    domain_name = "${var.bucketName}.s3.amazonaws.com"
    origin_id   = local.s3OriginId
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = [var.domainName]

  default_cache_behavior {
    allowed_methods = [
      "GET",
      "HEAD",
    ]

    cached_methods = [
      "GET",
      "HEAD",
    ]

    target_origin_id = local.s3OriginId

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  price_class = var.priceClass

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

#  viewer_certificate {
#    cloudfront_default_certificate = true
#  }

  viewer_certificate {
    acm_certificate_arn      = var.certificateARN
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    error_caching_min_ttl = 0
    response_page_path    = "/"
  }

  wait_for_deployment = false
#  tags                = var.tags
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "access-identity-${var.domainName}.s3.amazonaws.com"
}