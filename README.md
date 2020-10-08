# Log Formatter for IBM Liberty JSON Logs

A simple Node.js script that helps to format IBM Liberty JSON Log Entries into classic human-readable Logs.

The script requires Node.js 7.6, as it uses the async and await language constructs.

```json
{"@timestamp":"2020-10-05T09:01:18.337Z","@metadata":{"beat":"filebeat","type":"_doc","version":"7.0.1"},"host":{"name":"workflow-designer-ums-deployment-7fd4d68d7-mb7cs"},"agent":{"ephemeral_id":"a82b2d8c-025b-4328-ac37-66921bdaf569","hostname":"workflow-designer-ums-deployment-7fd4d68d7-mb7cs","id":"a2fe592c-f9f0-4c65-a136-f677f2524640","version":"7.0.1","type":"filebeat"},"log":{"offset":43805,"file":{"path":"/logs/application/liberty-message.log"}},"message":"{\"type\":\"liberty_message\",\"host\":\"workflow-designer-ums-deployment-7fd4d68d7-mb7cs\",\"ibm_userDir\":\"\\/opt\\/ibm\\/wlp\\/usr\\/\",\"ibm_serverName\":\"ums\",\"message\":\"CWWKF0011I: The server1 server is ready to run a smarter planet. The server1 server started in 126.196 seconds.\",\"ibm_threadId\":\"00000025\",\"ibm_datetime\":\"2020-10-05T09:01:17.338+0000\",\"ibm_messageId\":\"CWWKF0011I\",\"module\":\"com.ibm.ws.kernel.feature.internal.FeatureManager\",\"loglevel\":\"AUDIT\",\"ibm_sequence\":\"1601888477338_000000000004E\"}","log-type":"application","input":{"type":"log"},"app_id":"","ecs":{"version":"1.0.0"}}
```
will be formatted to
```console
[2020-10-05T09:01:17.338+0000] 00000025 AUDIT CWWKF0011I: The server1 server is ready to run a smarter planet. The server1 server started in 126.196 seconds.
```

## Register a shortcut

Create a text file in `/usr/local/bin` directory:
```console
vi /usr/local/bin/logformat
```

Type in following script to invoke Node.js with the Log-Formatter:
```bash
node ~/logformat/main.js
```
This implies that you cloned the Git repo to your home directory and you can start the Node.js executable from the command line using the `node` command.

Assign execute permission on the script:
```console
chmod +x /usr/local/bin/logformat
```

## Usage

The Log Formatter will read input it's from stdin.

Format logs from a file:

`cat ~/server.log | node ~/logformat/main.js`

If you created a shortcut, like suggested:

`cat ~/server.log | logformat`

Print logs of a  Kubernetes pod:

`kubectl logs my-liberty-pod | logformat`

## Example JSON Log Entries

The following section contains a couple of sample JSON objects that can be processed by the LogFormatter and is meant as reference.

