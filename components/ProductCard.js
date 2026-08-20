// components/ProductCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';

export default function ProductCard({ product, onAddToCart, cartQuantity }) {
  const isOutOfStock = product.quantity <= 0;
console.log(JSON.stringify(product));
  // FIX: Strip out the explicit port :443 that crashes native iOS/Android network image decoders
  const sanitizedImageUrl = product.product_image_url
    ? product.product_image_url.replace(':443', '')
    : 'https://placeholder.com'; // Fallback visual safe check

  return (
    <View style={styles.card}>
      {/* Updated to source the sanitized asset url variable */}
      <Image source={{ uri: sanitizedImageUrl }} style={styles.image} />
      
      <View style={styles.body}>
        <Text style={styles.tag}>{product.category_id} / {product.sub_cat_id}</Text>
        <Text style={styles.title}>{product.product_name}</Text>
        <Text style={styles.desc} numberOfLines={2}>{product.product_desc}</Text>
        
        <Text style={styles.stock}>
          Available: {product.quantity} {product.uom_code} 
          {cartQuantity > 0 && <Text style={styles.inCart}> ({cartQuantity} in cart)</Text>}
        </Text>
        <Text style={styles.stock}>
          Price: {product.price} 
          {cartQuantity > 0 && <Text style={styles.inCart}> ({cartQuantity} in cart)</Text>}
        </Text>

        <Text style={styles.stock}>
          Payment: Cash on Delivery 
          {cartQuantity > 0 && <Text style={styles.inCart}> ({cartQuantity} in cart)</Text>}
        </Text>

        <TouchableOpacity 
          style={[styles.btn, isOutOfStock && styles.btnDisabled]} 
          onPress={() => onAddToCart(product)}
          disabled={isOutOfStock}
        >
          <Text style={styles.btnText}>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    flex: 1,
    minWidth: Platform.OS === 'web' ? 280 : '90%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
      default: { elevation: 2 }
    })
  },
  // Ensure width and height are strictly defined so mobile layout renders structural containers correctly
  image: { 
    width: '100%', 
    height: 180, 
    backgroundColor: '#f5f5f5',
    resizeMode: 'cover'
  },
  body: { padding: 16 },
  tag: { fontSize: 10, fontWeight: 'bold', color: '#0070f3', textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4, color: '#1a1a1a' },
  desc: { fontSize: 13, color: '#666', marginBottom: 12 },
  stock: { fontSize: 12, fontWeight: '600', color: '#444', marginBottom: 12 },
  inCart: { color: '#00aa66', fontWeight: 'bold' },
  btn: { backgroundColor: '#0070f3', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#ccc' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 }
});
