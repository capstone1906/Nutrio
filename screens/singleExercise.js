import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput
} from "react-native";
import { connect } from "react-redux";

import { getExercisesThunk } from "../components/store/exercises";
import { ListItem, Divider, Icon, Button, Input } from "react-native-elements";
import { getCheckInsThunk, updateCheckIn } from "../components/store/checkIns";

const SingleExercise = props => {
  exercise = props.exercise;
  return (
    <View>
      <Text style={{ fontSize: 18 }}>
        {exercise.activity
          ? exercise.activity + " - " + exercise.description
          : null}
      </Text>
      <Text style={{ fontSize: 18 }}>
        Minutes performed: {props.minutesPerformed}
      </Text>

      <Input
        inputContainerStyle={{
          borderBottomWidth: 0,
          borderRadius: 10,
          backgroundColor: "#e5e4ea",
          width: "85%",
          justifyContent: "center",
          alignItems: "center"
        }}
        containerStyle={{
          justifyContent: "center",
          marginTop: 13
        }}
        leftIconContainerStyle={{ marginRight: 9 }}
        keyboardAppearance="dark"
        placeholder="Enter minutes performed"
        onChange={props.handleChange}
      />

      <Text style={{ fontSize: 18 }}>
        Calories Burned: {props.caloriesBurned}
      </Text>
    </View>
  );
};

SingleExercise.navigationOptions = {
  headerTitle: "Exercise",
  headerStyle: {
    backgroundColor: "crimson"
  },
  headerTintColor: "white"
};

const mapState = state => {
  return {
    exercises: state.exercises,
    user: state.user,
    checkIns: state.checkIns
  };
};

const mapDispatch = dispatch => {
  return {
    getExercises: name => dispatch(getExercisesThunk(name)),
    getCheckIns: () => dispatch(getCheckInsThunk()),
    updateCheckIn: (id, checkIn) => dispatch(updateCheckIn(id, checkIn))
  };
};

export default connect(
  mapState,
  mapDispatch
)(SingleExercise);
