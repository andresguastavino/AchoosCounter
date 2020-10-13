import React, { useState } from 'react';
import { StyleSheet, Button, Text, View, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    height: 100,
    width: 100,
    borderRadius: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default function App() {
  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState(1);
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  function increaseCount() {
    setCount(count + 1);
  }

  function decreaseCount() {
    setCount(count - 1);
  }

  function getDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var fullDate = '';
    fullDate += (day < 10)?('0' + day + '/'):(day + '/');
    fullDate += (month < 10)?('0' + month + '/'):(month + '/');
    fullDate += year;

    return fullDate;
  }
  
  function getUserId() {
    fetch('http://localhost:5001/achooscounter/us-central1/app/api/new_user',
    {
      method: 'POST',
      headers: { 
        'Content-Type': 'apllication/json'
      }
    })
    .then(response => response.json())  
    .then(data => {  
      console.log(data);
      if(data.statusCode === 201) {
        setUserId(data.user_id);
      }
    })
    .catch(error => {  
      console.error(error);  
    });  
  }

  function getUserData() {
    fetch('http://localhost:5001/achooscounter/us-central1/app/api/users/' + userId,
    {
      method: 'GET',
      headers: { 
        'Content-Type': 'apllication/json'
      }
    })
    .then(response => response.json())  
    .then(data => {  
      console.log(data);
      setUserDataLoaded(true);
      let key = getAchoosFromData(new Date());
      if(data[key].achoos !== null) {
        setCount(data[key].achoos);
      }
    })
    .catch(error => {  
      console.error(error);  
    }); 
  }

  function saveAchoos() {
    let data = JSON.stringify({
      date: getDate(new Date()),
      achoos: count
    });

    fetch('http://localhost:5001/achooscounter/us-central1/app/api/users/' + userId,
    {
      method: 'PUT',
      body: data,
      headers: { 
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())  
    .then(data => {  
      console.log(data);
    })
    .catch(error => {  
      console.error(error);  
    });  
  }

  function getAchoosFromData(date) {
    let key = parseInt((getDate(date)).replace(/\//g, ''));
    return key;
  }

  if(userId == 0) {
    getUserId();
  } else {
    if(!userDataLoaded) {
      getUserData();
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity 
          style={{width: 340, height: 100, backgroundColor: '#fff', padding: 0,
            borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10, justifyContent: 'center'}} 
          activeOpacity={0.7}
        >
          <Text style={{fontSize: 40, color: '#000', textAlign: 'center'}}>
            {userId}
          </Text> 
          <Text style={{fontSize: 40, color: '#000', textAlign: 'center'}}>
            {getDate(new Date())}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row'}} >
        <TouchableOpacity 
          onPress={decreaseCount}
          style={{width: 100, height: 100, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
            borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10}} 
          disabled={count <= 0}
        >
          <Text style={{fontSize: 80, color: '#000'}}>
            -
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{width: 100, height: 100, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
            borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10}} 
          activeOpacity={1}
        >
          <Text style={{fontSize: 80, color: '#000'}}>
            {count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={increaseCount}
          style={{width: 100, height: 100, backgroundColor: '#fff', padding: 0,
            borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10}} 
          activeOpacity={0.7}
        >
          <Text style={{fontSize: 80, color: '#000', textAlignVertical: 'center', textAlign: 'center'}}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity 
          onPress={saveAchoos}
          style={{width: 340, height: 100, backgroundColor: '#fff', padding: 0,
            borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10, justifyContent: 'center'}} 
          activeOpacity={0.7}
        >
          <Text style={{fontSize: 40, color: '#000', textAlign: 'center'}}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
