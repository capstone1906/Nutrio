import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
  KeyboardAvoidingView,
  AlertIOS
} from "react-native";
import { connect } from "react-redux";
import { VictoryPie, VictoryChart, VictoryTheme } from "victory-native";
import { Button, Divider } from "react-native-elements";
import { getUserThunk } from "../components/store/user";
import ProgressCircle from "react-native-progress-circle";
import SelectInput from "react-native-select-input-ios";
import { updateUserThunk } from "../components/store/user";

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      height: "",
      age: 0,
      bodyType: "",
      activityLevel: 1.2,
      endingWeight: 0,
      startWeight: 0,
      statedGoal: "Maintain weight",
      toggles: {
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
        six: false
      },
      buttonToggle: true
    };

    this.textInput = {};
    this.edits = {
      one: false,
      two: false,
      three: false,
      four: false,
      five: false,
      six: false
    };

    this.options = [
      { value: "Ectomorph", label: "Ectomorph" },
      { value: "Mesomorph", label: "Mesomorph" },
      { value: "Endomorph", label: "Endomorph" }
    ];
    this.levels = [
      { value: 1.2, label: "Sedentary (little or no exercise)" },
      { value: 1.375, label: "Lightly active (light exercise 1-3 days/week)" },
      { value: 1.55, label: "Active(moderate exercise 3-5 days/week)" },
      { value: 1.725, label: "Very active (hard exercise 6-7 days/week)" }
    ];
    this.goals = [
      { value: "Lose 2 lbs a week", label: "Lose 2 lbs a week" },
      { value: "Lose 1.5 lbs a week", label: "Lose 1.5 lbs a week" },
      { value: "Lose 1 lb a week", label: "Lose 1 lb a week" },
      { value: "Lose 0.5 lb a week", label: "Lose 0.5 lb a week" },
      { value: "Maintain weight", label: "Maintain weight" },
      { value: "Gain 0.5 lb a week", label: "Gain 0.5 lb a week" },
      { value: "Gain 1 lb a week", label: "Gain 1 lb a week" }
    ];

    this.removeItem = this.removeItem.bind(this);
    this.retrieveData = this.retrieveData.bind(this);
    this.focusNextTextInput = this.focusNextTextInput.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.toggleButtons = this.toggleButtons.bind(this);
  }

  toggleButtons() {
    AlertIOS.alert(
      "Modify goals?",
      "Modifying goals will reset your goal(start date and end date)",
      [
        {
          text: "Cancel",
          onPress: () => {
            this.setState({
              buttonToggle: true
            });
          }
        },
        {
          text: "Proceed",
          onPress: () => {
            this.setState({
              buttonToggle: false
            });
          }
        }
      ]
    );
  }

  updateProfile() {
    var obj = {
      height: this.state.height,
      bodyType: this.state.bodyType,
      activityLevel: this.state.activityLevel,
      height: this.state.height,
      endingWeight: this.state.endingWeight,
      startWeight: this.state.startWeight,
      statedGoal: this.state.statedGoal
    };

    var toggles = {};

    for (var key in this.state.toggles) {
      toggles[key] = false;
      this.edits[key] = false;
      if (key === "one" || key === "two" || key === "three") {
        this.textInput[key].editable = false;
        this.textInput[key].clear();
      } else {
        this.textInput[key].enabled = false;
      }
    }

    this.setState({ buttonToggle: true, toggles });
    this.props.updateUser(obj);
  }

  focusNextTextInput(id) {
    var newState = { ...this.state.toggles };

    if (this.edits[id]) {
      this.edits[id] = false;
      if (id === "four" || id === "five" || id === "six") {
        this.textInput[id].enabled = false;
      } else {
        this.textInput[id].editable = false;
      }
      newState[id] = false;
    } else {
      for (var key in newState) {
        if (
          (key === "four" || key === "five" || key === "six") &&
          this.textInput[key].enabled === true &&
          newState[key] === true &&
          this.edits[key] === true
        ) {
          newState[key] = false;
          this.textInput[key].enabled = false;
          this.edits[key] = false;
        } else if (key !== "four" && key !== "five" && key !== "six") {
          if (
            this.textInput[key].isFocused() ||
            this.textInput[key].editable === true ||
            newState[key] === true ||
            this.edits[key] === true
          ) {
            newState[key] = false;
            this.textInput[key].editable = false;
            this.edits[key] = false;
          }
        }
      }
      if (id === "four" || id === "five" || id === "six") {
        this.textInput[id].enabled = true;
      } else {
        this.textInput[id].editable = true;
      }
      newState[id] = true;
      this.edits[id] = true;
    }

    this.setState({ toggles: newState });
  }

  async componentDidMount() {
    await this.props.getUser();
    this.setState({
      height: this.props.user.height,
      age: this.props.user.age,
      bodyType: this.props.user.bodyType,
      activityLevel: this.props.user.activityLevel,
      endingWeight: this.props.user.longTermGoal.endingWeight,
      startWeight: this.props.user.longTermGoal.startWeight,
      statedGoal: this.props.user.longTermGoal.statedGoal
    });
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

    var bmr = user.dailyGoal.calorieLimit;

    var per = 0;
    if (user.longTermGoal) {
      per = Math.floor(
        ((user.weight - user.longTermGoal.startWeight) /
          (user.longTermGoal.endingWeight - user.longTermGoal.startWeight)) *
          100
      );
    }

    per = Math.abs(per);

    return (
      <View style={styles.container}>
        {/* <View style={styles.weightContainer}> */}
        <View style={styles.weight}>
          <ProgressCircle
            percent={per}
            radius={60}
            borderWidth={15}
            color="#4CEF90"
            shadowColor="#999"
            bgColor="#E76B74"
          >
            <Text
              style={{ fontSize: 18, color: "white" }}
            >{`${user.weight} lbs `}</Text>
          </ProgressCircle>
          <Text style={{ color: "white", paddingTop: 10 }}>weeks left: 10</Text>
          <Text style={{ color: "white" }}>
            Start date: {user.longTermGoal.startDate.split("T0")[0]}
          </Text>
          <Text style={{ color: "white" }}>
            End date: {user.longTermGoal.endDate.split("T0")[0]}
          </Text>

          <View
            style={{
              paddingBottom: 10,
              paddingTop: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            {this.state.buttonToggle ? (
              <Button
                title="edit profile"
                buttonStyle={{
                  width: 100,
                  height: 50,
                  color: "white",
                  backgroundColor: "blue",
                  fontSize: 12
                }}
                onPress={() => this.toggleButtons()}
              />
            ) : (
              <Button
                title="cancel"
                buttonStyle={{
                  width: 100,
                  height: 50,
                  color: "white",
                  backgroundColor: "red",
                  fontSize: 12
                }}
                onPress={() => this.toggleButtons()}
              />
            )}

            <Button
              title="save changes"
              disabled={this.state.buttonToggle}
              buttonStyle={{
                width: 100,
                height: 50,
                color: "white",
                backgroundColor: "limegreen",
                fontSize: 12
              }}
              onPress={() => this.updateProfile()}
            />
          </View>
        </View>

        {this.state.buttonToggle ? (
          <View style={styles.macroContainer}>
            {/* <View style={{ backgroundColor: "grey" }}> */}
            <Text style={{ color: "white" }}>Macros </Text>
            <Text style={{ color: "white" }}>
              🥓: {user.dailyGoal.fatLimit}
              {` g                   ${Math.ceil(
                ((user.dailyGoal.fatLimit * 9) / bmr) * 100
              )}%`}
            </Text>
            <Text style={{ color: "white" }}>
              🥩: {user.dailyGoal.proteinLimit}
              {` g              ${Math.ceil(
                ((user.dailyGoal.proteinLimit * 4) / bmr) * 100
              )}%`}
            </Text>
            <Text style={{ color: "white" }}>
              🍞: {user.dailyGoal.carbLimit}
              {` g                 ${Math.ceil(
                ((user.dailyGoal.carbLimit * 4) / bmr) * 100
              )}%`}
            </Text>

            <VictoryPie
              height={300}
              colorScale={["crimson", "limegreen", "navy"]}
              data={[
                {
                  x: `Fat: ${user.dailyGoal.fatLimit}g`,
                  y: user.dailyGoal.fatLimit
                },
                {
                  x: `Carbs: ${user.dailyGoal.carbLimit}g`,
                  y: user.dailyGoal.carbLimit
                },
                {
                  x: `Protein: ${user.dailyGoal.proteinLimit}g`,
                  y: user.dailyGoal.proteinLimit
                }
              ]}
              labelRadius={87}
              style={{
                labels: {
                  fill: "white",
                  fontSize: 14,
                  padding: "5px",
                  margin: "5px"
                }
              }}
            />

            <Text style={{ color: "white" }}>Calorie Goal: {bmr}</Text>

            {/* </View> */}
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            <TouchableOpacity
              onPress={() => this.focusNextTextInput("one")}
              disabled={this.state.buttonToggle}
            >
              <View
                style={
                  this.state.buttonToggle
                    ? styles.disableAll
                    : this.state.toggles.one
                    ? styles.selectedCard
                    : styles.card
                }
              >
                <Text style={styles.attrib}>Height: </Text>

                <TextInput
                  clearTextOnFocus="true"
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
                <Text style={styles.attrib}>Inches</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.focusNextTextInput("two")}
              disabled={this.state.buttonToggle}
            >
              <View
                style={
                  this.state.buttonToggle
                    ? styles.disableAll
                    : this.state.toggles.two
                    ? styles.selectedCard
                    : styles.card
                }
              >
                <Text style={styles.attrib}>Start weight: </Text>

                <TextInput
                  clearTextOnFocus="true"
                  editable={this.edits["two"]}
                  keyboardType="number-pad"
                  keyboardAppearance="dark"
                  placeholder={`${user.longTermGoal.startWeight}`}
                  value={this.state.startWeight}
                  onChangeText={text => {
                    this.setState({ startWeight: text });
                  }}
                  ref={input => {
                    this.textInput["two"] = input;
                  }}
                />
                <Text style={styles.attrib}>lbs</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.focusNextTextInput("three")}
              disabled={this.state.buttonToggle}
            >
              <View
                style={
                  this.state.buttonToggle
                    ? styles.disableAll
                    : this.state.toggles.three
                    ? styles.selectedCard
                    : styles.card
                }
              >
                <Text style={styles.attrib}>Goal weight: </Text>

                <TextInput
                  clearTextOnFocus="true"
                  editable={this.edits["three"]}
                  keyboardType="number-pad"
                  keyboardAppearance="dark"
                  placeholder={`${user.longTermGoal.endingWeight}`}
                  value={this.state.endingWeight}
                  onChangeText={text => {
                    this.setState({ endingWeight: text });
                  }}
                  ref={input => {
                    this.textInput["three"] = input;
                  }}
                />
                <Text style={styles.attrib}>lbs</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.focusNextTextInput("four")}
              disabled={this.state.buttonToggle}
            >
              <View
                style={
                  this.state.buttonToggle
                    ? styles.disableAll
                    : this.state.toggles.four
                    ? styles.selectedCard
                    : styles.card
                }
              >
                <Text style={styles.attrib}>Body Type:</Text>
                <SelectInput
                  value={this.state.bodyType}
                  options={this.options}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({
                      bodyType: itemValue
                    });
                  }}
                  enabled={this.edits["four"]}
                  ref={input => {
                    this.textInput["four"] = input;
                  }}
                  onEndEditing={() => this.focusNextTextInput("four")}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.focusNextTextInput("five")}
              disabled={this.state.buttonToggle}
            >
              <View
                style={
                  this.state.buttonToggle
                    ? styles.disableAll
                    : this.state.toggles.five
                    ? styles.selectedCard
                    : styles.card
                }
              >
                <Text style={styles.attrib}>Activity Level:</Text>
                <SelectInput
                  value={this.state.activityLevel}
                  options={this.levels}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({
                      activityLevel: itemValue
                    });
                  }}
                  enabled={this.edits["five"]}
                  ref={input => {
                    this.textInput["five"] = input;
                  }}
                  onEndEditing={() => this.focusNextTextInput("five")}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.focusNextTextInput("six")}
              disabled={this.state.buttonToggle}
            >
              <View
                style={
                  this.state.buttonToggle
                    ? styles.disableAll
                    : this.state.toggles.six
                    ? styles.selectedCard
                    : styles.card
                }
              >
                <Text style={styles.attrib}>Goal:</Text>
                <SelectInput
                  value={this.state.statedGoal}
                  options={this.goals}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({
                      statedGoal: itemValue
                    });
                  }}
                  enabled={this.edits["six"]}
                  ref={input => {
                    this.textInput["six"] = input;
                  }}
                  onEndEditing={() => this.focusNextTextInput("six")}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity title="Logout" onPress={() => this.removeItem()}>
              <View style={styles.logOutCard}>
                <Text style={styles.attrib}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  weightMacros: {
    backgroundColor: "#E76B74",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 10,
    marginBottom: 10
  },

  weight: {
    backgroundColor: "#E76B74",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 13
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F0F7F4"
  },
  macroContainer: {
    flex: 2,
    height: "100%",
    maxHeight: "100%",
    backgroundColor: "plum"
  },
  cardsContainer: {
    flex: 1,
    height: "60%",
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "row"
  },
  card: {
    padding: 10,
    paddingTop: 25,
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
  },
  disableAll: {
    padding: 10,
    paddingTop: 30,
    margin: 5,
    width: 110,
    height: 110,
    backgroundColor: "grey",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.7,
    borderRadius: 10
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
    getUser: () => dispatch(getUserThunk()),
    updateUser: newUser => dispatch(updateUserThunk(newUser))
  };
};

export default connect(
  mapState,
  mapDispatch
)(Profile);
