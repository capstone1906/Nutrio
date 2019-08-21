import React, {Component} from 'react'
import {View, Text, Image} from 'react-native'
import {Card, ListItem, Button, Icon} from 'react-native-elements'

export default function MealCard(props){
  return(
    <Card title={props.name}>
      <Text>props</Text>
    </Card>
  )
}
