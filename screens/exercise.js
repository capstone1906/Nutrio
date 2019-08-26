import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import { getExercisesThunk } from '../components/store/exercises';
import { Input, ListItem, Divider, Icon } from 'react-native-elements';

class Exercise extends React.Component {
  constructor() {
    super();
    this.state = {
      exercises: [],
      searchName: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    event.preventDefault();
    var text = event.nativeEvent.text;

    if (!text) {
      text = ' ';
    }

    await this.props.getExercises(text);

    this.setState({
      searchName: text,
      exercises: this.props.exercises,
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

    return (
      <ScrollView>
        <Input onChange={this.handleChange} />

        {exercises.map((exercise, i) => {
          return (
            <View>
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
                  this.props.navigation.navigate('SingleExercise', {
                    exercise: exercise,
                  });
                }}
              />

              <Divider style={{ backgroundColor: 'blue' }} />
            </View>
          );
        })}
      </ScrollView>
    );
  }
}

Exercise.navigationOptions = {
  headerTitle: 'Exercise',
  headerStyle: {
    backgroundColor: '#1E90FF',
  },
  headerTintColor: 'white',
};

const mapState = state => {
  return {
    exercises: state.exercises,
  };
};

const mapDispatch = dispatch => {
  return {
    getExercises: name => dispatch(getExercisesThunk(name)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(Exercise);
