import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, Button, NetInfo, AsyncStorage } from 'react-native';
import Item from './src/Item';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lista:[],
      input:'',
      netstatus:0
    };

    this.url = 'https://b7web.com.br/todo/13183';

    this.addButton = this.addButton.bind(this);
    this.loadLista = this.loadLista.bind(this);
    this.conEvent = this.conEvent.bind(this);
    this.sicronizar = this.sicronizar.bind(this);
    this.excluir = this.excluir.bind(this);
    this.atualizar = this.atualizar.bind(this);
    NetInfo.addEventListener('connectionChange', this.conEvent);

    this.loadLista();

  }

  loadLista() {
    if(this.state.netstatus == 1) {
      fetch(this.url)
        .then((r)=>r.json())
        .then((json)=>{
          let state = this.state;
          state.lista = json.todo;
          this.setState(state);

          let lista = JSON.stringify(json.todo);
          AsyncStorage.setItem('lista', lista);
        });
    } else {

      AsyncStorage.getItem('lista').then((v)=>{
        let state = this.state;
        if(v != '') {
          let listaJson = JSON.parse(v);
          state.lista = listaJson;
        }

        this.setState(state);

      });

    }
  }

  addButton() {
    AsyncStorage.getItem('lista').then((v)=>{
      let state = this.state;
      let listaJson = JSON.parse(v);
      listaJson.push({
        item:this.state.input,
        done:'0',
        id:'0'
      });

      state.lista = listaJson;

      let listaStr = JSON.stringify(listaJson);
      AsyncStorage.setItem('lista', listaStr);
      state.input = '';
      this.setState(state);

    });
  }

  conEvent(info) {
    let state = this.state;
    if(info.type == 'none') {
      state.netstatus = 0;
    } else {
      state.netstatus = 1;
    }

    this.setState(state);
    if(state.lista.length == 0) {
      this.loadLista();
    }
  }

  sicronizar() {
    if(this.state.netstatus == 1){
      AsyncStorage.getItem('lista').then((v)=>{
        fetch(this.url+'/sync', {
          method:'POST',
          headers:{
            'Accept':'application/json',
            'Content-Type':'aplication/json'
          },
          body:JSON.stringify({
            json:v
          })
        })
          .then((r)=>r.json)
          .then((json) =>{
            if(json.todo.status) {
              alert("Items sicronizados com sucesso!");
            }else {
              alert("Tente mais tarde!");
            }
          });
      });
    } else {
      alert('Você está offline');
    }
  }

  excluir(id) {
    AsyncStorage.getItem('lista').then((v)=>{
      let state = this.state;
      let listaJson = JSON.parse(v);

      for(var i in listaJson) {
        if(listaJson[i].id == id) {
          listaJson.splice(i, 1);
        }
      }

      state.lista = listaJson;

      let listaStr = JSON.stringify(listaJson);
      AsyncStorage.setItem('lista', listaStr);
      state.input = '';
      this.setState(state);

    });
  }

  atualizar(id, done) {
    AsyncStorage.getItem('lista').then((v)=>{
      let state = this.state;
      let listaJson = JSON.parse(v);

      for(var i in listaJson) {
        if(listaJson[i].id == id) {
          if(done == 'sim') {
            listaJson[i].done = 1;
          }else {
            listaJson[i].done = 0;
          }
        }
      }

      state.lista = listaJson;

      let listaStr = JSON.stringify(listaJson);
      AsyncStorage.setItem('lista', listaStr);

      this.setState(state);

    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.addArea}>
          <Text style={styles.addTxt}>Adicione uma nova tarefa</Text>
          <TextInput style={styles.input} onChangeText={(text) => {
            let state = this.state;
            state.input = text;
            this.setState(state);
          }} value={this.state.input} />
          <Button title="Adicionar" onPress={this.addButton} />
        </View>
        <FlatList data={this.state.lista} renderItem={({item}) => <Item onDelete={this.excluir} onUpdate={this.atualizar} data={item} url={this.url} loadFunction={this.loadLista} />} keyExtractor={(item, index) => item.id} />
        <View style={styles.statusView}>
          <Text style={styles.text}>{this.state.netstatus}</Text>
        </View>
        <View style={styles.statusView}>
          <Button onPress={this.sicronizar} title="sicronizar" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  addArea:{
    marginBottom: 20,
    backgroundColor: '#DDDDDD',
  },
  input:{
    height: 40,
    backgroundColor:'#CCCCCC',
    marginLeft:20,
    marginRight:20,
    paddingLeft:10,
    paddingRight:10
  },
  addTxt:{
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  statusView:{
    height: 50,
    backgroundColor: '#EEEEEE'
  },
  text:{
    fontSize: 23,
    textAlign: 'center'
  }
});
