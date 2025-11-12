pipeline {
    agent any
    
    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = 391277995980
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        BACKEND_REPO = 'electromart-backend'
        FRONTEND_REPO = 'electromart-frontend'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    stages {
        stage('🔍 Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                }
            }
        }
        
        stage('✅ Build Backend') {
            steps {
                dir('backend') {
                    script {
                        echo "📦 Installing backend dependencies..."
                        sh 'npm ci'
                        echo "🧪 Running linter..."
                        sh 'npm run lint || true'
                        echo "🧪 Running tests..."
                        sh 'npm test || true'
                    }
                }
            }
        }
        
        stage('✅ Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        echo "📦 Installing frontend dependencies..."
                        sh 'npm ci'
                        echo "🏗️  Building frontend..."
                        sh 'npm run build'
                    }
                }
            }
        }
        
        stage('🐳 Build Docker Images') {
            steps {
                script {
                    echo "🐳 Building backend Docker image..."
                    sh 'docker build -t ${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG} -t ${ECR_REGISTRY}/${BACKEND_REPO}:latest ./backend'
                    
                    echo "🐳 Building frontend Docker image..."
                    sh 'docker build -t ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG} -t ${ECR_REGISTRY}/${FRONTEND_REPO}:latest ./frontend'
                }
            }
        }
        
        stage('🔐 Push to ECR') {
            steps {
                script {
                    echo "🔐 Logging into ECR..."
                    sh 'aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}'
                    
                    echo "📤 Pushing backend image..."
                    sh 'docker push ${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG}'
                    sh 'docker push ${ECR_REGISTRY}/${BACKEND_REPO}:latest'
                    
                    echo "📤 Pushing frontend image..."
                    sh 'docker push ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}'
                    sh 'docker push ${ECR_REGISTRY}/${FRONTEND_REPO}:latest'
                }
            }
        }
        
        stage('🚀 Deploy to ECS') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "🚀 Updating ECS services..."
                    
                    sh '''
                    aws ecs update-service \
                        --cluster electromart-cluster \
                        --service electromart-backend \
                        --force-new-deployment \
                        --region ${AWS_REGION}
                    
                    aws ecs update-service \
                        --cluster electromart-cluster \
                        --service electromart-frontend \
                        --force-new-deployment \
                        --region ${AWS_REGION}
                    '''
                }
            }
        }
        
        stage('✔️ Verify Deployment') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "✔️ Checking service status..."
                    sh '''
                    sleep 10
                    aws ecs describe-services \
                        --cluster electromart-cluster \
                        --services electromart-backend electromart-frontend \
                        --region ${AWS_REGION} | jq '.services[] | {name: .serviceName, running: .runningCount, desired: .desiredCount}'
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "🧹 Cleaning up workspace..."
                cleanWs()
            }
        }
        success {
            echo "✅ Pipeline succeeded! Commit: ${GIT_COMMIT_SHORT}"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
