package com.example.grocerymanager;

public class Item {
    private String name;
    private String expiry;
    private int quantity;
    private int itemId;

    public Item(String name, String expiry, int quantity, int itemId) {
        this.name = name;
        this.expiry = expiry;
        this.quantity = quantity;
        this.itemId = itemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExpiry() {
        return expiry;
    }

    public void setExpiry(String expiry) {
        this.expiry = expiry;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public int getItemId(){return itemId;}
    public void setItemId(int itemId){
        this.itemId = itemId;
    }
}
