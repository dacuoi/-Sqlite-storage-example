/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "test.db";
const database_version = "1.0";
const database_displayname = "test";
const database_size = 200000;
const settingDB = (Platform.OS === 'ios' ?
      {name : database_name,
      createFromLocation: 1} :
      {name : database_name,
      createFromLocation: 1});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  loadAndQueryDB = () => {
    SQLite.openDatabase(settingDB, this.openCB,this.errorCB).then((DB) => {
    // SQLite.openDatabase(database_name, database_version, database_displayname, database_size).then((DB) => {
      db = DB;
      this.populateDatabase(DB);
    }).catch((error) => {
      console.log("Can not open Database");
      console.log(error);
    });
};

closeDatabase = () => {
  if (db) {
    console.log("Closing database ...");
    console.log("Closing DB");
    db.close().then((status) => {
      console.log("Database CLOSED");
    }).catch((error) => {
      this.errorCB(error);
    });
  } else {
    console.log("Database was not OPENED")
  }
};

componentWillMount(){
  console.log("zo");
  this.runDemo();
}

componentWillUnmount(){
  this.closeDatabase();
}

errorCB = (err) => {
  console.log("Error " + (err.message || err));
};

successCB() {
  console.log("SQL executed fine");
}

openCB() {
  console.log("Database OPENED");
}

populateDatabase = (db) => {
  console.log("Database integrity check");
  db.executeSql('SELECT 1 FROM test LIMIT 1').then(() =>{
    console.log("Database is ready ... executing query ...");
    db.transaction(this.queryEmployees).then(() => {
      console.log("Processing completed")
    });
  }).catch((error) =>{
    console.log("Received error: ", error);
    console.log("Database not yet ready ... populating data");
    db.transaction(this.queryEmployees).then((result) => {
      console.log("Transaction is now finished");
      console.log("Processing completed");
      this.closeDatabase()});

  });
};

queryEmployees = (tx) => {
  console.log("Executing employee query");
  tx.executeSql('SELECT * FROM test WHERE field1=?', [3]).then(([tx,results]) => {
    console.log("Query completed");
    var len = results.rows.length;
    for (let i = 0; i < len; i++) {
      let row = results.rows.item(i);
      console.log("This is your information: " + row.field2);
    }
  }).catch((error) => {
    console.log(error);
  });
};


populateDB = (tx) => {
  
};

runDemo = () => {
  console.log('running');
  this.loadAndQueryDB();
};

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
