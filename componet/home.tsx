import * as React from 'react';
import { View, Text, Button, StatusBar, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState, useRef } from 'react';
import ButtonMenu from '../element';
import waalexan from '../function';

interface Clientes {
    id_cliente: string;
    name: string;
    email: string;
    numero: string;
    data: string;
    view: number;
}
interface Products {
    nome: string;
    descricao: string;
    preco: string;
    urlImage: string;
}
const Home = () => {
    return (
        <View>
            <Text>Home</Text>
        </View>
    );
}

export default Home