```json
{
  "type": "liberty_message",
  "host": "release-name-ibm-dba-ums-597878747-5kmvc",
  "ibm_userDir": "/opt/ibm/wlp/usr/",
  "ibm_serverName": "ums",
  "message": "CWLUM1102E: The TeamServer database is not configured. ",
  "ibm_threadId": "00000038",
  "ibm_datetime": "2019-08-29T12:43:41.799+0000",
  "ibm_messageId": "CWLUM1102E",
  "module": "com.ibm.dba.ums.teamserver.api.rest.TeamServerContextListener",
  "loglevel": "SEVERE",
  "ibm_methodName": "initDatabaseConnection",
  "ibm_className": "com.ibm.dba.ums.teamserver.api.rest.TeamServerContextListener",
  "ibm_sequence": "1567082621799_000000000008A",
  "ext_thread": "Default Executor-thread-7"
}
```
```json
{
  "type": "liberty_ffdc",
  "host": "release-name-ibm-dba-ums-597878747-5kmvc",
  "ibm_userDir": "/opt/ibm/wlp/usr/",
  "ibm_serverName": "ums",
  "ibm_datetime": "2019-08-29T12:43:41.793+0000",
  "message": "CWLUM1015E: Internal error in server: Attempting to execute an operation on a closed EntityManagerFactory.",
  "ibm_className": "com.ibm.dba.ums.teamserver.persistence.dao.impl.DataStore.initialize",
  "ibm_exceptionName": "com.ibm.dba.ums.teamserver.common.exception.InternalServerException",
  "ibm_probeID": "0x01",
  "ibm_threadId": "00000038",
  "ibm_stackTrace": "com.ibm.dba.ums.teamserver.common.exception.InternalServerException: CWLUM1015E: Internal error in server: Attempting to execute an operation on a closed EntityManagerFactory.\n\tat com.ibm.dba.ums.teamserver.persistence.dao.impl.DAOUtil.handleEntityManagerException(DAOUtil.java:564)\n\tat com.ibm.dba.ums.teamserver.persistence.dao.impl.BaseDAOImpl.doQuery(BaseDAOImpl.java:223)\n\tat com.ibm.dba.ums.teamserver.persistence.dao.impl.MetaDataDAOImpl.getData(MetaDataDAOImpl.java:93)\n\tat com.ibm.dba.ums.teamserver.persistence.dao.impl.DataStore.initialize(DataStore.java:160)\n\tat com.ibm.dba.ums.teamserver.persistence.dao.impl.DataStore.initializeFromDataSource(DataStore.java:114)\n\tat com.ibm.dba.ums.teamserver.api.rest.TeamServerContextListener.initDatabaseConnection(TeamServerContextListener.java:168)\n\tat com.ibm.dba.ums.teamserver.api.rest.TeamServerContextListener.contextInitialized(TeamServerContextListener.java:88)\n\tat com.ibm.ws.webcontainer.webapp.WebApp.notifyServletContextCreated(WebApp.java:2383)\n\tat com.ibm.ws.webcontainer31.osgi.webapp.WebApp31.notifyServletContextCreated(WebApp31.java:514)\n\tat com.ibm.ws.webcontainer.webapp.WebApp.initialize(WebApp.java:1011)\n\tat com.ibm.ws.webcontainer.webapp.WebApp.initialize(WebApp.java:6601)\n\tat com.ibm.ws.webcontainer.osgi.DynamicVirtualHost.startWebApp(DynamicVirtualHost.java:467)\n\tat com.ibm.ws.webcontainer.osgi.DynamicVirtualHost.startWebApplication(DynamicVirtualHost.java:462)\n\tat com.ibm.ws.webcontainer.osgi.WebContainer.startWebApplication(WebContainer.java:1144)\n\tat com.ibm.ws.webcontainer.osgi.WebContainer.access$000(WebContainer.java:111)\n\tat com.ibm.ws.webcontainer.osgi.WebContainer$3.run(WebContainer.java:956)\n\tat com.ibm.ws.threading.internal.ExecutorServiceImpl$RunnableWrapper.run(ExecutorServiceImpl.java:239)\n\tat java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:522)\n\tat java.util.concurrent.FutureTask.run(FutureTask.java:277)\n\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1160)\n\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)\n\tat java.lang.Thread.run(Thread.java:818)\nCaused by: java.lang.IllegalStateException: Attempting to execute an operation on a closed EntityManagerFactory.\n\tat org.eclipse.persistence.internal.jpa.EntityManagerFactoryDelegate.verifyOpen(EntityManagerFactoryDelegate.java:362)\n\tat org.eclipse.persistence.internal.jpa.EntityManagerFactoryDelegate.createEntityManagerImpl(EntityManagerFactoryDelegate.java:326)\n\tat org.eclipse.persistence.internal.jpa.EntityManagerFactoryImpl.createEntityManagerImpl(EntityManagerFactoryImpl.java:350)\n\tat org.eclipse.persistence.internal.jpa.EntityManagerFactoryImpl.createEntityManager(EntityManagerFactoryImpl.java:313)\n\tat com.ibm.dba.ums.teamserver.persistence.dao.impl.DAOUtil.getEntityManager(DAOUtil.java:115)\n\tat com.ibm.dba.ums.teamserver.persistence.dao.impl.DAOUtil.getEntityManager(DAOUtil.java:105)\n\tat com.ibm.dba.ums.teamserver.persistence.dao.impl.BaseDAOImpl.doQuery(BaseDAOImpl.java:211)\n\t... 20 more\n",
  "ibm_objectDetails": "null\n",
  "ibm_sequence": "1567082621793_0000000000007"
}
```
```json
{
  "type": "liberty_trace",
  "host": "fvlxdrs-ibm-dba-ums-d679f4679-trj2g",
  "ibm_userDir": "/opt/ibm/wlp/usr/",
  "ibm_serverName": "ums",
  "message": "RETURN CWLUM0106I: Start to create OAuth database tables OAUTH20CACHE, OAUTH20CLIENTCONFIG and OAUTH20CONSENTCACHE in schema OAuthDBSchema.",
  "ibm_threadId": "0000001d",
  "ibm_datetime": "2019-09-19T09:04:47.936+0000",
  "module": "com.ibm.dba.ums.authentication.bundle.Messages",
  "loglevel": "EXIT",
  "ibm_methodName": "getResourceString",
  "ibm_className": "com.ibm.dba.ums.authentication.bundle.Messages",
  "ibm_sequence": "1568883887936_0000000000005",
  "ext_thread": "Start Level: Equinox Container: 0a85037b-7152-412d-9df3-a54397ae445a"
}
```
