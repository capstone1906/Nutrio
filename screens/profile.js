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
import { VictoryPie, VictoryLegend } from "victory-native";
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

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};


    return {
      headerTitle: "Profile",
      headerStyle: {
        backgroundColor: "#1E90FF"
      },
      headerTintColor: "white",
      headerRight: (
        <TouchableOpacity style={{ paddingRight: 12 }} onPress={() => params.removeItem()}>
          <Text style={{ color: "white", fontSize: 16 }}>Logout</Text>
        </TouchableOpacity>
      )
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({

      removeItem: this.removeItem
    });
  }

  toggleButtons() {
    if (this.state.buttonToggle === true) {
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
    } else {
      AlertIOS.alert("Are you sure you want to cancel?", "", [
        {
          text: "Keep editing",
          onPress: () => {
            this.setState({
              buttonToggle: false
            });
          }
        },
        {
          text: "Proceed",
          onPress: () => {
            this.setState({
              buttonToggle: true
            });
          }
        }
      ]);
    }
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
        <View style={styles.weight}>
          <ProgressCircle
            percent={per}
            radius={60}
            borderWidth={15}
            color="#4CEF90"
            shadowColor="lightgrey"
            bgColor="#F5ECCD"
          >
            <Text
              style={{ fontSize: 18, color: "black" }}
            >{`${user.weight} lbs `}</Text>
          </ProgressCircle>
          <Text style={{ fontSize: 16, color: "black", paddingTop: 10 }}>
            weeks left: 10
          </Text>
          <Text style={{ fontSize: 16, color: "black" }}>
            Start date: {user.longTermGoal.startDate.split("T0")[0]}
          </Text>
          <Text style={{ fontSize: 16, color: "black" }}>
            End date: {user.longTermGoal.endDate.split("T0")[0]}
          </Text>

          <View
            style={{
              paddingBottom: 0,
              paddingTop: 15,
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
                  backgroundColor: "#0438E2",
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
                // width: 100,
                marginLeft: 5,
                height: 50,
                backgroundColor: "limegreen",
                fontSize: 12
              }}
              onPress={() => this.updateProfile()}
            />
          </View>
        </View>
        <Divider style={{ backgroundColor: "blue" }} />

        {this.state.buttonToggle ? (
          <View style={styles.macroContainer}>
            <Text
              style={{
                color: "black",
                fontSize: 25,
                paddingBottom: 10,
                paddingTop: 70
              }}
            >
              Calorie Goal: {bmr}
            </Text>

            <VictoryPie
              height={165}
              width={165}
              padAngle={2}
              innerRadius={55}
              colorScale={["crimson", "#4CEF90", "#0438E2"]}
              data={[
                {
                  x: 1,
                  y: user.dailyGoal.fatLimit
                },
                {
                  x: 2,
                  y: user.dailyGoal.carbLimit
                },
                {
                  x: 3,
                  y: user.dailyGoal.proteinLimit
                }
              ]}
              labelRadius={87}
              style={{
                labels: {
                  fill: "#F5ECCD",
                  fontSize: 0,
                  color: ""
                }
              }}
            />

            <VictoryLegend
              x={25}
              y={0}
              height={140}
              width={350}
              title="Macros"
              centerTitle
              orientation="horizontal"
              gutter={10}
              style={{
                title: { fontSize: 24 },
                data: { fontSize: 18 },
                padding: 0,
                margin: 0
              }}
              data={[
                {
                  name: `Protein ${user.dailyGoal.proteinLimit}g`,
                  symbol: { fill: "#0438E2" }
                },
                {
                  name: `Fat ${user.dailyGoal.fatLimit}g`,
                  symbol: { fill: "crimson" }
                },
                {
                  name: `Carbs ${user.dailyGoal.carbLimit}g`,
                  symbol: { fill: "#4CEF90" }
                }
              ]}
            />
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

          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  weight: {
    backgroundColor: "#F5ECCD",
    height: "43%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 15
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5ECCD"
  },
  macroContainer: {
    flex: 2,
    height: "100%",
    maxHeight: "100%",
    backgroundColor: "#F5ECCD",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "100%"
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
  },
    loader: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#F5ECCD',
  },
});

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
