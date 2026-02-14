output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.app.id
}

output "public_ip" {
  description = "Public IP address"
  value       = aws_eip.app.public_ip
}

output "application_url" {
  description = "Application URL"
  value       = "http://${aws_eip.app.public_ip}"
}

output "api_url" {
  description = "Backend API URL"
  value       = "http://${aws_eip.app.public_ip}:5000"
}

output "ssh_command" {
  description = "SSH command to connect"
  value       = "ssh -i /var/lib/jenkins/electromart-key ec2-user@${aws_eip.app.public_ip}"
}
