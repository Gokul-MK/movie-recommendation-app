@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "BASE_DIR=%~dp0")

@SET MAVEN_WRAPPER_JAR="%BASE_DIR%.mvn\wrapper\maven-wrapper.jar"
@SET MAVEN_WRAPPER_PROPERTIES="%BASE_DIR%.mvn\wrapper\maven-wrapper.properties"

@For /F "usebackq tokens=1,2 delims==" %%A IN (%MAVEN_WRAPPER_PROPERTIES%) DO (
    @IF "%%A"=="distributionUrl" SET "DISTRIBUTION_URL=%%B"
)

@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET MVN_CMD=mvn
@IF DEFINED JAVA_HOME (
    @SET MVN_CMD="%JAVA_HOME%\bin\java" -jar %MAVEN_WRAPPER_JAR% %MAVEN_WRAPPER_PROPERTIES% %*
    @GOTO execute
)

@echo ERROR: JAVA_HOME not set. Please set JAVA_HOME to the location of your JDK.
@EXIT /B 1

:execute
%MVN_CMD% %*
