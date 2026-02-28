resource "oci_objectstorage_bucket" "cherryos_deploy" {
  compartment_id = var.compartment_ocid
  namespace      = var.namespace
  name           = "cherryos-deploy-prod"
  access_type    = "ObjectRead"
  storage_tier   = "Standard"
  
  versioning     = "Enabled"

  freeform_tags = {
    "Project"     = "CherryOS"
    "Environment" = "Production"
    "ManagedBy"   = "Terraform"
  }
}

output "bucket_id" {
  value = oci_objectstorage_bucket.cherryos_deploy.bucket_id
}

output "namespace" {
  value = var.namespace
}
