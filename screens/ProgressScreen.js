import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { getUserThunk } from '../components/store/user';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
} from 'victory-native';
import { Button } from 'react-native-elements';
import { getMealsThunk } from '../components/store/meals';

class ProgressScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      showData: 'ytd',
      allData: [],
      sevenDay: [],
      thirtyDay: [],
      ytd: [],
    };
    this.storeData = this.storeData.bind(this);
  }

  componentDidMount() {
    this.props.getMeals();
    this.storeData();
  }

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
    if (this.props.user.checkins) {
      const dataWeight = this.props.user.checkins.map(check => check.weight);
      const dataDate = this.props.user.checkins.map(check =>
        check.createdAt.slice(5, 10)
      );
      for (let i = 0; i < dataWeight.length; i++) {
        let marker = {};
        marker.x = dataDate[i];
        marker.y = dataWeight[i];
        this.state.allData.push(marker);
      }
      let sevenDayTemp = this.state.allData.slice(-7);
      for (let j = 0; j < sevenDayTemp.length; j++) {
        this.state.sevenDay.push(sevenDayTemp[j]);
      }
      let thirtyDayTemp = this.state.allData.slice(-30);
      for (let k = 0; k < thirtyDayTemp.length; k += 3) {
        this.state.thirtyDay.push(thirtyDayTemp[k]);
      }
      for (
        let m = 0;
        m < this.state.allData.length;
        m += this.state.allData.length / 10
      ) {
        this.state.ytd.push(this.state.allData[m]);
      }
    }
    return (
      <View>
        <View style={styles.graphButtonCoices}>
          <Button
            title="7 Day"
            type="solid"
            style={styles.graphButtons}
            onPress={() => {
              this.setState({
                showData: 'sevenDay',
              });
            }}
          />
          <Button
            title="30 Day"
            type="solid"
            style={styles.graphButtons}
            onPress={() => {
              this.setState({
                showData: 'thirtyDay',
              });
            }}
          />
          <Button
            title="YTD"
            type="solid"
            style={styles.graphButtons}
            onPress={() => {
              this.setState({
                showData: 'ytd',
              });
            }}
          />
        </View>
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryAxis
            style={{
              tickLabels: {
                fontSize: '14px',
                fontFamily: 'gothicApple',
                fillOpacity: 1,
                marginTop: '4px',
                padding: 10,
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
                margin: 1,
                padding: 2,
                angle: 0,
              },
              axisLabel: {
                fontsize: 13,
              },
            }}
          />
          <VictoryLine
            style={{
              data: { stroke: '#c43a31' },
              parent: { border: '1px solid #ccc' },
            }}
            data={this.state[this.state.showData]}
          />
        </VictoryChart>
      </View>
    );
  }
}

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  graphButtonCoices: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  graphButtons: {
    width: 100,
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
