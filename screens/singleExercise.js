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
import { Input, ListItem, Divider, Icon, Button } from "react-native-elements";

class SingleExercise extends React.Component {
  constructor() {
    super();
    this.state = {
      exercise: {},
      minutesPerformed: 0,
      caloriesBurned: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.addTolog = this.handleChange.bind(this);

  }

  addTolog() {
      
  }

  handleChange(event) {
    event.preventDefault();
    var text = event.nativeEvent.text;

    this.setState({
        minutesPerformed: text,
        caloriesBurned: (this.state.exercise.met * (this.props.user.weight/2.2) * (text/60)).toFixed(0)
    })

  }

  componentDidMount() {
    var exercise = this.props.navigation.getParam("exercise");
    this.setState({exercise })
  }

  render() {

    var exercise = {}
    if(this.state.exercise.activity) {
        exercise = this.state.exercise
    }
    return (
        <View>
            <Text> {exercise.activity ? exercise.activity + ' - ' + exercise.description : null}</Text>
            <Text>Minutes performed: {this.state.minutesPerformed} </Text>
            <Input onChange={this.handleChange}/>
            <Text>Calories Burned: {this.state.caloriesBurned}</Text>
            <Button title='Add to log'/>
        </View>
    );
  }
}

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
    user: state.user
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
)(SingleExercise);
