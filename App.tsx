import * as React from 'react';
import { View, Text, Button, StatusBar, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
// import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { useEffect, useState } from 'react';
import waalexan from './function';

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

const Order = () => {
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

  const ft_delete = (id: string) => {
    setLoading(true);
    fetch(`https://kumbo.onrender.com/local/clientes/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        ft_get_clientes();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
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
                {item.view === 0 && <Text style={{ color: 'red' }}>Novo</Text>}
                <Text>{item.name}</Text>
                <Text>{item.email}</Text>
                <Text>{item.numero}</Text>
                {dateFormatted.length > 0 && (
                  <Text>{`${dateFormatted} - ${timeFormatted}`}</Text>
                )}
                <Button title='Apgar' onPress={() => ft_delete(item.id_cliente)} />
              </View>
            );
          })
        ) : (
          <Text>Nenhum dado encontrado.</Text>
        )
      )}
    </ScrollView>
  );
};

const Notification = () => {
  return (
    <View>
      <Text>Notification</Text>
    </View>
  );
};

const Header = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#7971ea" barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>K U M B O O</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Local" color={"#7971ea"} onPress={() => console.log("Local button pressed")} />
          <Button title="update" color={"#7971ea"} />
        </View>
      </View>
    </View>
  );
}

const Home = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#7971ea" barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>K U M B O O</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Local" color={"#7971ea"} onPress={() => console.log("Local button pressed")} />
          <Button title="update" color={"#7971ea"} />
        </View>
      </View>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <Tab.Navigator>
            <Tab.Screen name="Pedidos" component={Order} />
            <Tab.Screen name="Notificações" component={Notification} />
          </Tab.Navigator>
        </View>
      </NavigationContainer>
    </View>
  );
};

const Add = () => {
  const [data, setData] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const myLib = waalexan();

  const ft_get_products = () => {
    setLoading(true);
    fetch("https://kumbo.onrender.com/api/products")
    .then((response) => response.json())
    .then((result) => {
      setData(result)
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    ft_get_products();
  },[])
  return (
    <View>
      <View style={styles.container}>
        <StatusBar backgroundColor="#7971ea" barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>K U M B O O</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Adicionar" color={"#7971ea"} />
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#7971ea" />
          </View>
        ): (
          data.length > 0 ? (
            data.map((item, index) => {
              return (
                <View key={index} style={styles.item}>
                  <Text>{item.nome}</Text>
                  <Text>{myLib.formatarMoeda(parseFloat(item.preco), 'AOA', false)}</Text>
                  <Text>{item.descricao}</Text>
                </View>
              )
            })
          ): (
            <Text>Nenhum dado encontrado.</Text>
          )
        )}
      </ScrollView>
    </View>
  );
}

const App = () => {
  const [route, setRoute] = useState('Home');

  const Route = () => {
    switch (route) {
      case 'Home':
        return <Home />;
      case 'Add':
        return <Add />;
      default:
        return <Home />;
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Route />
      <View style={styles.nav}>
        <Button title="Home" onPress={() => setRoute('Home')} />
        <Button title="Stock" onPress={() => setRoute('Add')} />
        <Button title="Clients" onPress={() => setRoute('settings')} />
        <Button title="Settings" onPress={() => setRoute('settings')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  scrollView: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  item: {
    marginBottom: 15,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
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

export default App;
