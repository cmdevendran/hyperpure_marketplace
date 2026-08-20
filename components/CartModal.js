import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useCartStore } from "../store/useCartStore";

export default function CartModal({ visible, onClose }) {
  const {
    cart,
    removeFromCart,
    clearCart,
    deliveryAddress,
    setDeliveryAddress,
  } = useCartStore();

  const handleInputChange = (field, value) => {
    setDeliveryAddress({ [field]: value });
  };

  const handleCheckout = () => {
    const { fullName, address, city, pincode, phone } = deliveryAddress;

    if (
      !address?.trim() ||
      !city?.trim() ||
      !pincode?.trim() ||
      !phone?.trim()
    ) {
      const errorMsg =
        "Please complete all required delivery details (Street Address, City, Pincode, and Phone) before checking out.";
      if (Platform.OS === "web") {
        alert(errorMsg);
      } else {
        Alert.alert("Missing Delivery Details", errorMsg);
      }
      return;
    }

    const totalUnits = cart.reduce((s, i) => s + i.cartQuantity, 0);
    const summary = `Order placed successfully!\n\nDelivery Details:\n${fullName ? fullName + "\n" : ""}${address}\n${city} - ${pincode}\nPhone: ${phone}\n\nTotal Units: ${totalUnits}`;

    if (Platform.OS === "web") {
      alert(summary);
    } else {
      Alert.alert("Order Confirmed", summary);
    }

    clearCart();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart & Checkout</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.list}>
          {cart.length === 0 ? (
            <Text style={styles.emptyText}>Your cart is empty.</Text>
          ) : (
            <>
              <Text style={styles.sectionHeader}>Cart Items</Text>
              {cart.map((item) => {
                const id = item._id?.$oid || item._id;
                return (
                  <View key={id} style={styles.cartItem}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle}>{item.product_name}</Text>
                      <Text style={styles.itemMeta}>
                        Qty: {item.cartQuantity} {item.uom_code}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFromCart(id)}>
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}

              <View style={styles.deliverySection}>
                <Text style={styles.sectionHeader}>
                  Delivery Address Details
                </Text>

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Recipient Full Name"
                  value={deliveryAddress.fullName}
                  onChangeText={(val) => handleInputChange("fullName", val)}
                />

                <Text style={styles.label}>Street / Delivery Address *</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="House / Flat No., Street, Area"
                  value={deliveryAddress.address}
                  onChangeText={(val) => handleInputChange("address", val)}
                  multiline
                />

                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.label}>City *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChangeText={(val) => handleInputChange("city", val)}
                    />
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.label}>Pincode / Zip *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Pincode"
                      value={deliveryAddress.pincode}
                      onChangeText={(val) => handleInputChange("pincode", val)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contact Phone Number"
                  value={deliveryAddress.phone}
                  onChangeText={(val) => handleInputChange("phone", val)}
                  keyboardType="phone-pad"
                />
              </View>
            </>
          )}
        </ScrollView>

        {cart.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>
                Checkout ({cart.reduce((s, i) => s + i.cartQuantity, 0)} Units)
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  closeBtn: { padding: 8 },
  closeText: { color: "#0070f3", fontWeight: "600" },
  list: { padding: 20 },
  emptyText: { textAlign: "center", color: "#888", marginTop: 40 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 15,
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
  },
  itemTitle: { fontSize: 15, fontWeight: "600" },
  itemMeta: { fontSize: 13, color: "#666", marginTop: 2 },
  removeText: { color: "#ff3b30", fontSize: 13 },
  deliverySection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  multilineInput: { height: 70, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 10 },
  col: { flex: 1 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    gap: 10,
  },
  clearBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  clearText: { fontWeight: "600" },
  checkoutBtn: {
    flex: 2,
    backgroundColor: "#00aa66",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "bold" },
});
