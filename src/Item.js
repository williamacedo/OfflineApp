import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Button } from 'react-native';

export default class Item extends Component {

  constructor(props){
    super(props);
    this.state = {
      done:(this.props.data.done=='1')? styles.done : styles.undone
    };

    this.marcar = this.marcar.bind(this);
    this.excluir = this.excluir.bind(this);
  }

  marcar() {
    let state = this.state;

    let done = 'sim';

    if(this.state.done == styles.undone){
      state.done = styles.done;
    } else {
      state.done = stles.undone;
      done = 'nao';
    }

    this.setState(state);

    this.props.onUpdate(this.props.data.id, done);
    /*

    fetch(this.props.url+'/'+this.props.data.id, {
      method:'PUT',
      headers:{
        'Accept':'application/json',
        'Content-Type':'aplication/json'
      },
      body:JSON.stringify({
        done:done
      })
    })
      .then((r)=>r.json)
      .then((json) =>{});



    this.setState(state);*/
  }

  excluir() {
    this.props.onDelete(this.props.data.id);
  }

  render() {
    return(
      <View style={styles.area}>
        <TouchableHighlight style={[styles.marcarArea, this.state.done]} onPress={this.marcar}>
          <View>

          </View>
        </TouchableHighlight>
        <Text style={{flex:1}}>{this.props.data.item}</Text>
        <Button style={styles.botao} title="X" onPress={this.excluir} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  area:{
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  marcarArea:{
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20
  },
  undone:{
    backgroundColor: '#CCCCCC'
  },
  done: {
    backgroundColor: '#00FF00'
  },
  botao:{
    width: 40,
    height: 40
  }
});
