import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from '../utils/Styles'
import { Ionicons } from '@expo/vector-icons';
export default function Activity() {
  return (
        <View style={[styles.rowContainer, {marginBottom: '3%'}]}>

            <TouchableOpacity style={{borderBottomWidth: 2, borderColor: '#646B4B'}}>
                <Text style={{color: '#646B4B', fontWeight: 'bold'}}>posts</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={{color: '#646B4B', fontWeight: 'bold'}}>reposts</Text>
            </TouchableOpacity> 

            <TouchableOpacity>
                <Text style={{color: '#646B4B', fontWeight: 'bold'}}>replies</Text>
            </TouchableOpacity>    
            <TouchableOpacity>
                <Text style={{color: '#646B4B', fontWeight: 'bold'}}>likes</Text>
            </TouchableOpacity> 
            
        </View>
    )
}

