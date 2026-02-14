aws_region     = "us-east-1"
project_name   = "electromart"
environment    = "prod"
instance_type  = "t3.small"

# Docker Images
backend_image  = "sang71315/electromart-backend:latest"
frontend_image = "sang71315/electromart-frontend:latest"

# MongoDB Atlas connection string
mongodb_uri = "mongodb+srv://pamudithasandaru2002_db_user:dFnwOBk7KTdzTNuP@cluster0.s2fli9w.mongodb.net/electromart1?retryWrites=true&w=majority"

# SSH Public Key for EC2 access
ssh_public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCZhb2p7bJf7ZrwhFUi+dWBw5+DgvqUSxEKBgc7IzBMo2RUY42OmG77ABDjjBGJP38Qmh1YtI4OREnmg0vwFQ8CX5TVrde45Q35BS7s8SQVIm+MakXLfnJPQi0dyeDFY1CvM8QfzDGYdOR0yab85fPRpURLbFjTMCWJDgxAsFduFqwYNgkdClHD7xPu/JGZns0vto9O+up/CeiZH6+m8mnR5z5Q2SAipV/wPM70v9sRyylNVkxexiT7RdLIV6Ka94lvlQdrT1IRCZoBaSfnn6CCg/gs4r+Hp8E5q/pMZbzDDBGKMSRzhPS+1Xsu0Xl47tOkmOyyRwKy9Gv76R6j0vz9k+0qTFnDfEg6xEGXpk8W8EDuVmLgxUBb1/OZQC6hqUqaXTY+ozm/baPnivQzv6iEEnUlX6nnGAI7emBIbtKvljHP07Iy+qid5YWIxVNeK6e3pt0FR13mqSqPWyfbNN9yOCNnvRDuBJrpeWKPSefnVVbSD51dML5q6CnCOjZkC3B4++ZE5SdmZ/Rc/XpgOjwLnp5nCsusSIs5CjZ0/Hue40jbP7CNMpQ/iB07Y8ZLrxU3jL0OpoO3p/YBwRBjhRDGiqG9Q8kPi5CzZzbrpd9+GWZHWICw2Ix6BLVUDBk5VSpwDV9N7jLrSEdW5COqCtgxmpu3JpNI1uJ2BB5J7myicw== jenkins@LAPTOP-U0ICE5M9"
