// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useCartStore } from './store/useCartStore';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';

// Clean decoupled import configuration profiles
//import { API_BASE_URL } from './config'; 
import {PORT} from './config'
const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:5000/api`
    : '/api';

console.log("api base url "+API_BASE_URL)
export default function App() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { cart, addToCart } = useCartStore();

  const fetchStocks = () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (category) queryParams.append('category_id', category);

    fetch(`${API_BASE_URL}/stocks?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setStocks(json.data);
        }
      })
      .catch((err) => console.error("Network communication failure at endpoint:", API_BASE_URL, err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchStocks();
    }, 400);
    return () => clearTimeout(handler);
  }, [search, category]);

  const getCartQuantity = (item) => {
    const id = item._id?.$oid || item._id;
    const found = cart.find((i) => (i._id?.$oid || i._id) === id);
    return found ? found.cartQuantity : 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.navbar}>
        <Text style={styles.logo}></Text>
        <TouchableOpacity style={styles.cartBadge} onPress={() => setCartOpen(true)}>
          <Text style={styles.cartBadgeText}>
            Cart ({cart.reduce((sum, item) => sum + item.cartQuantity, 0)})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
        />
        <TextInput
          style={[styles.inputField, { maxWidth: 120 }]}
          placeholder="Category..."
          value={category}
          onChangeText={setCategory}
          autoCapitalize="characters"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0070f3" style={styles.loader} />
      ) : (
        <FlatList
          data={stocks}
          keyExtractor={(item) => item._id?.$oid || item._id}
          contentContainerStyle={styles.gridContainer}
          numColumns={Platform.OS === 'web' ? 3 : 1}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              onAddToCart={addToCart} 
              cartQuantity={getCartQuantity(item)} 
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyResults}>No products found matching those parameters.</Text>
          }
        />
      )}

      <CartModal visible={cartOpen} onClose={() => setCartOpen(false)} />
    </SafeAreaView>
  );
}

// Keep the same styles object below...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  navbar: { height: 60, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#e1e8ed' },
  logo: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  cartBadge: { backgroundColor: '#1a1a1a', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  cartBadgeText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  searchBarContainer: { flexDirection: 'row', padding: 12, gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  inputField: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 10, backgroundColor: '#f9f9f9' },
  gridContainer: { padding: 12, alignItems: Platform.OS === 'web' ? 'flex-start' : 'stretch' },
  loader: { flex: 1, justifyContent: 'center' },
  emptyResults: { textAlign: 'center', marginTop: 40, color: '#777', fontSize: 14 }
});
