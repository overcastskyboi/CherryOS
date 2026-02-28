terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 4.0.0"
    }
  }
}

# Provider configuration using your verified credentials
provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = "ocid1.user.oc1..aaaaaaaagkfrqaki6xfamthimpavmfkoys74rcgzdr6dggy4yuntdt6ziyrq"
  fingerprint      = "1e:6a:0c:3e:74:e5:26:b6:54:1c:57:8f:09:b9:42:aa"
  private_key_path = "C:/Users/unkno/.oci/oci_api_key.pem"
  region           = "us-ashburn-1"
}

variable "tenancy_ocid" {
  default = "ocid1.tenancy.oc1..aaaaaaaaxali3cqeyf6zqg4tibyerul2rye46rclhp3rktpzc47ivwrhgema"
}

variable "compartment_ocid" {
  description = "Defaults to Root Tenancy"
  default     = "ocid1.tenancy.oc1..aaaaaaaaxali3cqeyf6zqg4tibyerul2rye46rclhp3rktpzc47ivwrhgema"
}

variable "namespace" {
  default = "idg3nfddgypd"
}

resource "oci_objectstorage_bucket" "cherryos_deploy" {
  compartment_id = var.compartment_ocid
  namespace      = var.namespace
  name           = "cherryos-deploy-prod"
  access_type    = "ObjectRead"
  storage_tier   = "Standard"
  
  # Requirement: Ensure versioning is enabled
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
