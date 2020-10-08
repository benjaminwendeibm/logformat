/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

const fs = require('fs');
const readline = require('readline');

/*
 * Log Formatter for IBM Liberty JSON Logs.
 * The Formatter reads JSON from stdin, formats them and
 * outputs the human-readable logs to stdout.
 */

/*
 * Returns the value of a property with name either
 * name or name2 from o. If name and name2 both are not
 * set, it return an empty string.
 */
function prop(o, name, name2) {
  if(o[name]) {
    return o[name].trim();
  }
  if(name2 && o[name2]) {
    return o[name2].trim();
  }
  else return '';
}

/*
 * Parse a JSON line and return an object.
 * If the line is not recognized as JSON,
 * this function returns null.
 */
function parseLine(line) {
  try {
    if(line.trim().startsWith("{") && line.trim().endsWith("}")) {
      return JSON.parse(line.trim());
    }
  }
  catch(e) {
    return null;
  }
  return null;
}

/*
 * Processes a log line by parsing it as object and then
 * checking for well-know properties to identify certain
 * log formats.
 */
function processLine(line) {
  var o = parseLine(line);
  if(o) {
    if(o['@metadata'] && o.message && o.message.startsWith("{") && o.message.endsWith("}")) {
      return // ignore filebeat lines as this doubles the log lines
    }
    if(o.type && o.type == "liberty_message") {
      console.log(`[${prop(o, "ibm_datetime")}] ${prop(o, "ibm_threadId")} ${prop(o, "loglevel")} ${prop(o, "message")}`)
      return
    }
    else if(o.type && o.type == "liberty_ffdc") {
      console.log(`[${prop(o, "ibm_datetime")}] ${prop(o, "ibm_threadId")} FFDC ${prop(o, "ibm_stackTrace")}`)
      return
    }
    else if(o.type && o.type == "liberty_trace") {
      console.log(`[${prop(o, "ibm_datetime")}] ${prop(o, "ibm_threadId")} ${prop(o, "ibm_className", "module")}.${prop(o, "ibm_methodName")} ${prop(o, "message")}`)
      return
    }
    else if(o['@metadata']) {
      console.log(`${prop(o, "message")}`)
      return
    }
    else if(o.level && o.ts && o.msg && o.logger) {
      console.log(`${prop(o, "level")} ${prop(o, "logger")} ${prop(o, "namespace")}/${prop(o, "name")}: ${prop(o, "msg")} ${prop(o, "error")}`)
      if(o.stacktrace) {
        console.log(`${prop(o, "level")} ${prop(o, "logger")} ${prop(o, "namespace")}/${prop(o, "name")}: ${prop(o, "stacktrace")}`)
      }
      return
    }
    else if(o.msg) {
      console.log(`[${prop(o, "time")}] ${prop(o, "file")} ${prop(o, "level")} ${prop(o, "msg")}`)
      return
    }
    else {
      console.log(line);
      return
    }
  }
  else {
    console.log(line);
    return
  }
}

/*
 * Process each line of stdin in an endless loop.
 */
async function processStdIn(debug) {
  const rlIn = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity
  });

  // read from stdin until program ends
  for await (const line of rlIn) {
    if(debug == true) {
      console.log("RAW: " + line)
    }
    processLine(line);
  }
}

// trigger stdin processing
processStdIn(false);
