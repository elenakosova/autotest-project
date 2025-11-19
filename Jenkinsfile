pipeline {
    agent any
    
    tools {
        nodejs 'nodejs-18'
    }
    
    environment {
        ALLURE_HOME = tool 'allure'
        BASE_URL_API = 'https://apichallenges.herokuapp.com'
        BASE_URL_UI = 'https://realworld.qa.guru'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/elenakosova/autotest-project.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install'
            }
        }
        
        stage('Run API Tests') {
            steps {
                sh 'npx playwright test --project=api --reporter=line,allure-playwright'
            }
        }
        
        stage('Run UI Tests') {
            steps {
                sh 'npx playwright test --project=ui --reporter=line,allure-playwright'
            }
        }
        
        stage('Generate Allure Report') {
            steps {
                sh '${ALLURE_HOME}/bin/allure generate allure-results --clean -o allure-report'
            }
        }
    }
    
    post {
        always {
            // Публикация Allure отчета в Jenkins
            allure includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']],
                report: 'allure-report'
            
            // Интеграция с Allure TestOps
            script {
                try {
                    allureTestOpsPublisher [
                        enabled: true,
                        baseUrl: 'https://allure.autotests.cloud',
                        credentialsId: 'allure-testops-credentials',
                        projectId: 'PW', 
                        testOpsId: 'autotest-project',
                        results: [[path: 'allure-results']]
                    ]
                } catch (Exception e) {
                    echo "Allure TestOps integration failed: ${e.message}"
                }
            }
            
            // Очистка
            sh 'rm -rf allure-results test-results playwright-report'
        }
        success {
            script {
                sh """
                curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
                -d chat_id="${TELEGRAM_CHAT_ID}" \
                -d text="✅ Все тесты прошли успешно!%0A%0A📊 Jenkins отчет: ${BUILD_URL}allure%0A📈 Allure TestOps: https://allure.autotests.cloud/project/PW"
                """
            }
        }
        failure {
            script {
                sh """
                curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
                -d chat_id="${TELEGRAM_CHAT_ID}" \
                -d text="❌ Часть тестов упала!%0A%0A🔍 Проверить логи: ${BUILD_URL}console%0A📊 Jenkins отчет: ${BUILD_URL}allure%0A📈 Allure TestOps: https://allure.autotests.cloud/project/PW"
                """
            }
        }
    }
}