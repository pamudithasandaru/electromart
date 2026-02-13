# DocumentDB Subnet Group
resource "aws_docdb_subnet_group" "main" {
  count           = var.enable_mongodb ? 1 : 0
  name            = "${var.project_name}-docdb-subnet-group"
  subnet_ids      = aws_subnet.private[*].id
  tags = {
    Name = "${var.project_name}-docdb-subnet-group"
  }
}

# DocumentDB Cluster
resource "aws_docdb_cluster" "main" {
  count                           = var.enable_mongodb ? 1 : 0
  cluster_identifier              = "${var.project_name}-docdb"
  engine                          = "docdb"
  master_username                 = var.mongodb_username
  master_password                 = var.mongodb_password
  backup_retention_period         = 1
  preferred_backup_window         = "03:00-04:00"
  skip_final_snapshot             = true
  storage_encrypted               = true
  db_subnet_group_name            = aws_docdb_subnet_group.main[0].name
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.main[0].name
  vpc_security_group_ids          = [aws_security_group.documentdb[0].id]

  tags = {
    Name = "${var.project_name}-docdb"
  }

  depends_on = [
    aws_docdb_subnet_group.main
  ]
}

# DocumentDB Cluster Parameter Group
resource "aws_docdb_cluster_parameter_group" "main" {
  count       = var.enable_mongodb ? 1 : 0
  family      = "docdb5.0"
  name        = "${var.project_name}-docdb-params"
  description = "DocumentDB parameter group for ${var.project_name}"

  parameter {
    name  = "tls"
    value = "enabled"
  }

  tags = {
    Name = "${var.project_name}-docdb-params"
  }
}

# DocumentDB Cluster Instance
resource "aws_docdb_cluster_instance" "main" {
  count              = var.enable_mongodb ? 1 : 0
  identifier         = "${var.project_name}-docdb-instance-${count.index + 1}"
  cluster_identifier = aws_docdb_cluster.main[0].id
  instance_class     = "db.t3g.medium"
  engine              = "docdb"

  tags = {
    Name = "${var.project_name}-docdb-instance-${count.index + 1}"
  }

  depends_on = [
    aws_docdb_cluster.main
  ]
}
