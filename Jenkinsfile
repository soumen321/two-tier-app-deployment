pipeline {
    agent any
    
    tools { 
        jdk 'jdk17'
    }
    
    environment {
        VERSION = "1.0"
        SONAR_HOME = tool 'sonar-scanner' 
    }
    
    stages {
        stage("Code"){
            steps {
                echo "Cloning ther code"
                git url:"https://github.com/soumen321/two-tier-app-deployment.git",branch : "main"
            }
        }
        stage('Build'){
            steps {
                echo "Building the code"
                sh "docker build -t two-tier-remider-app -f ./build/Dockerfile.prod ." 
            }
            
        }
        stage('SonarQube Analysis'){
            steps {
                echo "Sonarqube scan"
                
                
               withSonarQubeEnv("sonar-server"){
                   sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=two-tier-remider-app -Dsonar.projectKey=two-tier-remider-app -X"
               }
            }
            
        }
        stage('trivy') {
            steps {
               echo "Trivy scan"
               sh "trivy trivy image two-tier-remider-app:${VERSION}"
            }
        }

        stage('Push to Docker Hub'){
            steps {
                echo "Pushing the image to dicker image"
                withCredentials([usernamePassword(credentialsId:"dockerHub",passwordVariable:"dockerHubPass",usernameVariable:"dockerHubUser")]){
                sh "docker tag two-tier-remider-app ${env.dockerHubUser}/two-tier-remider-app:${VERSION}"    
                sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}" 
                sh "docker push ${env.dockerHubUser}/two-tier-remider-app:${VERSION}"
                }
            } 
        }
        stage('Deploy'){
            steps {
                echo "Deploying the coniainer"
                sh "docker-compose -f reminder.yml down && VERSION=${VERSION} docker-compose -f reminder.yml up -d"
            }
        }
    }
}
