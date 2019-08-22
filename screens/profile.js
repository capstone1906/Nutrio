import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  TextInput
} from "react-native";
import { connect } from "react-redux";

import { Button, Divider } from "react-native-elements";
import { getUserThunk } from "../components/store/user";
import ProgressCircle from "react-native-progress-circle";

const Card = props => {
  return (
    <TouchableOpacity onPress={() => props.focusNextTextInput(props.number)}>
      <View style={props.toggle ? styles.selectedCard : styles.card}>
        <Text style={styles.attrib}>{props.attribute} </Text>

        <TextInput
          editable={props.editable}
          keyboardType="number-pad"
          keyboardAppearance="dark"
          placeholder={`${props.placeholder}`}
          value={props.value}
          onChangeText={props.changeText}
          ref={input => {
            props.textInput[props.number] = input;
          }}
        />
        <Text style={styles.attrib}>{props.measure}</Text>
      </View>
    </TouchableOpacity>
  );
};

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      height: "",
      toggles: {
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
        six: false,
        seven: false,
        eight: false
      }
    };

    this.textInput = {};
    this.edits = {
      one: false,
      two: false,
      three: false,
      four: false,
      five: false,
      six: false,
      seven: false,
      eight: false
    };

    this.removeItem = this.removeItem.bind(this);
    this.retrieveData = this.retrieveData.bind(this);
    this.focusNextTextInput = this.focusNextTextInput.bind(this);
  }

  focusNextTextInput(id) {
    var newState = { ...this.state.toggles };

    if (this.textInput[id].isFocused()) {
      this.edits[id] = false;
      this.textInput[id].blur();
      this.textInput[id].editable = false;
      newState[id] = false;
    } else {
      this.textInput[id].editable = true;

      for (var key in newState) {
        if (
          this.textInput[key].isFocused() ||
          this.textInput[key].editable === true ||
          newState[key] === true ||
          this.edits[key] === true
        ) {
          newState[key] = false;
          this.textInput[key].editable = false;
          this.edits[key] = false;
          this.textInput[key].blur();
        }
      }
      this.textInput[id].editable = true;

      newState[id] = true;
      this.edits[id] = true;
    }

    this.setState({ toggles: newState });
  }

  async componentDidMount() {
    await this.props.getUser();
    this.retrieveData();
  }

  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value !== null) {
        this.props.navigation.navigate("Main");
      }
    } catch (err) {
      console.error(err);
    }
  };

  removeItem = async () => {
    await AsyncStorage.removeItem("user");
    this.props.navigation.navigate("Auth");
  };

  componentDidUpdate(prevProps, prevState) {
    for (var key in this.state.toggles) {
      if (
        prevState.toggles[key] === false &&
        this.state.toggles[key] === true
      ) {
        this.textInput[key].focus();
      }
    }
  }

  render() {
    var user = this.props.user;

    var bmr = Math.floor(
      (10 * user.weight + 6.25 * user.height * 0.39370079 - 5 * user.age + 5) *
        parseInt(user.activityLevel)
    );

    var per = 0;
    if (user.longTermGoal) {
      per = Math.floor(
        ((user.weight - user.longTermGoal.startWeight) /
          (user.longTermGoal.endingWeight - user.longTermGoal.startWeight)) *
          100
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.weight}>
          <ProgressCircle
            percent={per}
            radius={70}
            borderWidth={15}
            color="#4CEF90"
            shadowColor="#999"
            bgColor="#E76B74"
          >
            <Text style={{ fontSize: 18, color: "white" }}>{`${per}%`}</Text>
          </ProgressCircle>

          <Text style={styles.currWeight}>
            Current weight: {user.weight} lbs
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* <TouchableOpacity onPress={() => this.focusNextTextInput("one")}>
            <View
              style={this.state.toggles.one ? styles.selectedCard : styles.card}
            >
              <Text style={styles.attrib}>Height: </Text>

              <TextInput
                editable={this.edits["one"]}
                keyboardType="number-pad"
                keyboardAppearance="dark"
                placeholder={`${user.height}`}
                value={this.state.height}
                onChangeText={text => {
                  this.setState({ height: text });
                }}
                ref={input => {
                  this.textInput["one"] = input;
                }}
              />
              <Text style={styles.attrib}>inches.</Text>
            </View>
          </TouchableOpacity> */}

          <Card
            changeText={text => {
              this.setState({ height: text });
            }}
            editable={this.edits["one"]}
            placeholder={`${user.height}`}
            value={this.state.height}
            number={"one"}
            attribute="Height: "
            measure="Inches"
            toggle={this.state.toggles.one}
            textInput={this.textInput}
            focusNextTextInput={this.focusNextTextInput}
          />

          <TouchableOpacity onPress={() => this.focusNextTextInput("two")}>
            <View
              style={this.state.toggles.two ? styles.selectedCard : styles.card}
            >
              <Text style={styles.attrib}>Age: </Text>
              <TextInput
                editable={this.edits["two"]}
                keyboardType="number-pad"
                keyboardAppearance="dark"
                placeholder={`${user.age}`}
                value={this.state.age}
                onChangeText={text => {
                  console.log("text is", text);
                  this.setState({ age: text });
                }}
                ref={input => {
                  this.textInput["two"] = input;
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.focusNextTextInput("three")}>
            <View
              style={
                this.state.toggles.three ? styles.selectedCard : styles.card
              }
            >
              <Text style={styles.attrib}>Body Type: {user.bodyType}</Text>
              <TextInput
                editable={this.edits["three"]}
                keyboardType="number-pad"
                keyboardAppearance="dark"
                placeholder={`${user.age}`}
                value={this.state.age}
                onChangeText={text => {
                  console.log("text is", text);
                  this.setState({ age: text });
                }}
                ref={input => {
                  this.textInput["three"] = input;
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.focusNextTextInput("four")}>
            <View
              style={
                this.state.toggles.four ? styles.selectedCard : styles.card
              }
            >
              <TextInput
                editable={this.edits["four"]}
                keyboardType="number-pad"
                keyboardAppearance="dark"
                placeholder={`${user.age}`}
                value={this.state.age}
                onChangeText={text => {
                  console.log("text is", text);
                  this.setState({ age: text });
                }}
                ref={input => {
                  this.textInput["four"] = input;
                }}
              />
              <Text style={styles.attrib}>
                Activity Level: {user.activityLevel}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.focusNextTextInput("five")}>
            <View
              style={
                this.state.toggles.five ? styles.selectedCard : styles.card
              }
            >
              <TextInput
                editable={this.edits["five"]}
                keyboardType="number-pad"
                keyboardAppearance="dark"
                placeholder={`${user.age}`}
                value={this.state.age}
                onChangeText={text => {
                  console.log("text is", text);
                  this.setState({ age: text });
                }}
                ref={input => {
                  this.textInput["five"] = input;
                }}
              />
              <Text style={styles.attrib}>
                Starting weight:{" "}
                {user.longTermGoal ? user.longTermGoal.startWeight : 0}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.focusNextTextInput("six")}>
            <View
              style={this.state.toggles.six ? styles.selectedCard : styles.card}
            >
              <TextInput
                editable={this.edits["six"]}
                keyboardType="number-pad"
                keyboardAppearance="dark"
                placeholder={`${user.age}`}
                value={this.state.age}
                onChangeText={text => {
                  console.log("text is", text);
                  this.setState({ age: text });
                }}
                ref={input => {
                  this.textInput["six"] = input;
                }}
              />
              <Text style={styles.attrib}>
                Goal weight:{" "}
                {user.longTermGoal ? user.longTermGoal.endingWeight : 0}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.focusNextTextInput("seven")}>
            <View
              style={
                this.state.toggles.seven ? styles.selectedCard : styles.card
              }
            >
              <TextInput
                editable={this.edits["seven"]}
                keyboardType="number-pad"
                keyboardAppearance="dark"
                placeholder={`${user.age}`}
                value={this.state.age}
                onChangeText={text => {
                  console.log("text is", text);
                  this.setState({ age: text });
                }}
                ref={input => {
                  this.textInput["seven"] = input;
                }}
              />
              <Text style={styles.attrib}>
                Goal: {user.longTermGoal ? user.longTermGoal.statedGoal : 0}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.focusNextTextInput("eight")}>
            <View
              style={
                this.state.toggles.eight ? styles.selectedCard : styles.card
              }
            >
              <TextInput
                editable={this.edits["eight"]}
                keyboardType="number-pad"
                keyboardAppearance="dark"
                placeholder={`${user.age}`}
                value={this.state.age}
                onChangeText={text => {
                  console.log("text is", text);
                  this.setState({ age: text });
                }}
                ref={input => {
                  this.textInput["eight"] = input;
                }}
              />
              <Text style={styles.attrib}>Bmr: {bmr}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity title="Logout" onPress={() => this.removeItem()}>
            <View style={styles.logOutCard}>
              <Text style={styles.attrib}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Button />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  weight: {
    flex: 1,
    backgroundColor: "#E76B74",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",

    marginBottom: 20
  },
  container: {
    flex: 1,
    justifyContent: "center"
  },
  cardsContainer: {
    flex: 2,
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "row"
  },
  card: {
    padding: 10,
    paddingTop: 30,
    margin: 5,
    width: 110,
    height: 110,
    backgroundColor: "#4CEF90",

    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.7,
    borderRadius: 10
  },
  selectedCard: {
    padding: 10,
    paddingTop: 30,
    margin: 5,
    width: 110,
    height: 110,
    backgroundColor: "#87BBA2",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.7,
    borderRadius: 10
  },
  logOutCard: {
    padding: 10,
    paddingTop: 30,
    margin: 5,
    width: 110,
    height: 110,
    backgroundColor: "crimson",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.7,
    borderRadius: 10
  },
  attrib: {
    color: "white"
  },
  currWeight: {
    color: "white",
    paddingTop: 15,
    fontSize: 18
  }
});

Profile.navigationOptions = {
  headerTitle: "Profile",
  headerStyle: {
    backgroundColor: "crimson"
  },
  headerTintColor: "white"
};

const mapState = state => {
  return {
    user: state.user
  };
};

const mapDispatch = dispatch => {
  return {
    getUser: () => dispatch(getUserThunk())
  };
};

export default connect(
  mapState,
  mapDispatch
)(Profile);
