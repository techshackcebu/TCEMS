package com.techshack.tcems.data.repository

import com.techshack.tcems.data.model.Intake
import com.techshack.tcems.data.remote.SupabaseClient
import io.github.jan.supabase.postgrest.from

class IntakeRepository {
    private val client = SupabaseClient.client

    suspend fun createIntake(intake: Intake) {
        client.from("intakes").insert(intake)
    }

    suspend fun getIntakes(): List<Intake> {
        return client.from("intakes").select().decodeList<Intake>()
    }
}
