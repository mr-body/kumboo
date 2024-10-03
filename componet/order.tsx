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

const Order_List = React.forwardRef((props, ref) => {
    const [data, setData] = useState<Clientes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const myLib = waalexan();

    const ft_get_clientes = () => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await fetch('https://kumbo.onrender.com/local/clientes/');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    };

    React.useImperativeHandle(ref, () => ({
        updateClientes: () => ft_get_clientes(),
    }));

    const ft_delete = (id: string) => {
        setLoading(true);
        fetch(`https://kumbo.onrender.com/local/clientes/${id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then(() => {
                console.log('Excluído com sucesso');
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                ft_get_clientes();
                setLoading(false);
            });
    };

    useEffect(() => {
        ft_get_clientes();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#7971ea" />
                </View>
            ) : (
                data.length > 0 ? (
                    data.map((item, index) => {
                        const dateFormatted = myLib.formatDate(item.data);
                        const timeFormatted = myLib.extractTime(item.data);

                        return (
                            <View key={index} style={styles.item}>
                                {item.view === 0 && <View style={styles.new}></View>}
                                <Text>{item.name}</Text>
                                <Text>{item.email}</Text>
                                <Text>{myLib.formatarTexto(item.numero, 3, ' ')}</Text>
                                {dateFormatted.length > 0 && (
                                    <Text style={styles.date}>{`${dateFormatted} - ${timeFormatted}`}</Text>
                                )}
                                <ButtonMenu fontSize={12} flexDirection='row' style={styles.trash} width={14} height={14} source={require('./images/trash.png')} color={"#999"} onPress={() => ft_delete(item.id_cliente)}>
                                    Apagar
                                </ButtonMenu>
                            </View>
                        );
                    })
                ) : (
                    <Text>Nenhum dado encontrado.</Text>
                )
            )}
        </ScrollView>
    );
});

const Order = () => {
    const Tab = createMaterialTopTabNavigator();
    const orderRef = React.useRef<any>(null);

    const ft_update_list = () => {
        if (orderRef.current) {
            orderRef.current.updateClientes();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#7971ea" barStyle="light-content" />
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>K U M B O O</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <ButtonMenu width={20} height={20} source={require('./images/search.png')} color={"#fff"} onPress={() => ft_update_list()} />
                    <ButtonMenu width={20} height={20} source={require('./images/refresh.png')} color={"#fff"} onPress={() => ft_update_list()} />
                </View>
            </View>
            <NavigationContainer>
                <View style={{ flex: 1 }}>
                    <Tab.Navigator
                        initialRouteName="Feed"
                        screenOptions={{
                            tabBarActiveTintColor: 'white',
                            tabBarLabelStyle: styles.tabBarLabel,
                            tabBarStyle: styles.tabBar,
                        }}
                    >
                        <Tab.Screen name="Pedidos"
                            options={{
                                tabBarLabel: 'Pedidos',
                                tabBarIcon: ({ color, size }) => (
                                    <ButtonMenu width={20} height={20} source={require('./images/pedidos.png')} color={"#fff"} />
                                ),
                            }}>
                            {() => <Order_List ref={orderRef} />}
                        </Tab.Screen>
                        <Tab.Screen
                            name=" "
                            component={Notification}
                            options={{
                                tabBarLabel: 'Em espera',
                                tabBarIcon: ({ color, size }) => (
                                    <ButtonMenu width={20} height={20} source={require('./images/espera.png')} color={"#fff"} />
                                ),
                            }}
                        />
                        <Tab.Screen name="Atendidos" component={Notification} options={{
                            tabBarLabel: 'Atendidos',
                            tabBarIcon: ({ color, size }) => (
                                <ButtonMenu width={20} height={20} source={require('./images/atendidos.png')} color={"#fff"} />
                            ),
                        }} />
                        <Tab.Screen name="Historico" component={Notification} options={{
                            tabBarLabel: 'Historico',
                            tabBarIcon: ({ color, size }) => (
                                <ButtonMenu width={20} height={20} source={require('./images/historico.png')} color={"#fff"} />
                            ),
                        }} />
                    </Tab.Navigator>
                </View>
            </NavigationContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    date: {
      position: 'absolute',
      right: '4%',
      fontSize: 10,
      color: '#7971ea',
      top: '13%'
    },
    new: {
      position: 'absolute',
      height: '300%',
      width: 4,
      right: 0,
      backgroundColor: '#7971ea',
      top: 0
    },
    trash: {
      position: 'absolute',
      right: '4%',
      color: '#7971ea',
      bottom: '13%'
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#7971ea',
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      color: '#fff',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    tabBar: {
      backgroundColor: '#7971ea',
    },
    tabBarLabel: {
      fontSize: 10,
      padding: 0,
      color: '#fff',
  
    },
    nav: {
      position: 'absolute',
      bottom: 0,
      height: 60,
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      width: '100%',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
  });

export default Order;