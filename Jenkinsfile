library identifier: "pipeline-library@master", retriever: modernSCM(
  [$class: "GitSCMSource",
   remote: "https://github.com/redhat-cop/pipeline-library.git"])

pipeline {
    agent {label 'jenkins-slave-npm'}

    environment {
        CI_CD_PROJECT = "${OPENSHIFT_BUILD_NAMESPACE}"
        //root of source code
        SOURCE_CONTEXT_DIR = ""

        //location of distribution files
        DIST_CONTEXT_DIR = "dist/"
        APP_NAME = "frontend-demo"
        DEV_PROJECT = CI_CD_PROJECT.replace('ci-cd', 'dev')
        DEMO_PROJECT = CI_CD_PROJECT.replace('ci-cd', 'test')

    }

    stages {
        stage('Install Global Apps') {
            steps {
                echo '=============================================Entering Stage 1 - Install Globals======================================'
                sh 'npm install'

            }
        }
         stage('E2E Testing') {
            steps {
                sh "npm run test:e2e"
            }
        }
        stage('Lint') {
            steps {
                echo '=============================================Entering Stage 4 - Build App======================================'
                sh "npm run lint"
            }
        }
        
        stage('Unit Test') {
            steps {
                sh "npm run test:unit"
            }
        }
        stage('Build') {
            steps {
                sh "npm run build"
            }
        }
        /*
        stage('Static Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner-tool';
                    withSonarQubeEnv('sonar') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }   
        */
        stage('Build Image') {
            steps {
                binaryBuild(projectName: "${CI_CD_PROJECT}", buildConfigName: "${APP_NAME}", artifactsDirectoryName: "${DIST_CONTEXT_DIR}")
            }
        }
        stage('Deploy to Dev') {
            steps {
                tagImage(sourceImageName: "${APP_NAME}", sourceImagePath: "${CI_CD_PROJECT}", toImagePath: "${DEV_PROJECT}", toImageTag: "deployed")
                verifyDeployment(targetApp: "${APP_NAME}", projectName: "${DEV_PROJECT}")
            }
        }

        stage('Promotion gate') {
            steps {
                script {
                input message: 'Promote application to Test?'
                }
            }  
        }
        stage('Deploy to Demo') {
            steps {
                tagImage(sourceImageName: "${APP_NAME}", sourceImagePath: "${DEV_PROJECT}", sourceImageTag: "deployed", toImagePath: "${DEMO_PROJECT}", toImageTag: "deployed")
                verifyDeployment(targetApp: "${APP_NAME}", projectName: "${DEMO_PROJECT}")
            }
        }

    }
}
