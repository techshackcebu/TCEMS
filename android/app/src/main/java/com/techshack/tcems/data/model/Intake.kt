package com.techshack.tcems.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Intake(
    val id: String,
    val deviceType: String,
    val model: String,
    val serialNumber: String,
    val customerId: String,
    val status: String,
    val intakeDate: String
)
