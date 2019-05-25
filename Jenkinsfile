pipeline {
          
    agent any
 
    stages {

stage('Deliver for master') {
            when {
                branch 'master' 
            }
            steps {
                 sh 'ant -buildfile build/build.xml deployCode '
            }    
            
        }
  
stage('Deliver for development') {
            when {
                branch 'development' 
            }
            steps {
                 sh 'ant -buildfile build/build.xml deployEmptyCheckOnly '
                
            }
        }
  

stage('Deliver for staging') {
            when {
                branch 'staging' 
            }
            steps {
                 sh 'ant -buildfile build/build.xml deployEmptyCheckOnly '
                
            }
        }



stage('Deliver for qa') {
            when {
                branch 'qa' 
            }
            steps {
                 sh 'ant -buildfile build/build.xml deployEmptyCheckOnly '
                
            }
        }



stage('Deliver for uat') {
            when {
                branch 'uat' 
            }
            steps {
                 sh 'ant -buildfile build/build.xml deployEmptyCheckOnly '
                
            }
        }



  }  



}

