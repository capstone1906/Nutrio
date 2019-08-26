import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { Input, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { ScrollView } from 'react-native-gesture-handler';

import { getUserThunk } from '../components/store/user';
import { getCheckInsThunk, updateCheckIn } from '../components/store/checkIns';

class Checkin extends React.Component {
  constructor() {
    super();

    const dateNow = new Date();
    var todaysDate;

    var year = dateNow.getFullYear().toString();
    var month = (dateNow.getMonth() + 1).toString();
    var day = dateNow.getDate().toString();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    todaysDate = year + '-' + month + '-' + day;

    this.state = {
      date: todaysDate,
      updatedWeight: '0',
    };
    this.updateLog = this.updateLog.bind(this);
  }

  componentDidMount = () => {
    this.props.getUser();
    this.props.getCheckIns();
  };

  updateLog = () => {
    let number = Number(this.state.updatedWeight + '.0');
    this.props.updateCheckIn(this.props.checkIns.todaysCheckIn.id, {
      weight: number,
    });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.date}>
          <DatePicker
            style={{ width: 150, paddingBottom: 10 }}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
            onDateChange={date => {
              this.setState({ date: date });
              this.props.getMeals(date, this.props.user.id);
            }}
          />
        </View>
        <Input onChangeText={text => this.setState({ updatedWeight: text })} />
        <Text style={styles.formLabelText}>Weight</Text>
        <Button title="Submit Check-in" onPress={() => this.updateLog()} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5ECCD',
  },
});

Checkin.navigationOptions = {
  headerTitle: 'Check-In',
  headerStyle: {
    backgroundColor: '#1E90FF',
  },
  headerTintColor: 'white',
};

const mapState = state => {
  return {
    user: state.user,
    checkIns: state.checkIns,
  };
};

const mapDispatch = dispatch => {
  return {
    getUser: () => dispatch(getUserThunk()),
    getCheckIns: () => dispatch(getCheckInsThunk()),
    updateCheckIn: (id, checkIn) => dispatch(updateCheckIn(id, checkIn)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(Checkin);
