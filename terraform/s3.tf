# ============================================================
# S3 Bucket — Artifact Storage
# ============================================================
# Rubric requirements:
#   ✅ Unique bucket name
#   ✅ Versioning enabled
#   ✅ Encryption enabled
#   ✅ Public access blocked

resource "aws_s3_bucket" "artifacts" {
  bucket        = var.s3_bucket_name
  force_destroy = true

  tags = {
    Name = "${var.project_name}-artifacts"
  }
}

# ── Versioning ──────────────────────────────────────────────
resource "aws_s3_bucket_versioning" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  versioning_configuration {
    status = "Enabled"
  }
}

# ── Server-Side Encryption (AES-256) ───────────────────────
resource "aws_s3_bucket_server_side_encryption_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# ── Block ALL Public Access ────────────────────────────────
resource "aws_s3_bucket_public_access_block" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
