import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import { getExercisesThunk } from "../components/store/exercises";
import { Input, ListItem, Divider, Icon } from "react-native-elements";
import SingleExercise from "./singleExercise";

const AllExercises = props => {
  return (
    <View style={{ backgroundColor: "#F5ECCD" }}>
      {props.exercises.map((exercise, i) => {
        return (
          <View style={{ backgroundColor: "#F5ECCD" }}>
            <ListItem
              key={i}
              rightIcon={
                <Icon
                  name="arrow-right-circle"
                  type="material-community"
                  color="limegreen"
                />
              }
              title={exercise.activity}
              subtitle={exercise.description}
              onPress={() => {
                props.selectExercise(exercise);
              }}
            />

            <Divider style={{ backgroundColor: "blue" }} />
          </View>
        );
      })}
    </View>
  );
};

class Exercise extends React.Component {
  constructor() {
    super();
    this.state = {
      exercises: [],
      searchName: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    event.preventDefault();
    var text = event.nativeEvent.text;

    if (!text) {
      text = " ";
    }

    await this.props.getExercises(text);

    this.setState({
      searchName: text,
      exercises: this.props.exercises
    });
  }

  async componentDidMount() {
    // await this.props.getExercises();
  }

  render() {
    var exercises = [];
    if (this.props.exercises.length) {
      exercises = this.props.exercises;
    }

    console.log("props are", this.props);
    return (
      <View>
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
          leftIcon={{ type: "font-awesome", name: "search" }}
          leftIconContainerStyle={{ marginRight: 9 }}
          keyboardAppearance="dark"
          placeholder="search for an exercise"
          onChange={this.handleChange}
        />

        <ScrollView style={styles.container}>
          {this.props.selectedExercise.activity ? (
            <SingleExercise
              exercise={this.props.selectedExercise}
              handleChange={this.props.handleChange}
              minutesPerformed={this.props.minutesPerformed}
              caloriesBurned={this.props.caloriesBurned}

            />
          ) : (
            <AllExercises
              exercises={exercises}
              selectExercise={this.props.selectExercise}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 400
  }
});

Exercise.navigationOptions = {
  headerTitle: "Exercise",
  headerStyle: {
    backgroundColor: "#1E90FF"
  },
  headerTintColor: "white"
};

const mapState = state => {
  return {
    exercises: state.exercises
  };
};

const mapDispatch = dispatch => {
  return {
    getExercises: name => dispatch(getExercisesThunk(name))
  };
};

export default connect(
  mapState,
  mapDispatch
)(Exercise);
