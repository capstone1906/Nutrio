/* eslint-disable complexity */
/* eslint-disable max-statements */
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { getUserThunk } from '../components/store/user';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryLegend,
  VictoryBar,
} from 'victory-native';
import { ButtonGroup } from 'react-native-elements';
import { getMealsThunk } from '../components/store/meals';

class ProgressScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      showData: 'sevenDay',
      goalShowData: 'goalSevenDay',
      consumedShowData: 'consumedSevenDay',
      burnedShowData: 'burnedSevenDay',
      lineGraphAllData: [],
      sevenDay: [],
      thirtyDay: [],
      ytd: [],
      goalAllData: [],
      goalSevenDay: [],
      goalThirtyDay: [],
      goalYtd: [],
      consumedAllData: [],
      consumedSevenDay: [],
      consumedThirtyDay: [],
      consumedYtd: [],
      burnedAllData: [],
      burnedSevenDay: [],
      burnedThirtyDay: [],
      burnedYtd: [],
      selectedIndex: 0,
    };
    this.storeData = this.storeData.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
  }

  componentDidMount() {
    // this.props.getMeals();
    this.storeData();
  }

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
    if (selectedIndex === 0) {
      this.setState({
        showData: 'sevenDay',
        goalShowData: 'goalSevenDay',
        consumedShowData: 'consumedSevenDay',
        burnedShowData: 'burnedSevenDay',
      });
    } else if (selectedIndex === 1) {
      this.setState({
        showData: 'thirtyDay',
        goalShowData: 'goalThirtyDay',
        consumedShowData: 'consumedThirtyDay',
        burnedShowData: 'burnedThirtyDay',
      });
    } else {
      this.setState({
        showData: 'ytd',
        goalShowData: 'goalYtd',
        consumedShowData: 'consumedYtd',
        burnedShowData: 'burnedYtd',
      });
    }
  };

  storeData = async () => {
    try {
      if (this.props.user.email) {
        await AsyncStorage.setItem('user', this.props.user.email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    //all line graphs showing weight lost at various increments, using today's date as last point on graph
    if (this.props.user.checkins) {
      const dataWeight = this.props.user.checkins.map(check => check.weight);
      const dataDate = this.props.user.checkins.map(check => check.createdAt);
      if (this.state.lineGraphAllData.length === 0) {
        for (let i = 0; i < dataWeight.length; i++) {
          let marker = {};
          let date = new Date(dataDate[i]);
          marker.x = `${date.getMonth() + 1}-${date.getDate()}`;
          marker.y = dataWeight[i];
          this.state.lineGraphAllData.push(marker);
        }
      }
      if (this.state.sevenDay.length === 0) {
        let sevenDayTemp = this.state.lineGraphAllData.slice(-7);
        for (let j = 0; j < sevenDayTemp.length; j++) {
          this.state.sevenDay.push(sevenDayTemp[j]);
        }
      }
      if (this.state.thirtyDay.length === 0) {
        let thirtyDayTemp = this.state.lineGraphAllData.slice(-30).reverse();
        let correctingOrder = [];
        for (let k = 0; k < thirtyDayTemp.length; k += 3) {
          correctingOrder.push(thirtyDayTemp[k]);
        }
        for (let ka = 0; ka < 10; ka++) {
          this.state.thirtyDay.push(correctingOrder.pop());
        }
      }
      if (this.state.ytd.length === 0) {
        let ytdTemp = this.state.lineGraphAllData.reverse();
        let correctingOrder = [];
        for (let m = 0; m < ytdTemp.length; m += ytdTemp.length / 10) {
          correctingOrder.push(ytdTemp[m]);
        }
        for (let ma = 0; ma < 10; ma++) {
          this.state.ytd.push(correctingOrder.pop());
        }
      }
    }
    // line graph dataset for comparision of goal to actual, using today's date as last point on graph
    const startDate = new Date(
      this.props.user.longTermGoal.startDate
    ).getTime();
    const endDate = new Date(this.props.user.longTermGoal.endDate).getTime();
    const oneDay = 86400000;
    const goalLength = (endDate - startDate) / oneDay;
    const dailyWeightDecrement =
      (this.props.user.longTermGoal.startWeight -
        this.props.user.longTermGoal.endingWeight) /
      goalLength;
    if (this.state.goalAllData.length === 0) {
      for (let n = 1; n <= goalLength; n++) {
        let marker = {};
        let date = new Date(startDate + oneDay * n);
        marker.x = `${date.getMonth() + 1}-${date.getDate()}`;
        marker.y =
          this.props.user.longTermGoal.startWeight -
          dailyWeightDecrement * (n - 1);
        this.state.goalAllData.push(marker);
      }
    }
    if (this.state.goalSevenDay.length === 0) {
      let datesToMatch = this.state.sevenDay.map(date => date.x);
      let goalDatesMatched = this.state.goalAllData.filter(
        checkin => datesToMatch.includes(checkin.x) === true
      );
      for (let i = 0; i < goalDatesMatched.length; i++) {
        this.state.goalSevenDay.push(goalDatesMatched[i]);
      }
    }
    if (this.state.goalThirtyDay.length === 0) {
      let datesToMatch = this.state.thirtyDay.map(date => date.x);
      let goalDatesMatched = this.state.goalAllData.filter(
        checkin => datesToMatch.includes(checkin.x) === true
      );
      for (let i = 0; i < goalDatesMatched.length; i++) {
        this.state.goalThirtyDay.push(goalDatesMatched[i]);
      }
    }
    if (this.state.goalYtd.length === 0) {
      let datesToMatch = this.state.ytd.map(date => date.x);
      let goalDatesMatched = this.state.goalAllData.filter(
        checkin => datesToMatch.includes(checkin.x) === true
      );
      for (let i = 0; i < goalDatesMatched.length; i++) {
        this.state.goalYtd.push(goalDatesMatched[i]);
      }
    }
    // bar graph dataset showing calories consumed on a given day
    if (this.props.user.checkins) {
      const caloriesConsumed = this.props.user.checkins.map(
        check => check.caloriesConsumed
      );
      const dataDate = this.props.user.checkins.map(check => check.createdAt);
      if (this.state.consumedAllData.length === 0) {
        for (let i = 0; i < caloriesConsumed.length; i++) {
          let marker = {};
          let date = new Date(dataDate[i]);
          marker.x = `${date.getMonth() + 1}-${date.getDate()}`;
          marker.y = caloriesConsumed[i];
          this.state.consumedAllData.push(marker);
        }
      }
      if (this.state.consumedSevenDay.length === 0) {
        let sevenDayTemp = this.state.consumedAllData.slice(-7);
        for (let j = 0; j < sevenDayTemp.length; j++) {
          this.state.consumedSevenDay.push(sevenDayTemp[j]);
        }
      }
      if (this.state.consumedThirtyDay.length === 0) {
        let thirtyDayTemp = this.state.consumedAllData.slice(-30).reverse();
        let correctingOrder = [];
        for (let k = 0; k < thirtyDayTemp.length; k += 3) {
          correctingOrder.push(thirtyDayTemp[k]);
        }
        for (let ka = 0; ka < 10; ka++) {
          this.state.consumedThirtyDay.push(correctingOrder.pop());
        }
      }
      if (this.state.consumedYtd.length === 0) {
        let ytdTemp = this.state.consumedAllData.reverse();
        let correctingOrder = [];
        for (let m = 0; m < ytdTemp.length; m += ytdTemp.length / 10) {
          correctingOrder.push(ytdTemp[m]);
        }
        for (let ma = 0; ma < 10; ma++) {
          this.state.consumedYtd.push(correctingOrder.pop());
        }
      }
    }
    // bar graph dataset showing calories burned on a given day
    if (this.props.user.checkins) {
      const caloriesBurned = this.props.user.checkins.map(
        check => check.caloriesBurned
      );
      const dataDate = this.props.user.checkins.map(check => check.createdAt);
      if (this.state.burnedAllData.length === 0) {
        for (let i = 0; i < caloriesBurned.length; i++) {
          let marker = {};
          let date = new Date(dataDate[i]);
          marker.x = `${date.getMonth() + 1}-${date.getDate()}`;
          marker.y = caloriesBurned[i];
          this.state.burnedAllData.push(marker);
        }
      }
      if (this.state.burnedSevenDay.length === 0) {
        let sevenDayTemp = this.state.burnedAllData.slice(-7);
        for (let j = 0; j < sevenDayTemp.length; j++) {
          this.state.burnedSevenDay.push(sevenDayTemp[j]);
        }
      }
      if (this.state.burnedThirtyDay.length === 0) {
        let thirtyDayTemp = this.state.burnedAllData.slice(-30).reverse();
        let correctingOrder = [];
        for (let k = 0; k < thirtyDayTemp.length; k += 3) {
          correctingOrder.push(thirtyDayTemp[k]);
        }
        for (let ka = 0; ka < 10; ka++) {
          this.state.burnedThirtyDay.push(correctingOrder.pop());
        }
      }
      if (this.state.burnedYtd.length === 0) {
        let ytdTemp = this.state.burnedAllData.reverse();
        let correctingOrder = [];
        for (let m = 0; m < ytdTemp.length; m += ytdTemp.length / 10) {
          correctingOrder.push(ytdTemp[m]);
        }
        for (let ma = 0; ma < 10; ma++) {
          this.state.burnedYtd.push(correctingOrder.pop());
        }
      }
    }

    const buttons = ['7 Day', '30 Day', 'YTD'];
    const { selectedIndex } = this.state;
    return (
      <View style={styles.mainContainer}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{ height: 50, marginRight: 20 }}
          selectedTextStyle={{ color: 'white' }}
        />
        <VictoryChart theme={VictoryTheme.material} height={320} width={400}>
          <VictoryAxis
            style={{
              tickLabels: {
                fontSize: '14px',
                fontFamily: 'gothicApple',
                fillOpacity: 1,
                angle: 30,
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            domain={[180, 200]}
            style={{
              tickLabels: {
                fontSize: '15px',
                fontFamily: 'gothicApple',
                fillOpacity: 1,
                angle: 0,
              },
              axisLabel: {
                fontsize: 13,
              },
            }}
          />
          <VictoryLine
            style={{
              data: { stroke: '#FF6347' },
              parent: { border: '1px solid #ccc' },
            }}
            data={this.state[this.state.showData]}
          />
          <VictoryLine
            style={{
              data: { stroke: '#559E54' },
              parent: { border: '1px solid #ccc' },
            }}
            data={this.state[this.state.goalShowData]}
          />
          <VictoryLegend
            x={125}
            y={300}
            orientation="horizontal"
            gutter={20}
            data={[
              { name: 'Weight', symbol: { fill: '#FF6347' } },
              { name: 'Goal', symbol: { fill: '#559E54' } },
            ]}
          />
        </VictoryChart>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={20}
          height={320}
          width={400}
        >
          <VictoryAxis
            style={{
              tickLabels: {
                fontSize: '14px',
                fontFamily: 'gothicApple',
                fillOpacity: 1,
                angle: 30,
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: {
                fontSize: '15px',
                fontFamily: 'gothicApple',
                fillOpacity: 1,
                angle: 0,
              },
              axisLabel: {
                fontsize: 13,
              },
            }}
          />
          <VictoryBar
            style={{ data: { fill: '#559E54' } }}
            data={this.state[this.state.consumedShowData]}
          />
          <VictoryBar
            style={{ data: { fill: '#FF6347' } }}
            data={this.state[this.state.burnedShowData]}
          />
          <VictoryLegend
            x={60}
            y={300}
            orientation="horizontal"
            data={[
              { name: 'Calories Burned', symbol: { fill: '#FF6347' } },
              { name: 'Calories Consumed', symbol: { fill: '#559E54' } },
            ]}
          />
        </VictoryChart>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  graphButtonCoices: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  graphButtons: {
    width: 100,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 50,
    paddingLeft: 20,
  },
});

ProgressScreen.navigationOptions = {
  headerTitle: 'Progress',
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};

const mapState = state => {
  return {
    user: state.user,
    meals: state.meals,
  };
};

const mapDispatch = dispatch => {
  return {
    getUser: () => dispatch(getUserThunk()),
    getMeals: () => dispatch(getMealsThunk(new Date())),
  };
};

export default connect(
  mapState,
  mapDispatch
)(ProgressScreen);
