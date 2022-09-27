import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";

const db = SQLite.openDatabase("shoppinglistdb.db");

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppingList, setshoppingList] = useState([]);

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists shoppingList (id integer primary key not null, product text, amount text);"
        );
      },
      null,
      updateList
    );
  }, []);

  const saveItem = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into shoppingList (amount, product) values (?, ?);",
          [amount, product]
        );
      },
      null,
      updateList
    );
  };

  const updateList = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from shoppingList;", [], (_, { rows }) =>
        setshoppingList(rows._array)
      );
    });
  };

  const deleteItem = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from shoppingList where id = ?;`, [id]);
      },
      null,
      updateList
    );
  };

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%",
        }}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.textInput}>
          <TextInput
            placeholder="Tuote"
            onChangeText={(product) => setProduct(product)}
            value={product}
          />
        </View>
        <View style={styles.textInput}>
          <TextInput
            placeholder="Määrä"
            onChangeText={(amount) => setAmount(amount)}
            value={amount}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={saveItem}>
          <Text style={styles.AddItem}>Lisää Tuote</Text>
        </TouchableOpacity>
        <Text style={styles.textStyle}>Ostoslista</Text>
        <FlatList
          style={{ marginLeft: "5%" }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listcontainer}>
              <Text style={{ fontSize: 16 }}>
                {item.product}, {item.amount}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: "#FF0000",
                }}
                onPress={() => deleteItem(item.id)}
              >
                {" "}
                ostettu
              </Text>
            </View>
          )}
          data={shoppingList}
          ItemSeparatorComponent={listSeparator}
        />
      </View>
      <StatusBar hidden={true} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listcontainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  textStyle: {
    marginTop: 15,
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#888100",
  },
  button: {
    height: 40,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "gray",
    borderWidth: 2,
  },
  AddItem: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 2,
    borderColor: "gray",
    width: 150,
    margin: 2,
  },
});
