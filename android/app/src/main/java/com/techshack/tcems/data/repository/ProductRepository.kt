package com.techshack.tcems.data.repository

import com.techshack.tcems.data.model.Product
import com.techshack.tcems.data.remote.SupabaseClient
import io.github.jan.supabase.postgrest.from

class ProductRepository {
    private val client = SupabaseClient.client

    suspend fun getProducts(): List<Product> {
        return client.from("products").select().decodeList<Product>()
    }

    suspend fun getProduct(id: String): Product? {
        return client.from("products").select {
            filter {
                eq("id", id)
            }
        }.decodeSingleOrNull<Product>()
    }
}
