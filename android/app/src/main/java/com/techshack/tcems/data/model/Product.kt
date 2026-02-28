package com.techshack.tcems.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Product(
    val id: String,
    val name: String,
    val description: String? = null,
    val price: Double,
    val stockQuantity: Int,
    val sku: String
)
